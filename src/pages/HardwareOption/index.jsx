// import OneKeyConnect from "@onekeyhq/connect";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/core";
import React, { Component, useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import bleUtils from "../../util/BleUtils";
import { Handler } from "../../util/BleHandler";
import OneKeyConnect from "../../trezor-connect";

const HardwareOption = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const device = route.params.device;

  const [hardwareInfo, setHardwareInfo] = useState(null);
  const [pinInfo, setPinInfo] = useState(null);

  const [readServiceUUID, setReadServiceUUID] = useState([]);
  const [readCharacteristicUUID, setHeadCharacteristicUUID] = useState([]);
  const [writeWithResponseServiceUUID, setWriteWithResponseServiceUUID] =
    useState([]);
  const [
    writeWithResponseCharacteristicUUID,
    setWriteWithResponseCharacteristicUUID,
  ] = useState([]);
  const [writeWithoutResponseServiceUUID, setWriteWithoutResponseServiceUUID] =
    useState([]);
  const [
    writeWithoutResponseCharacteristicUUID,
    setWriteWithoutResponseCharacteristicUUID,
  ] = useState([]);
  const [nofityServiceUUID, setNofityServiceUUID] = useState([]);
  const [nofityCharacteristicUUID, setNofityCharacteristicUUID] = useState([]);

  useEffect(() => {
    async function fetchBleDeviceData() {
      const device_1 = await device.discoverAllServicesAndCharacteristics();
      const services = await bleUtils.fetchServicesAndCharacteristicsForDevice(
        device_1
      );

      const readServiceUUID = [];
      const readCharacteristicUUID = [];
      const writeWithResponseServiceUUID = [];
      const writeWithResponseCharacteristicUUID = [];
      const writeWithoutResponseServiceUUID = [];
      const writeWithoutResponseCharacteristicUUID = [];
      const nofityServiceUUID = [];
      const nofityCharacteristicUUID = [];

      for (let i in services) {
        // console.log('service',services[i]);
        let charchteristic = services[i].characteristics;
        for (let j in charchteristic) {
          // console.log('charchteristic',charchteristic[j]);
          if (charchteristic[j].isReadable) {
            readServiceUUID.push(services[i].uuid);
            readCharacteristicUUID.push(charchteristic[j].uuid);
          }
          if (charchteristic[j].isWritableWithResponse) {
            writeWithResponseServiceUUID.push(services[i].uuid);
            writeWithResponseCharacteristicUUID.push(charchteristic[j].uuid);
          }
          if (charchteristic[j].isWritableWithoutResponse) {
            writeWithoutResponseServiceUUID.push(services[i].uuid);
            writeWithoutResponseCharacteristicUUID.push(charchteristic[j].uuid);
          }
          if (charchteristic[j].isNotifiable) {
            nofityServiceUUID.push(services[i].uuid);
            nofityCharacteristicUUID.push(charchteristic[j].uuid);
          }
        }
      }

      setReadServiceUUID(readServiceUUID);
      setHeadCharacteristicUUID(readCharacteristicUUID);
      setWriteWithResponseServiceUUID(writeWithResponseServiceUUID);
      setWriteWithResponseCharacteristicUUID(
        writeWithResponseCharacteristicUUID
      );
      setWriteWithoutResponseServiceUUID(writeWithoutResponseServiceUUID);
      setWriteWithoutResponseCharacteristicUUID(
        writeWithoutResponseCharacteristicUUID
      );
      setNofityServiceUUID(nofityServiceUUID);
      setNofityCharacteristicUUID(nofityCharacteristicUUID);
    }

    OneKeyConnect.init({
      env: "react-native",
      ble: Handler,
      debug: false,
    })
      .then(() => {
        console.log("OneKeyConnect 初始化成功");
      })
      .catch((err) => {
        console.error("OneKeyConnect 初始化失败", err);
      });

    fetchBleDeviceData();
  }, []);

  return (
    <>
      {isFocused && <StatusBar barStyle="light-content" />}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View style={{ marginHorizontal: 10, marginTop: 30 }}>
          <Button
            title={"获取硬件信息"}
            style={{ color: "black", marginTop: 5 }}
            onPress={() => {
              OneKeyConnect.getFeatures()
                .then((features) => {
                  console.log("getFeatures ###############");
                  console.log(JSON.stringify(features));
                  setHardwareInfo(JSON.stringify(features));
                  console.log("#############");
                })
                .catch((err) => console.log("error occur....."));
            }}
          />
          <View style={styles.content}>
            <Text>info:</Text>
            <Text>{hardwareInfo}</Text>
          </View>
        </View>

        <View style={{ marginHorizontal: 10, marginTop: 30 }}>
          <Button
            title={"修改 Pin 码"}
            style={{ color: "black", marginTop: 5 }}
            onPress={() => {
              OneKeyConnect.changePin({})
                .then((features) => {
                  console.log("###############");
                  console.log(features);
                  setPinInfo(JSON.stringify(features));
                  console.log("#############");
                })
                .catch((err) => console.log("error occur....."));
            }}
          />
          <View style={styles.content}>
            <Text>info:</Text>
            <Text>{pinInfo}</Text>
          </View>
        </View>

        <View style={styles.deviceContent}>
          <Text style={styles.deviceUUidTitle}>硬件信息:</Text>
          <Text>{device.id}</Text>
          <Text>{device.name}</Text>

          <Text style={styles.deviceUUidTitle}>readServiceUUID:</Text>
          {readServiceUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
          <Text style={styles.deviceUUidTitle}>readCharacteristicUUID:</Text>
          {readCharacteristicUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
          <Text style={styles.deviceUUidTitle}>
            writeWithResponseServiceUUID:
          </Text>
          {writeWithResponseServiceUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
          <Text style={styles.deviceUUidTitle}>
            writeWithResponseCharacteristicUUID:
          </Text>
          {writeWithResponseCharacteristicUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
          <Text style={styles.deviceUUidTitle}>
            writeWithoutResponseServiceUUID:
          </Text>
          {writeWithoutResponseServiceUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
          <Text style={styles.deviceUUidTitle}>
            writeWithoutResponseCharacteristicUUID:
          </Text>
          {writeWithoutResponseCharacteristicUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
          <Text style={styles.deviceUUidTitle}>nofityServiceUUID:</Text>
          {nofityServiceUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
          <Text style={styles.deviceUUidTitle}>nofityCharacteristicUUID:</Text>
          {nofityCharacteristicUUID.map((uuid) => {
            return <Text>{uuid}</Text>;
          })}
        </View>
      </ScrollView>
    </>
  );
};

// OneKeyConnect.init({
//   connectSrc: "https://localhost:8088/",
//   lazyLoad: true, // 开启 lazyLoad 会直到调用 OneKeyConnect 方法后才会初始化 iframe.
//   manifest: {
//     email: "hi@onekey.so",
//     appUrl: "https://onekey.so",
//   },
// });

// OneKeyConnect.getCoinInfo({
//   coin: "btc",
// })
//   .then((data) => {
//     console.error(data);
//   })
//   .catch((e) => {
//     console.error(e);
//   });
// OneKeyConnect.ethereumGetAddress()

export default HardwareOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: Platform.OS == "ios" ? 20 : 0,
  },
  item: {
    flexDirection: "column",
    borderColor: "rgb(235,235,235)",
    borderStyle: "solid",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingVertical: 8,
  },
  buttonView: {
    height: 30,
    backgroundColor: "rgb(33, 150, 243)",
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  content: {
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    borderColor: "#cccccc",
    borderRadius: 5,
    borderWidth: 1,
  },
  deviceContent: {
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 6,
    borderColor: "#cccccc",
    borderRadius: 5,
    borderWidth: 5,
  },
  deviceUUidTitle: {
    color: "#FF0000",
    padding: 8,
    marginTop: 8,
  },
  textInput: {
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "white",
    height: 50,
    fontSize: 16,
    flex: 1,
  },
});
