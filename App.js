import React from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import AppNav from "./src/components/nav/App";
import * as ErrorRecovery from "expo-error-recovery";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
  "Require cycle"
]);

const defaultErrorHandler = ErrorUtils.getGlobalHandler();

const globalErrorHandler = (err, isFatal) => {
  console.log("globalErrorHandler called!");
  ErrorRecovery.setRecoveryProps({ info: err });
  defaultErrorHandler(err, isFatal);
};

ErrorUtils.setGlobalHandler(globalErrorHandler);

const App = () => {
  return (
    <View style={styles.container}>
      <AppNav />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
