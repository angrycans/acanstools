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
  FixedNav,
  Progress,
} from "@nutui/nutui-react-taro";
import { Download, IconFont } from "@nutui/icons-react-taro";

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

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Index = ({ value }) => {
  // console.log(
  //   "Index 7",
  //   process.env.TARO_APP_SERVER_HOST + "/api/v1/file/upload",
  // );
  const [outValue, setOutValue] = useState("");

  const [uploading, seUploading] = useState(false);
  const uploadTask = useRef<any | null>(null);
  const uploadTaskTimeout = useRef<any | null>(null);
  const AinnerAudioContextRef = useRef<any | null>(null);
  const [playstatus, setPlaystatus] = useState({ duration: 0, playing: false });

  // console.log("value", value);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // 示例总时长2分2秒

  const reset = () => {
    setPlaystatus({ duration: 0, playing: false });
    setCurrentTime(0);
    setDuration(0);
    if (AinnerAudioContextRef.current) {
      AinnerAudioContextRef.current.destroy;
      AinnerAudioContextRef.current = null;
    }
  };

  const onPlay = () => {
    if (!playstatus.playing) {
      AinnerAudioContextRef.current.play();

      setPlaystatus({ ...playstatus, playing: true });
      // const interval = setInterval(() => {
      //   setCurrentTime((prev) => {
      //     const newTime = prev + 1;
      //     if (newTime >= duration) {
      //       setPlaystatus({ ...playstatus, playing: false });
      //       return duration;
      //     }
      //     setProgress((newTime / duration) * 100);
      //     return newTime;
      //   });
      // }, 1000);
      // return () => clearInterval(interval);
    } else {
      AinnerAudioContextRef.current.stop();
      //clearInterval(interval);
      setPlaystatus({ ...playstatus, playing: false });
    }
  };

  useEffect(() => {
    console.log(
      "useEffect AinnerAudioContextRef.current",
      AinnerAudioContextRef.current && AinnerAudioContextRef.current,
    );
  }, [AinnerAudioContextRef.current]);
  AinnerAudioContextRef;
  useEffect(() => {
    console.log("Audio play useEffect", value);
    if (value) {
      const newUrl = new URL(
        "http://192.168.2.20:7002/view?filename=ComfyUI_00003_.flac&subfolder=audio&type=output",
      );
      newUrl.searchParams.set("filename", value.audio.audio[0].filename);
      newUrl.searchParams.set("subfolder", value.audio.audio[0].subfolder);
      newUrl.searchParams.set("type", value.audio.audio[0].type);

      console.log("newUrl", newUrl.toString());
      const src = newUrl.toString();
      if (!AinnerAudioContextRef.current) {
        AinnerAudioContextRef.current = Taro.createInnerAudioContext();
        AinnerAudioContextRef.current.autoplay = false;
        AinnerAudioContextRef.current.src = src;

        console.log("createInnerAudioContext", AinnerAudioContextRef.current);
        AinnerAudioContextRef.current.onEnded(() => {
          setPlaystatus({
            duration: AinnerAudioContextRef.current.duration,
            playing: false,
          });

          setCurrentTime(0);
        });
        AinnerAudioContextRef.current.onTimeUpdate((e) => {
          console.log(
            "onTimeUpdate",
            e / AinnerAudioContextRef.current.duration,
          );
          setCurrentTime(e);
          //   setDuration(
        });

        AinnerAudioContextRef.current.onPlay(() => {
          console.log("开始播放");
          console.log(
            " innerAudioContextRef onPlay",
            AinnerAudioContextRef.current.duration,
          );
          setDuration(AinnerAudioContextRef.current.duration);
        });
        AinnerAudioContextRef.current.onStop(() => {
          console.log("停止播放");
          console.log(
            " innerAudioContextRef onStop",
            AinnerAudioContextRef.current,
          );
        });
        AinnerAudioContextRef.current.onError((res) => {
          console.log("innerAudioContextRef.current", res.errMsg);
          console.log("innerAudioContextRef.current", res.errCode);
        });
        AinnerAudioContextRef.current.onCanplay(() => {
          console.log(
            " innerAudioContextRef onCanplay",
            formatSecondsToConditionalHHMMSS(
              AinnerAudioContextRef.current.duration,
            ),
          );
          if (AinnerAudioContextRef.current.duration == 0) {
            AinnerAudioContextRef.current.play();
            AinnerAudioContextRef.current.stop();
            console.log(
              " innerAudioContextRef onCanplay2",
              AinnerAudioContextRef.current.duration,
            );
            setPlaystatus({
              duration: AinnerAudioContextRef.current.duration,
              playing: false,
            });
          } else {
            setPlaystatus({
              duration: AinnerAudioContextRef.current.duration,
              playing: false,
            });
          }
        });
      }
    } else {
      console.log("audioPlay reset");
      reset();
    }
  }, [value]);

  return (
    <View className="flex w-[300px] h-[100px] items-center justify-center">
      <View className="flex w-80 items-center justify-between rounded-full bg-white px-6 py-3 shadow-lg">
        {!playstatus.playing ? (
          <PlayStart className="mr-2" onClick={onPlay} />
        ) : (
          <PlayStop className="mr-2" onClick={onPlay} />
        )}

        <span className="text-sm font-medium">
          {formatTime(currentTime / 1000)} / {formatTime(playstatus.duration)}
        </span>

        <View className="flex-1 px-4">
          <Progress percent={currentTime / playstatus.duration / 10} />
        </View>
        <Download />
      </View>
    </View>
  );
};

export default Index;
