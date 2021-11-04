import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { tailwind } from "../../../util/tailwind";

const PrivacyKeyboard = (props) => {
  let { showList, columnNumber, onPress } = props;
  if (!columnNumber) columnNumber = 3;
  
  var result = [];
  for (var i = 0, len = showList.length; i < len; i += 3) {
    result.push(showList.slice(i, i + 3));
  }

  return (
    <View style={tailwind("okd-flex okd-w-full okd-bg-white okd-items-center")}>
      {result.map((row, index) => (
        <View
          style={tailwind("okd-flex-row okd-h-14 okd-w-full")}
          key={"row" + index}
        >
          {row.map((column, columnIndex) => (
            <Text
              key={"column" + index * columnNumber + columnIndex}
              style={styles.buttonItem}
              onPress={() => {
                onPress(index * columnNumber + columnIndex);
              }}
            >
              {column}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

export default PrivacyKeyboard;

const styles = StyleSheet.create({
  buttonItem: {
    ...tailwind(
      "okd-flex-1 okd-text-3xl okd-m-0.5 okd-text-center okd-rounded-sm okd-border okd-border-gray-300"
    ),
  },
});
