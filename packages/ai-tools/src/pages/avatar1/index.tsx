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
} from "@nutui/nutui-react-taro";
import { ArrowRight, Refresh, User } from "@nutui/icons-react-taro";
import Taro from "@tarojs/taro";

import ComfyUIStatus from "@/components/comfyui-status/index";
import AudioUpload from "@/components/audio-upload/index";
import VideoUpload from "@/components/video-upload/index";

const Index = () => {
  const [checkedAsync, setCheckedAsync] = useState(false);

  const [visible, setVisible] = useState(false);
  const [AudioValue, setAudioValue] = useState();
  const [VideoValue, setVideoValue] = useState();

  const [baseDesc, setBaseDesc] = useState("");
  const listData1 = [
    [
      { value: 1, text: "南京市" },
      { value: 2, text: "无锡市" },
      { value: 3, text: "海北藏族自治区" },
      { value: 4, text: "北京市" },
      { value: 5, text: "连云港市" },
      { value: 8, text: "大庆市" },
      { value: 9, text: "绥化市" },
      { value: 10, text: "潍坊市" },
      { value: 12, text: "乌鲁木齐市" },
    ],
  ];
  const changePicker = (list: any[], option: any, columnIndex: number) => {
    console.log(columnIndex, option);
  };
  const confirmPicker = (options: [], values: (string | number)[]) => {
    let description = "";
    options.forEach((option: any) => {
      description += ` ${option.text}`;
    });
    setBaseDesc(description);
  };

  const uploadUrl = "https://my-json-server.typicode.com/linrufeng/demo/posts";
  const onStart = () => {
    console.log("start触发");
  };
  const beforeUpload = async (files: File[]) => {
    console.log("beforeUpload");
    const allowedTypes = ["image/png"];
    const filteredFiles = Array.from(files).filter((file) =>
      allowedTypes.includes(file.type),
    );
    return filteredFiles;
  };

  console.log("avatar1/index.tsx", AudioValue, VideoValue);

  return (
    <View className="page_layout">
      <View className="workspace scroll">
        <ComfyUIStatus />
        <View>
          <View>
            {/* <span className="h-[225px] justify-center items-center flex bg-black">
              <Refresh className="nut-icon-am-rotate nut-icon-am-infinite" />
            </span> */}
            {/* <Video
              id="video"
              className="w-full" // Full width, 1/4 screen height
              src="http://192.168.2.20:7002/view?filename=latentsync_00004-audio.mp4"
              //poster="http://192.168.2.20:7002/view?filename=ComfyUI_00013_.png"
              initialTime={0}
              controls={true}
              autoplay={false}
              loop={false}
              muted={false}
            /> */}
          </View>
        </View>

        <Cell.Group>
          <Cell
            title="参考音频/预定义音色"
            align="flex-end"
            extra={
              <Switch
                checked={checkedAsync}
                onChange={(value, event) => {
                  console.log(value, event);
                  setCheckedAsync(value);
                }}
              />
            }
          />
          {checkedAsync && (
            <>
              <Cell
                className="nutui-cell-clickable"
                title={
                  <View
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <User />
                    <span style={{ marginLeft: "5px" }}></span>
                  </View>
                }
                align="flex-end"
                onClick={() => setVisible(!visible)}
                extra={<ArrowRight />}
              />
              <Picker
                title="选择音色"
                visible={visible}
                options={listData1}
                onConfirm={(list, values) => confirmPicker(list, values)}
                onClose={() => setVisible(false)}
                onChange={changePicker}
              />
            </>
          )}

          {!checkedAsync && (
            <Cell
              align="center"
              title="音频文件"
              extra={
                <AudioUpload value={AudioValue} onChange={setAudioValue} />
              }
            />
          )}
        </Cell.Group>

        <Cell title="想说的话" />
        <TextArea
          defaultValue=""
          className="text-1"
          style={{ fontSize: "12px" }}
          onChange={(value) => console.log("change", value)}
          onBlur={() => console.log("blur")}
          onFocus={() => console.log("focus")}
        />

        <Cell
          title="视频"
          align="flex-end"
          extra={<VideoUpload value={VideoValue} onChange={setVideoValue} />}
        />

        <View className="mx-2.5">
          <Button
            block
            type="primary"
            onClick={() => {
              console.log("submit", AudioValue);
            }}
          >
            AI
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Index;
