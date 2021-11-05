import React, { Alert, Platform, NativeEventEmitter } from "react-native";
import { Buffer } from "buffer";
import * as Location from "expo-location";
import stores from "../stores";

SERVICE_ID = "00000001-0000-1000-8000-00805f9b34fb";
WRITE_NO_RESPONSE_ID = "00000002-0000-1000-8000-00805f9b34fb";
NOTIFICATION_ID = "00000003-0000-1000-8000-00805f9b34fb";

LENGTH_FILED_START_OFFSET = 10;
LENGTH_FILED_END_OFFSET = 18;
HEAD_LENGTH = 9;
class BleUtils {
  constructor() {
    this.isConnecting = false; //蓝牙是否连接
    this.initUUID();
    this.manager = React.NativeModules.BleManager;
    this.isPeripheralConnected = this.isDeviceConnected.bind(this);
    this.bleManagerEmitter = new NativeEventEmitter(this.manager);

    this.bleManagerEmitter.addListener(
      "BleManagerDiscoverPeripheral",
      this.handleDiscoverPeripheral
    );
    this.bleManagerEmitter.addListener(
      "BleManagerStopScan",
      this.handleStopScan
    );
    this.bleManagerEmitter.addListener(
      "BleManagerDisconnectPeripheral",
      this.handleDisconnectedPeripheral
    );
    this.bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      this.handleUpdateValueForCharacteristic
    );
  }

  handleDiscoverPeripheral = (peripheral) => {
    if (this.onScanListener) {
      this.onScanListener(peripheral);
    }
  };

  handleDisconnectedPeripheral = (device) => {
    if (this.onDeviceDisconnectListener && device) {
      this.onDeviceDisconnectListener(device.peripheral);
    }
    console.log("Disconnected from " + JSON.stringify(device));
  };

  handleUpdateValueForCharacteristic = (data) => {
    console.log(
      "Received data from " +
        data.peripheral +
        " characteristic " +
        data.characteristic,
      data.value
    );
  };

  handleStopScan = () => {
    console.log("Scan is stopped");
    this.onScanListener = null;
    if (this.onStopScanListener) {
      this.onStopScanListener();
    }
  };

  /**
   * 获取蓝牙UUID
   * */
  async fetchServicesAndCharacteristicsForDevice(device) {
    var servicesMap = {};
    var services = await device.services();

    for (let service of services) {
      var characteristicsMap = {};
      var characteristics = await service.characteristics();

      for (let characteristic of characteristics) {
        characteristicsMap[characteristic.uuid] = {
          uuid: characteristic.uuid,
          isReadable: characteristic.isReadable,
          isWritableWithResponse: characteristic.isWritableWithResponse,
          isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
          isNotifiable: characteristic.isNotifiable,
          isNotifying: characteristic.isNotifying,
          value: characteristic.value,
        };
      }

      servicesMap[service.uuid] = {
        uuid: service.uuid,
        isPrimary: service.isPrimary,
        characteristicsCount: characteristics.length,
        characteristics: characteristicsMap,
      };
    }
    return servicesMap;
  }

  initUUID() {
    this.readServiceUUID = []; // ['00000001-0000-1000-8000-00805f9b34fb'];
    this.readCharacteristicUUID = [];
    this.writeWithResponseServiceUUID = [];
    this.writeWithResponseCharacteristicUUID = []; // ['00000002-0000-1000-8000-00805f9b34fb'];
    this.writeWithoutResponseServiceUUID = [];
    this.writeWithoutResponseCharacteristicUUID = []; //['00000003-0000-1000-8000-00805f9b34fb'];
    this.nofityServiceUUID = []; //['00000003-0000-1000-8000-00805f9b34fb'];
    this.nofityCharacteristicUUID = [];
  }

  //获取Notify、Read、Write、WriteWithoutResponse的serviceUUID和characteristicUUID
  getUUID(deviceId) {
    this.readServiceUUID = [];
    this.readCharacteristicUUID = [];
    this.writeWithResponseServiceUUID = [];
    this.writeWithResponseCharacteristicUUID = [];
    this.writeWithoutResponseServiceUUID = [];
    this.writeWithoutResponseCharacteristicUUID = [];
    this.nofityServiceUUID = [];
    this.nofityCharacteristicUUID = [];

    Promise.resolve().then(async () => {
      const deviceInfo = await this.manager.retrieveServices(deviceId, []);
      console.log(deviceInfo);
    });

    console.log("readServiceUUID", this.readServiceUUID);
    console.log("readCharacteristicUUID", this.readCharacteristicUUID);
    console.log(
      "writeWithResponseServiceUUID",
      this.writeWithResponseServiceUUID
    );
    console.log(
      "writeWithResponseCharacteristicUUID",
      this.writeWithResponseCharacteristicUUID
    );
    console.log(
      "writeWithoutResponseServiceUUID",
      this.writeWithoutResponseServiceUUID
    );
    console.log(
      "writeWithoutResponseCharacteristicUUID",
      this.writeWithoutResponseCharacteristicUUID
    );
    console.log("nofityServiceUUID", this.nofityServiceUUID);
    console.log("nofityCharacteristicUUID", this.nofityCharacteristicUUID);
  }

  init(options) {
    return new Promise((resolve, reject) => {
      if (options == null) {
        options = {};
      }
      if (options.showAlert == null) {
        options.showAlert = true;
      }
      this.manager.start(options, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async findConnectedDevices() {
    return this.getConnectedDevices([]);
  }

  /**
   * 搜索蓝牙
   * */
  startDeviceScan(
    listener,
    serviceUUIDs,
    seconds,
    allowDuplicates,
    scanningOptions = {}
  ) {
    if (seconds == null) {
      seconds = 15;
    }

    if (allowDuplicates == null) {
      allowDuplicates = false;
    }

    // (ANDROID) Match as many advertisement per filter as hw could allow
    // dependes on current capability and availability of the resources in hw.
    if (scanningOptions.numberOfMatches == null) {
      scanningOptions.numberOfMatches = 3;
    }

    // (ANDROID) Defaults to MATCH_MODE_AGGRESSIVE
    if (scanningOptions.matchMode == null) {
      scanningOptions.matchMode = 1;
    }

    // (ANDROID) Defaults to SCAN_MODE_LOW_POWER on android
    if (scanningOptions.scanMode == null) {
      scanningOptions.scanMode = 2; // SCAN_MODE_LOW_LATENCY
    }

    if (scanningOptions.reportDelay == null) {
      scanningOptions.reportDelay = 0;
    }

    Promise.resolve()
      .then(() => this.checkPermission())
      .then(() => {
        this.onScanListener = listener;
        this.manager.scan(
          serviceUUIDs,
          seconds,
          allowDuplicates,
          scanningOptions,
          (error) => {
            if (error) {
              console.log("startDeviceScan error:", error);
              if (error.errorCode == 102) {
                this.alert("请打开手机蓝牙后再搜索");
              }
              throw error;
            }
          }
        );
      });
  }

  /**
   * 停止搜索蓝牙
   * */
  stopScan() {
    return new Promise((resolve, reject) => {
      console.log("stopDeviceScan");
      this.manager.stopScan((error) => {
        if (error != null) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 连接蓝牙
   * */
  async connect(deviceId) {
    console.log("isConneting:", deviceId);
    this.isConnecting = true;
    try {
      await this.checkPermission();
      await new Promise((fulfill, reject) => {
        this.manager.connect(deviceId, (error) => {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
      await this.requestMTU(deviceId, 512);
      const device = await this.getConnectedDeviceInfo(deviceId);
      console.log(device);
      console.log("connect success:", device.name, device.id);
      this.peripheralId = device.id;
      this.isConnecting = false;
      await this.getUUID(deviceId);
      this.startNotification();
    } catch (err) {
      this.isConnecting = false;
      console.log("connect fail: ", err);
    }
  }

  /**
   * 断开蓝牙
   * */
  disconnect(deviceId, force = true) {
    return new Promise((fulfill, reject) => {
      this.manager.disconnect(deviceId, force, (error) => {
        if (error) {
          reject(error);
        } else {
          fulfill();
        }
      });
    });
  }

  async checkPermission() {
    if (Platform.OS == "ios") {
      return;
    }
    const permissionsStatus =
      await Location.requestForegroundPermissionsAsync();
    const { status } = permissionsStatus;
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }
  }

  /**
   * 读取数据
   * */
  read(index) {
    return new Promise((resolve, reject) => {
      this.manager
        .readCharacteristicForDevice(
          this.peripheralId,
          this.readServiceUUID[index],
          this.readCharacteristicUUID[index]
        )
        .then(
          (characteristic) => {
            let buffer = Buffer.from(characteristic.value, "base64");
            // let value = buffer.toString();
            const value = this.byteToString(buffer);
            console.log("read success", buffer, value);
            resolve(value);
          },
          (error) => {
            console.log("read fail: ", error);
            this.alert("read fail: " + error.reason);
            reject(error);
          }
        );
    });
  }

  /**
   * 写数据
   * */
  write(value, index) {
    let formatValue;
    if (value === "0D0A") {
      formatValue = value;
    } else {
      formatValue = new Buffer(value, "base64").toString("ascii");
    }
    let transactionId = "write";
    return new Promise((resolve, reject) => {
      this.manager
        .writeCharacteristicWithResponseForDevice(
          this.peripheralId,
          this.writeWithResponseServiceUUID[index],
          this.writeWithResponseCharacteristicUUID[index],
          formatValue,
          transactionId
        )
        .then(
          (characteristic) => {
            console.log("write success", value);
            resolve(characteristic);
          },
          (error) => {
            console.log("write fail: ", error);
            this.alert("write fail: ", error.reason);
            reject(error);
          }
        );
    });
  }

  /**
   * 写数据 withoutResponse
   * */
  writeWithoutResponse(value) {
    let formatValue = value;
    // if (value === "0D0A") {
    //   //直接发送小票打印机的结束标志
    //   formatValue = value;
    // } else {
    //   //发送内容，转换成base64编码
    //   // formatValue = new Buffer(value, "base64");
    //   formatValue = value;

    // }
    let transactionId = "writeWithoutResponse";
    return new Promise((resolve, reject) => {
      this.manager
        .writeCharacteristicWithoutResponseForDevice(
          this.peripheralId,
          SERVICE_ID,
          WRITE_NO_RESPONSE_ID,
          formatValue,
          transactionId
        )
        .then(
          (characteristic) => {
            console.log("ble writeWithoutResponse success", formatValue);
            resolve(characteristic);
          },
          (error) => {
            console.log("ble writeWithoutResponse fail: ", error);
            this.alert("ble writeWithoutResponse fail: ", error.reason);
            reject(error);
          }
        );
    });
  }

  startNotification() {
    this.manager
      .startNotification(this.peripheralId, SERVICE_ID, NOTIFICATION_ID)
      .then((result) => {
        console.log(
          "ble notification receive data from characteristic.......",
          Buffer.from(result.value, "base64").toString("hex")
        );
        stores.bleExchange.addBuffer(Buffer.from(result.value, "base64"));
      });
  }

  onDeviceDisconnect(listener) {
    this.onDeviceDisconnectListener = listener;
  }

  onStopScan(listener) {
    this.onStopScanListener = listener;
  }

  getConnectedDevices(serviceUUIDs) {
    return new Promise((resolve, reject) => {
      this.manager.getConnectedPeripherals(serviceUUIDs, (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result != null) {
            resolve(result);
          } else {
            resolve([]);
          }
        }
      });
    });
  }

  getConnectedDeviceInfo(deviceId) {
    return this.getConnectedDevices([]).then((result) => {
      return result.find((p) => {
        return p.id === deviceId;
      });
    });
  }

  isDeviceConnected(deviceId, serviceUUIDs) {
    return this.getConnectedDevices(serviceUUIDs).then((result) => {
      if (
        result.find((p) => {
          return p.id === deviceId;
        })
      ) {
        return true;
      } else {
        return false;
      }
    });
  }

  requestMTU(deviceId, mtu) {
    return new Promise((fulfill, reject) => {
      this.manager.requestMTU(deviceId, mtu, (error, mtu) => {
        if (error) {
          reject(error);
        } else {
          fulfill(mtu);
        }
      });
    });
  }

  /**
   * 卸载蓝牙管理器
   * */
  destroy() {
    this.bleManagerEmitter.removeListener(
      "BleManagerDiscoverPeripheral",
      this.handleDiscoverPeripheral
    );
    this.bleManagerEmitter.removeListener(
      "BleManagerStopScan",
      this.handleStopScan
    );
    this.bleManagerEmitter.removeListener(
      "BleManagerDisconnectPeripheral",
      this.handleDisconnectedPeripheral
    );
    this.bleManagerEmitter.removeListener(
      "BleManagerDidUpdateValueForCharacteristic",
      this.handleUpdateValueForCharacteristic
    );
  }

  alert(text) {
    Alert.alert("提示", text, [{ text: "确定", onPress: () => {} }]);
  }

  /**
   * 字符串转换成byte数组
   */
  stringToByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10ffff) {
        bytes.push(((c >> 18) & 0x07) | 0xf0);
        bytes.push(((c >> 12) & 0x3f) | 0x80);
        bytes.push(((c >> 6) & 0x3f) | 0x80);
        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        bytes.push(((c >> 12) & 0x0f) | 0xe0);
        bytes.push(((c >> 6) & 0x3f) | 0x80);
        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        bytes.push(((c >> 6) & 0x1f) | 0xc0);
        bytes.push((c & 0x3f) | 0x80);
      } else {
        bytes.push(c & 0xff);
      }
    }
    return bytes;
  }

  /**
   * byte数组转换成字符串
   */
  byteToString(arr) {
    if (typeof arr === "string") {
      return arr;
    }
    var str = "",
      _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        var bytesLength = v[0].length;
        var store = _arr[i].toString(2).slice(7 - bytesLength);
        for (var st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  }
}

const bleUtils = new BleUtils();

export default bleUtils;
