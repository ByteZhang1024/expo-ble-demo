import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import OneKeyConnect from "../../../trezor-connect";
import { tailwind } from "../../../util/tailwind";
import { toastShort } from "../../../util/ToastUtil";
import PrivacyKeyboard from "../../view/PrivacyKeyboard";

const HardwareModel = () => {
  const CURRENT = 0;
  const NEW_FRIST = 1;
  const NEW_SECOND = 2;

  const [isInputPinVisible, setInputPinVisible] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const [inputHintTitle, setInputHintTitle] = useState("");
  const [requestPinType, setRequestType] = useState(CURRENT);

  useEffect(() => {
    async function init() {
      OneKeyConnect.on("UI_EVENT", (event) => {
        event.payload.device = "null";
        console.log("收到 UI_EVENT 回调", JSON.stringify(event));
        if (event.type === "ui-button" /* REQUEST_BUTTON */) {
          // 处理硬件操作
          // "code":"ButtonRequest_ProtectCall" 相应按键
        }

        if (event.type == "ui-request_pin" /* REQUEST_PIN */) {
          setInputPinVisible(true);
          if (event.payload.type == "PinMatrixRequestType_Current") {
            //输入当前 Pin 码
            setRequestType(CURRENT);
          } else if (event.payload.type == "PinMatrixRequestType_NewFirst") {
            //输入要新设置的 Pin 码
            setRequestType(NEW_FRIST);
          } else if (event.payload.type == "PinMatrixRequestType_NewSecond") {
            //再次要新设置的 Pin 码
            setRequestType(NEW_SECOND);
          }
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    switch (requestPinType) {
      case CURRENT:
        setInputHintTitle("输入当前 Pin 码");
        break;
      case NEW_FRIST:
        setInputHintTitle("输入新 Pin 码");
        break;
      case NEW_SECOND:
        setInputHintTitle("再次新 Pin 码");
        break;
      default:
        break;
    }
  }, [requestPinType]);

  const inputNumber = (number) => {
    if (inputPin.length < 9) setInputPin(inputPin + number);
    else toastShort("最长只能输入 9 个");
  };
  const deleteInputNumber = () => {
    if (inputPin.length > 0)
      setInputPin(inputPin.substring(0, inputPin.length - 1));
    else toastShort("请输入 Pin 码");
  };
  const configPin = () => {
    if (inputPin.length > 0) {
      OneKeyConnect.uiResponse({ type: "ui-receive_pin", payload: inputPin });
      setInputPinVisible(false);
      setInputPin("");
    } else toastShort("请输入 Pin 码");
  };

  return (
    <View>
      <Modal
        isVisible={isInputPinVisible}
        swipeDirection={["down"]}
        style={styles.modal}
      >
        <View
          style={tailwind(
            "okd-p-4 okd-rounded-t okd-flex okd-bg-white okd-items-center"
          )}
        >
          <Text style={tailwind("okd-text-xl")}>{inputHintTitle}</Text>
          <TextInput
            secureTextEntry={true}
            style={tailwind(
              "okd-rounded-sm okd-m-4 okd-p-4 okd-text-lg okd-p-1 okd-w-4/6 okd-border-solid okd-border-2 okd-border-gray-500"
            )}
            value={inputPin}
          />

          <PrivacyKeyboard
            showList={["•", "•", "•", "•", "•", "•", "•", "•", "•"]}
            onPress={(index) => {
              const list = [7, 8, 9, 4, 5, 6, 1, 2, 3];
              const number = list[index];
              inputNumber(number);
            }}
          />

          <View style={tailwind("okd-flex-row okd-m-6 okd-h-14")}>
            <Text
              style={styles.buttonItem}
              onPress={() => {
                deleteInputNumber();
              }}
            >
              {inputPin.length == 0 ? "取消" : "删除"}
            </Text>
            <Text
              style={styles.buttonItem}
              onPress={() => {
                configPin();
              }}
            >
              确定
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HardwareModel;

const styles = StyleSheet.create({
  modal: {
    ...tailwind("okd-container"),
    justifyContent: "flex-end",
    margin: 0,
  },
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  buttonRow: {},
  buttonItem: {
    ...tailwind(
      "okd-flex-1 okd-text-3xl okd-m-0.5 okd-text-center okd-rounded-sm okd-border okd-border-gray-300"
    ),
  },
});
