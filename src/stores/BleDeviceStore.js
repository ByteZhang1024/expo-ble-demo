import {
  makeAutoObservable,
  runInAction,
  configure,
  computed,
  autorun,
  action,
  observable,
  makeObservable,
} from "mobx";
import bleUtils from "../util/BleUtils";
import { isOnekeyDevice } from "../util/OnekeyHardware";
import { toastLong } from "../util/ToastUtil";

let scanTimer = null;

configure({
  enforceActions: "never",
});

class BleDeviceStore {
  isScaning = false;
  isConnecting = false;
  connectedDeviceMap = new Map();
  findedDeviceMap = new Map();
  connectedDevices = [];
  findedDevices = [];

  constructor() {
    makeObservable(this, {
      isScaning: observable,
      isConnecting: observable,
      connectedDeviceMap: observable,
      findedDeviceMap: observable,
      connectedDevices: observable,
      findedDevices: observable,
      initConnectedDevices: action.bound,
      scanDevices: action.bound,
      stopScanDevices: action.bound,
      connect: action.bound,
      disconnect: action.bound,
    });
    this.initConnectedDevices();

    this.connectedDevices = autorun(() => {
      this.connectedDevices = [...this.connectedDeviceMap.values()];
    });
    this.findedDevices = autorun(() => {
      this.findedDevices = [...this.findedDeviceMap.values()];
    });
  }

  initConnectedDevices() {
    console.log("查找已经连接过的设备");
    bleUtils
      .findConnectedDevices()
      .then((devices) => {
        console.log("已经连接过的");
        console.log(JSON.stringify(devices));
        devices.forEach((device) => {
          console.log("已经连接过的", device.id, device.name);
          if (isOnekeyDevice(device)) {
            device.connceted = true;
            this.connectedDeviceMap.set(device.id, device);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async isConnected(deviceId) {
    const exists = this.connectedDeviceMap.has(deviceId);
    return (
      exists == true && this.connectedDeviceMap.get(deviceId).isConnected()
    );
  }

  scanDevices(searchTime = 10) {
    console.log("开始搜索蓝牙");

    Promise.resolve()
      .then(() => {
        if (this.isScaning == true) {
          console.log("停止搜索蓝牙");
          bleUtils.stopScan();
        }
      })
      .then(() => {
        console.log("修改状态");
        runInAction(() => {
          this.isScaning = true;
          this.findedDeviceMap.clear();
        });
      })
      .then(() => {
        console.log("搜索中");
        bleUtils.startDeviceScan(
          (device) => {
            if (isOnekeyDevice(device)) {
              const exists = this.findedDeviceMap.has(device.id);
              if (!exists) {
                runInAction(() => {
                  // 使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                  this.findedDeviceMap.set(device.id, device);
                  console.log(device.id, device.name);
                });
              }
            }
          },
          [],
          searchTime
        );
      })
      .catch((error) => {
        runInAction(() => {
          this.scaning = false;
        });

        console.log("startDeviceScan error:", error);
        toastLong(error);
      });
  }

  stopScanDevices() {
    if (this.isScaning == true) {
      bleUtils
        .stopScan()
        .then(() => {
          runInAction(() => {
            this.isScaning = false;
            console.log("停止蓝牙搜索");
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  connect(device) {
    return new Promise(async (resolve, reject) => {
      if (this.isScaning) {
        //连接的时候正在扫描，先停止扫描
        this.stopScanDevices();
      }

      if (await this.isConnected(device.id)) {
        console.log(device.id, "已经连接");
        resolve(false);
        return;
      }

      if (this.isConnecting) {
        console.log("有设备正在连接");
        reject();
        return;
      }
      runInAction(() => {
        device.connecting = true;
        this.isConnecting = true;
      });
      bleUtils
        .connect(device.id)
        .then(
          runInAction(() => {
            console.log("连接成功");
            device.connected = true;
            this.connectedDeviceMap.set(device.id, device);
            this.onDeviceDisconnect(device.id);
            resolve(device);
          })
        )
        .catch(
          runInAction((err) => {
            device.connected = false;
            reject(err);
          })
        )
        .finally(() => {
          runInAction(() => {
            device.connecting = false;
            this.isConnecting = false;
          });
        });
    });
  }

  disconnect(device) {
    bleUtils.disconnect(device.id).then((res) => {
      if (res) {
        this.connectedDeviceMap.delete(device.id);
      }
    });
  }

  onDeviceDisconnect(peripheralId) {
    bleUtils.manager.onDeviceDisconnected(peripheralId, (error, device) => {
      runInAction(() => {
        this.connectedDeviceMap.delete(peripheralId);
      });
      if (error) {
        // 蓝牙遇到错误自动断开
        console.log("onDeviceDisconnected", "device disconnect", error);
      } else {
        console.log(
          "onDeviceDisconnected",
          "device disconnect",
          device.id,
          device.name
        );
      }
    });
  }
}

const bleDeviceStore = new BleDeviceStore();

export default bleDeviceStore;
