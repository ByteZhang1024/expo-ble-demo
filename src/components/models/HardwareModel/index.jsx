import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
        let newEvent = JSON.parse(JSON.stringify(event));
        if (newEvent.payload && newEvent.payload.device) {
          newEvent.payload.device = undefined;
        }
        console.log("### UI_EVENT ###", JSON.stringify(event));

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
        return event;
      });

      OneKeyConnect.on("DEVICE_EVENT", (event) => {
        let newEvent = JSON.parse(JSON.stringify(event));
        if (newEvent.payload) {
          if (newEvent.payload.device) {
            newEvent.payload.device = undefined;
          }
          if (newEvent.payload.firmwareRelease) {
            newEvent.payload.firmwareRelease = undefined;
          }
          if (newEvent.payload.bleFirmwareRelease) {
            newEvent.payload.bleFirmwareRelease = undefined;
          }
          if (newEvent.payload.features) {
            newEvent.payload.features = undefined;
          }
        }

        console.log("### DEVICE_EVENT ###", JSON.stringify(newEvent));
        return event;
      });

      OneKeyConnect.on("RESPONSE_EVENT", (event) => {
        let newEvent = JSON.parse(JSON.stringify(event));

        if (newEvent.payload && newEvent.payload.device) {
          newEvent.payload.device = undefined;
        }
        console.log("### RESPONSE_EVENT ###", JSON.stringify(newEvent));
        return event;
      });

      OneKeyConnect.on("TRANSPORT_EVENT", (event) => {
        let newEvent = JSON.parse(JSON.stringify(event));

        if (newEvent.payload && newEvent.payload.device) {
          newEvent.payload.device = undefined;
        }
        console.log("### TRANSPORT_EVENT ###", JSON.stringify(newEvent));
        return event;
      });

      OneKeyConnect.on("BLOCKCHAIN_EVENT", (event) => {
        let newEvent = JSON.parse(JSON.stringify(event));

        if (newEvent.payload && newEvent.payload.device) {
          newEvent.payload.device = undefined;
        }
        console.log("### BLOCKCHAIN_EVENT ###", JSON.stringify(newEvent));
        return event;
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
            <TouchableOpacity
              style={styles.buttonItem}
              onPress={() => {
                deleteInputNumber();
              }}
            >
              <Text style={styles.buttonItemText}>
                {inputPin.length == 0 ? "取消" : "删除"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonItem}
              onPress={() => {
                configPin();
              }}
            >
              <Text style={styles.buttonItemText}>确定</Text>
            </TouchableOpacity>
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
      "okd-flex-1 okd-m-0.5 okd-rounded-sm okd-border okd-border-gray-300 okd-bg-gray-500"
    ),
  },
  buttonItemText: {
    ...tailwind("okd-flex-1 okd-text-xl okd-text-center okd-text-white"),
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
