import { Video, View, ScrollView } from "@tarojs/components";
import { clsx } from "clsx";
import "./index.scss";
import React, { useEffect, useState } from "react";
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

import { useTaroRequest } from "@/tools/useRequest";

import ComfyUIStatus from "@/components/comfyui-status/index";
import AudioUpload from "@/components/audio-upload/index";
import VideoUpload from "@/components/video-upload/index";
import { useAsyncEffect } from "ahooks";

const comfyuiPath = (url) => {
  console.log("comfyuiPath", url);

  // const urlObject = new URL(url);
  // const filename = urlObject.searchParams.get("filename");
  // const subfolder = urlObject.searchParams.get("subfolder");

  // let ret = "";
  // if (subfolder) {
  //   ret = subfolder + "/";
  // }

  // return ret + filename;

  const newPath = url.replace(/^\/input\//, "");
  return newPath;
};

const Index = () => {
  const [checkedAsync, setCheckedAsync] = useState(false);

  const [visible, setVisible] = useState(false);
  const [AudioValue, setAudioValue] = useState();
  const [VideoValue, setVideoValue] = useState();
  const [pickList, setPickList] = useState([]);

  const [baseDesc, setBaseDesc] = useState("");

  const CosyVoiceLoadSpeakerModelNode = useTaroRequest({
    url: `${process.env.TARO_APP_SERVER_HOST}/api/v1/comfyui/getNodeDefs/CosyVoiceLoadSpeakerModelNode`,
  });

  const VideoCreate = useTaroRequest({
    url: `${process.env.TARO_APP_SERVER_HOST}/api/v1/comfyui/soundvideo_createbyaudio`,
  });

  const [prompt, setprompt] = useState("");

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

  useAsyncEffect(async () => {
    console.log("avatar1/index.tsx useEffect");
    await CosyVoiceLoadSpeakerModelNode.run();
  }, []);

  useEffect(() => {
    console.log("ai end", VideoCreate.data);
  }, [VideoCreate.data]);

  useEffect(() => {
    console.log("CosyVoiceLoadSpeakerModelNode", CosyVoiceLoadSpeakerModelNode);

    if (CosyVoiceLoadSpeakerModelNode.data) {
      const speakerNameList = (CosyVoiceLoadSpeakerModelNode.data as any)
        .CosyVoiceLoadSpeakerModelNode.input.required.speaker_name;

      const speakerNames = speakerNameList[0]; // 假设 speaker names 在第一个子数组中
      const result = speakerNames.map((name) => ({ value: name, text: name }));
      console.log(result);
      setPickList(result);
    }
  }, [CosyVoiceLoadSpeakerModelNode.data]);

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
        {/* <ComfyUIStatus /> */}
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
                options={pickList}
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
          onChange={(value) => {
            console.log("change", value);

            setprompt(value);
          }}
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
            onClick={async () => {
              console.log("submit", AudioValue, VideoValue, prompt);
              await VideoCreate.run({
                audio: comfyuiPath(AudioValue),
                prompt,
                video: comfyuiPath(VideoValue),
              });
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
