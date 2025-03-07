import { Video, View, ScrollView } from "@tarojs/components";
import { clsx } from "clsx";
import "./index.scss";
import React, { useEffect, useRef, useState } from "react";
import {
  Steps,
  Step,
  Picker,
  Cell,
  TextArea,
  Uploader,
  Button,
  Switch,
  Input,
  Toast,
} from "@nutui/nutui-react-taro";
import {
  ArrowRight,
  Failure,
  PlayStart,
  Download,
  Refresh,
  User,
} from "@nutui/icons-react-taro";
import Taro from "@tarojs/taro";
import { useTaroRequest } from "@/tools/useRequest";

import ComfyUIStatus from "@/components/comfyui-status/index";
import AudioUpload from "@/components/audio-upload/index";
import VideoUpload from "@/components/video-upload/index";
import AudioPlay from "@/components/audio-play/index";

import { useStore } from "@/store";

const comfyuiPath = (url) => {
  const urlObject = new URL(url);
  const filename = urlObject.searchParams.get("filename");
  const subfolder = urlObject.searchParams.get("subfolder");

  let ret = "";
  if (subfolder) {
    ret = subfolder + "/";
  }

  return ret + filename;
};

const Index = () => {
  const { state, updateState } = useStore();

  const [AudioValue, setAudioValue] = useState("");
  const [outAudio, setOutAudio] = useState("");

  const [speaker_name, setSpeakName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showRet, setShowRet] = useState(false);

  // const { loading, data, error, run } = useTaroRequest({
  //   url: "http://192.168.2.20:7002/prompt",
  // });
  const { loading, data, error, run } = useTaroRequest({
    url: "http://192.168.2.20:7003/api/v1/comfyui/audio2Timbre",
  });

  console.log("audio2timbre/index.tsx", state, AudioValue);

  useEffect(() => {
    setSpeakName(state.username);
  }, []);

  useEffect(() => {
    console.log("useEffect");

    console.log("data", data);

    if (data) {
      setShowRet(true);
      setOutAudio(data);
    }
  }, [data]);

  return (
    <View className="page_layout">
      <View className="workspace scroll">
        <Toast id="root" />
        <ComfyUIStatus />

        <Cell.Group>
          <Cell
            align="center"
            title="音频文件"
            extra={<AudioUpload value={AudioValue} onChange={setAudioValue} />}
          />
        </Cell.Group>

        <Cell title="想说的话" />
        <TextArea
          defaultValue=""
          className="text-1"
          style={{ fontSize: "12px" }}
          onChange={(value) => setPrompt(value)}
          // onBlur={() => console.log("blur")}
          // onFocus={() => console.log("focus")}
        />

        <Cell title="保存音色名称" />
        <Input value={speaker_name} onChange={(val) => setSpeakName(val)} />

        <View className="mx-2.5">
          <Button
            loading={loading}
            block
            type="primary"
            onClick={async () => {
              console.log("audio2timbre", AudioValue, prompt, speaker_name);
              setShowRet(false);
              setOutAudio("");

              if (!AudioValue.trim()) {
                Toast.show("root", {
                  content: "音频文件参数缺失",
                  type: "fail",
                  duration: 2,
                  icon: <Failure />,
                  lockScroll: true,
                  onClose: () => {
                    console.log("close");
                  },
                });
                return;
              }
              if (!prompt.trim()) {
                Toast.show("root", {
                  content: "想说的话参数缺失",
                  type: "fail",
                  duration: 2,
                  icon: <Failure />,
                  lockScroll: true,
                  onClose: () => {
                    console.log("close");
                  },
                });
                return;
              }
              if (!speaker_name.trim()) {
                Toast.show("root", {
                  content: "音色名称参数缺失",
                  type: "fail",
                  duration: 2,
                  icon: <Failure />,
                  lockScroll: true,
                  onClose: () => {
                    console.log("close");
                  },
                });
                return;
              }

              await run({
                speaker_name,
                prompt,
                audio: comfyuiPath(AudioValue),
              });

              console.log("ret", error, data);
            }}
          >
            AI
          </Button>
          <View
            className={`w-full h-[100px] flex justify-center items-center bg-gray-100 ${showRet ? "block" : "hidden"}`}
          >
            <AudioPlay
              value={outAudio}
              // value={{
              //   audio: {
              //     audio: [
              //       {
              //         filename: "lihaibao.mp3",
              //         subfolder: "ai_tools_upload",
              //         type: "input",
              //       },
              //       {
              //         filename: "ComfyUI_00001_.flac",
              //         subfolder: "audio",
              //         type: "output",
              //       },
              //     ],
              //   },
              // }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
