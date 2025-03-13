import { View, ScrollView } from "@tarojs/components";
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
  Popup,
  Video,
} from "@nutui/nutui-react-taro";
import { IconFont } from "@nutui/icons-react-taro";

import Taro from "@tarojs/taro";
import { PlayStart, PlayStop, Failure } from "@nutui/icons-react-taro";
import { Toast } from "@nutui/nutui-react-taro";

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
  const [outValue, setOutValue] = useState("");

  const [uploading, setUploading] = useState(false);
  const [preivew, setPreview] = useState(false);

  const uploadTask = useRef<any | null>(null);
  const uploadTaskTimeout = useRef<any | null>(null);
  const videoContextRef = useRef<any | null>(null);
  const [playstatus, setPlaystatus] = useState({ duration: 0, playing: false });

  const closeUpload = () => {
    console.log("closeUpload", uploadTask.current, uploadTaskTimeout.current);
    setUploading(false);
    uploadTask.current && (uploadTask.current as any).abort();
    uploadTaskTimeout.current && clearTimeout(uploadTaskTimeout.current);
    uploadTaskTimeout.current = null;
    uploadTask.current = null;
  };

  console.log("Index video upload", outValue);
  return (
    <>
      <Popup
        //closeable
        visible={preivew}
        //left="返回"
        //title="预览"
        //position="bottom"
        // onClose={() => {
        //   setPreview(false);
        // }}
        onOverlayClick={() => {
          console.log("onOverlayClick");

          setPreview(false);
          return true;
        }}
      >
        <Video //http://192.168.2.20:7002/view?filename=latentsync_00004-audio.mp4
          id="video"
          className="w-full h-[300px]" // Full width, 1/4 screen height
          src={process.env.TARO_APP_SERVER_HOST + outValue}
          //poster="http://192.168.2.20:7002/view?filename=ComfyUI_00013_.png"
          initialTime={0}
          controls={true}
          autoplay={false}
          loop={false}
          muted={false}
          options={{
            controls: true,
          }}
        />
      </Popup>
      <Toast id="video" />
      <View
        className={`mr-[10px] mx-auto flex justify-center ${outValue == "" ? "hidden" : "block"}`}
      >
        {/* <span className="ml-[2px]">
          {outValue && getFilenameFromURL(outValue)}
        </span> */}

        <PlayStart
          size="20"
          onClick={() => {
            if (!playstatus.playing) {
              setPreview(true);
            }
          }}
        />

        {/* <span className="ml-[2px]">
          {playstatus.duration > 0 &&
            formatSecondsToConditionalHHMMSS(playstatus.duration)}
          s
        </span> */}
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

              setUploading(true);

              uploadTask.current = tt.uploadFile({
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

                  setOutValue(data);
                  onChange(data);
                },
                fail(res) {
                  closeUpload();
                  console.log("upload fail", res);
                  Toast.show("video", {
                    content: "视频上传失败",
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

              uploadTaskTimeout.current = setTimeout(() => {
                console.log("上传超时，任务已中断");
                closeUpload();
              }, 5000); // 10 秒
            },
            fail(res) {
              closeUpload();

              console.log(`filePicker fail: ${JSON.stringify(res)}`);
              Toast.show("video", {
                content: "视频文件选择失败",
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
        上传视频
      </Button>
    </>
  );
};

export default Index;
