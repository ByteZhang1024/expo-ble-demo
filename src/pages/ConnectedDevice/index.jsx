import React, { useContext } from "react";
import { Observer } from "mobx-react-lite";
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useStores } from "../../hooks/use_store";
import { useNavigation } from "@react-navigation/core";
import { Handler } from "../../util/BleHandler";
const ConnectedDevice = () => {
  const { bleDeviceStore } = useStores();
  const navigation = useNavigation();

  const renderItem = (item) => {
    const device = item.item;

    return (
      <View
        activeOpacity={0.7}
        disabled={bleDeviceStore.isConnecting ? true : false}
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
        <View style={{ paddingTop: 10 }}>
          <Button
            title="断开连接"
            onPress={() => {
              bleDeviceStore.disconnect(device);
            }}
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <Button
            title="操作钱包"
            onPress={() => {
              navigation.navigate("hardwareOption", { device: device });
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <Observer>
      {() => (
        <SafeAreaView style={styles.container}>
          <FlatList
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            data={bleDeviceStore.connectedDevices}
            keyboardShouldPersistTaps="handled"
          />
        </SafeAreaView>
      )}
    </Observer>
  );
};

export default ConnectedDevice;

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
    height: 80,
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
