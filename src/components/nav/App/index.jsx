import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Main from "../Main";
import HardwareOption from "../../../pages/HardwareOption";
import OneKeyConnect from "../../../trezor-connect";
import HardwarePin from "../../../pages/HardwarePin";
import HardwareModel from "../../models/HardwareModel";
import { View } from "react-native";

const Stack = createStackNavigator();

const AppNav = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="main">
          <Stack.Group
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="main" component={Main} />
            <Stack.Screen name="password" component={HardwarePin} />
          </Stack.Group>

          <Stack.Group
            screenOptions={{
              headerShown: true,
            }}
          >
            <Stack.Screen
              name="hardwareOption"
              component={HardwareOption}
              initialParams={{ device: undefined }}
              options={{
                title: "操作硬件钱包",
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      <HardwareModel />
    </View>
  );
};

export default AppNav;
