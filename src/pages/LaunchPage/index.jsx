import { useNavigation } from "@react-navigation/core";
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import bleUtils from "../../util/BleUtils";

const LaunchView = () => {
  const navigation = useNavigation();

  useEffect(() => {
    bleUtils
      .init()
      .then(() => {
        console.log("蓝牙初始化成功");
        navigation.replace("main");
      })
      .catch((error) => {
        console.error("蓝牙初始化失败", error);
      });
  });

  return (
    <View
      style={{
        marginTop: 300,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Image source={require("../../../assets/favicon.png")}></Image>
    </View>
  );
};

export default LaunchView;
