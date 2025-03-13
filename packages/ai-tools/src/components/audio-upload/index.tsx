import { Video, View, ScrollView } from "@tarojs/components";
import { clsx } from "clsx";
import "./index.scss";
import React, { useRef, useState } from "react";
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
import { IconFont } from "@nutui/icons-react-taro";

import Taro from "@tarojs/taro";
import { PlayStart, PlayStop, Failure } from "@nutui/icons-react-taro";
import { Toast } from "@nutui/nutui-react-taro";
import { set } from "immer/dist/internal";

interface InputFieldProps {
  value: string;
  onChange: (newValue: string) => void;
}
function formatSecondsToConditionalHHMMSS(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00"; // 处理无效输入，只显示秒
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const formattedHours = String(hours);
  const formattedMinutes = String(minutes);
  const formattedSeconds = String(seconds);
  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else if (minutes > 0) {
    return `${formattedMinutes}:${formattedSeconds}`;
  } else {
    return formattedSeconds;
  }
}

function getFilenameFromURL(urlString: string): string | null {
  try {
    const url = new URL(urlString); // 创建 URL 对象
    const filename = url.searchParams.get("filename"); // 获取 filename 参数的值
    return filename;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null; // 如果 URL 无效，返回 null
  }
}

const Index = ({ value, onChange }) => {
  // console.log(
  //   "Index 7",
  //   process.env.TARO_APP_SERVER_HOST + "/api/v1/file/upload",
  // );
  const [outValue, setOutValue] = useState("");

  const [uploading, seUploading] = useState(false);
  // const uploadTask = useRef<any | null>(null);
  // const uploadTaskTimeout = useRef<any | null>(null);
  const innerAudioContextRef = useRef<any | null>(null);
  const [playstatus, setPlaystatus] = useState({ duration: 0, playing: false });

  const closeUpload = () => {
    // console.log("closeUpload", uploadTask.current, uploadTaskTimeout.current);
    seUploading(false);
    // uploadTask.current && (uploadTask.current as any).abort();
    // uploadTaskTimeout.current && clearTimeout(uploadTaskTimeout.current);
    // uploadTaskTimeout.current = null;
    // uploadTask.current = null;
  };

  console.log("Index 7", outValue);
  return (
    <>
      <Toast id="audio" />

      <View
        className={`mr-[10px] mx-auto flex justify-center ${outValue == "" ? "hidden" : "block"}`}
      >
        {/* <span className="ml-[2px]">
          {outValue && getFilenameFromURL(outValue)}
        </span> */}
        {!playstatus.playing ? (
          <PlayStart
            size="20"
            onClick={() => {
              if (!playstatus.playing) {
                innerAudioContextRef.current.play();
                setPlaystatus({ ...playstatus, playing: true });
              } else {
                innerAudioContextRef.current.stop();
                setPlaystatus({ ...playstatus, playing: false });
              }
            }}
          />
        ) : (
          <PlayStop
            size="20"
            onClick={() => {
              if (!playstatus.playing) {
                innerAudioContextRef.current.play();
                setPlaystatus({ ...playstatus, playing: true });
              } else {
                innerAudioContextRef.current.stop();
                setPlaystatus({ ...playstatus, playing: false });
              }
            }}
          />
        )}

        <span className="ml-[2px]">
          {playstatus.duration > 0 &&
            formatSecondsToConditionalHHMMSS(playstatus.duration)}
          s
        </span>
      </View>
      <Button
        loading={uploading}
        disabled={uploading}
        onClick={() => {
          tt.filePicker({
            maxNum: 1,
            pickerTitle: "Select a file",
            pickerConfirm: "Confirm",
            isSystem: false,
            success(res) {
              console.log("pick", JSON.stringify(res));
              console.log(
                "uplaod start url",
                process.env.TARO_APP_SERVER_HOST + "/api/v1/file/upload",
                process.env.TARO_APP_COMFYUI_HOST,
              );

              seUploading(true);

              tt.uploadFile({
                //url: "http://192.168.2.20:7002/upload/image",
                url: process.env.TARO_APP_SERVER_HOST + "/api/v1/file/upload",
                filePath: res.list[0].path,
                // timeout: 3000,
                name: "image",
                // formData: {
                //   overwrite: "true",
                // },
                success(res) {
                  closeUpload();
                  const data = JSON.parse(res.data).data;
                  console.log(
                    "upload ok",
                    process.env.TARO_APP_SERVER_HOST + data,
                  );

                  innerAudioContextRef.current = Taro.createInnerAudioContext();
                  innerAudioContextRef.current.autoplay = false;
                  innerAudioContextRef.current.src =
                    process.env.TARO_APP_SERVER_HOST + data;
                  innerAudioContextRef.current.onPlay(() => {
                    console.log("开始播放");
                  });
                  innerAudioContextRef.current.onStop(() => {
                    console.log("停止播放");
                  });
                  innerAudioContextRef.current.onError((res) => {
                    console.log("innerAudioContextRef.current", res.errMsg);
                    console.log("innerAudioContextRef.current", res.errCode);
                  });
                  innerAudioContextRef.current.onCanplay(() => {
                    console.log(
                      " innerAudioContextRef onCanplay",
                      formatSecondsToConditionalHHMMSS(
                        innerAudioContextRef.current.duration,
                      ),
                    );
                    if (innerAudioContextRef.current.duration == 0) {
                      innerAudioContextRef.current.play();
                      innerAudioContextRef.current.stop();
                      console.log(
                        " innerAudioContextRef onCanplay2",
                        innerAudioContextRef.current.duration,
                      );
                    } else {
                      setPlaystatus({
                        duration: innerAudioContextRef.current.duration,
                        playing: false,
                      });
                    }
                    setOutValue(data);
                    onChange(data);
                  });
                },
                fail(res) {
                  closeUpload();
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

              // uploadTaskTimeout.current = setTimeout(() => {
              //   console.log("上传超时，任务已中断");
              //   closeUpload();
              // }, 5000); // 10 秒
            },
            fail(res) {
              closeUpload();

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
