import { Observer } from "mobx-react-lite";
import React, { useContext } from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStores } from "../../hooks/use_store";

const FindBleDevice = () => {
  const { bleDeviceStore } = useStores();

  const renderHeader = () => {
    return (
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.buttonView,
            { marginHorizontal: 10, height: 40, alignItems: "center" },
          ]}
          onPress={() => {
            bleDeviceStore.isScaning
              ? bleDeviceStore.stopScanDevices()
              : bleDeviceStore.scanDevices();
          }}
        >
          <Text style={styles.buttonText}>
            {bleDeviceStore.isScaning ? "正在搜索中" : "搜索蓝牙"}
          </Text>
        </TouchableOpacity>

        <Text style={{ marginLeft: 10, marginTop: 10 }}>{"可用设备"}</Text>
      </View>
    );
  };

  const renderItem = (item) => {
    const device = item.item;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={bleDeviceStore.isConnecting ? true : false}
        onPress={() => {
          bleDeviceStore.connect(device);
        }}
        style={styles.item}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "black" }}>
            {device.name ? device.name : ""}
          </Text>
          <Text style={{ color: "red", marginLeft: 50 }}>
            {device.connecting ? "连接中..." : ""}
          </Text>
        </View>
        <Text>{device.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Observer>
      {() => (
        <SafeAreaView style={styles.container}>
          <FlatList
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            data={bleDeviceStore.findedDevices}
            ListHeaderComponent={renderHeader}
            keyboardShouldPersistTaps="handled"
          />
        </SafeAreaView>
      )}
    </Observer>
  );
};

export default FindBleDevice;

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
    marginTop: 5,
    marginBottom: 15,
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
