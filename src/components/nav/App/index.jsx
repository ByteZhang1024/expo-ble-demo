import React, { useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Main from "../Main";
import HardwareOption from "../../../pages/HardwareOption";

const Stack = createStackNavigator();

const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="main">
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="main" component={Main} />
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
  );
};

export default AppNav;
