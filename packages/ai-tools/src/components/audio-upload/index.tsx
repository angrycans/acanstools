import { Video, View, ScrollView } from "@tarojs/components";
import { clsx } from "clsx";
import "./index.scss";
import React, { useState } from "react";
import {
  Steps,
  Step,
  Picker,
  Cell,
  TextArea,
  Uploader,
  Button,
  Switch,
  FixedNav,
} from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import { PlayStart, PlayStop, Failure } from "@nutui/icons-react-taro";
import { Toast } from "@nutui/nutui-react-taro";

const Index = () => {
  console.log(
    "Index 1",
    process.env.TARO_APP_SERVER_HOST + "/api/v1/file/upload",
  );
  const [visible, setVisible] = useState(false);
  const change = (value: boolean) => {
    setVisible(value);
  };

  return (
    <>
      <Toast id="audio" />

      <View className="mr-[10px] mx-auto flex justify-center ">
        <PlayStart />
        <span>03:20</span>
      </View>
      <Button
        onClick={() => {
          console.log("Button clicked");
          tt.filePicker({
            maxNum: 1,
            pickerTitle: "Select a file",
            pickerConfirm: "Confirm",
            isSystem: false,
            success(res) {
              console.log("pick 3", JSON.stringify(res));
              console.log(
                "uplaod start url",
                process.env.TARO_APP_SERVER_HOST + "/api/v1/file/upload",
              );

              Taro.uploadFile({
                //url: "http://192.168.2.20:7002/upload/image",
                url: process.env.TARO_APP_SERVER_HOST + "/api/v1/file/upload",
                filePath: res.list[0].path,
                name: "image",
                // formData: {
                //   overwrite: "true",
                // },
                success(res) {
                  const data = res.data;
                  console.log("upload ok", data);
                  //do something
                },
                fail(res) {
                  console.log("upload fail", res);
                  Toast.show("audio", {
                    //title: "音频上传成功",
                    content: "音频上传失败",
                    type: "fail",
                    duration: 2,
                    position: "center",
                    icon: <Failure />,
                    lockScroll: true,
                    onClose: () => {
                      console.log("close");
                    },
                  });
                },
              });
            },
            fail(res) {
              console.log(`filePicker fail: ${JSON.stringify(res)}`);
              Toast.show("audio", {
                //title: "音频上传成功",
                content: "音频文件选择失败",
                type: "fail",
                duration: 2,
                position: "center",
                icon: <Failure />,
                lockScroll: true,
                onClose: () => {
                  console.log("close");
                },
              });
            },
          });
        }}
      >
        上传音频
      </Button>
    </>
  );
};

export default Index;
