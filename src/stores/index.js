import BleDeviceStore from "./BleDeviceStore";
import BleExchange from "./BleExchange";

let bleDeviceStore = BleDeviceStore;
let bleExchange = new BleExchange();
// let bleDeviceStore = bleDeviceStore;

const stores = {
  bleDeviceStore,
  bleExchange,
};

export default stores;
