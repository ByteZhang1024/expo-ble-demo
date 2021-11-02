import React from "react";
import { ScrollView, Text } from "react-native";
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import FindBleDevice from "../../../pages/FindBleDevice";
import ConnectedDevice from "../../../pages/ConnectedDevice";

const getTabBarIcon =
  (iconName) =>
  ({ color, size }) =>
    <Ionicons name={iconName} color={color} size={size} />;

const BottomTabs = createBottomTabNavigator();

const TabSimpleScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && <StatusBar barStyle="light-content" />}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: tabBarHeight,
        }}
      >
        <ConnectedDevice />
      </ScrollView>
    </>
  );
};

const TabBleScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && <StatusBar barStyle="light-content" />}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: tabBarHeight,
        }}
      >
        <FindBleDevice />
      </ScrollView>
    </>
  );
};

const Main = () => {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="TabSimple"
        component={TabSimpleScreen}
        options={{
          title: "已经连接的设备",
          tabBarIcon: getTabBarIcon("help"),
        }}
      />
      <BottomTabs.Screen
        name="TabBle"
        component={TabBleScreen}
        options={{
          title: "寻找设备",
          tabBarIcon: getTabBarIcon("bluetooth"),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default Main;
