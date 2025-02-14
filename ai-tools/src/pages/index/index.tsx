import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import {
  Button,
  ConfigProvider,
  TextArea,
  Dialog,
} from "@nutui/nutui-react-taro";
import { useAsyncEffect, useRequest } from "ahooks";

import "./index.scss";
import Taro, { useDidShow } from "@tarojs/taro";
import { useFriendStatus } from "./hooks";
import { useStore } from "@/store";
import { useTaroRequest } from "@/tools/useRequest";

const getUsername = async () => {
  return Taro.request({ url: "http://192.168.2.20:7002/prompt" });
};

function Index() {
  const [visible, setVisible] = useState(false);
  const { state, updateState } = useStore();

  const { data, error, loading } = useRequest(getUsername);

  const ret2 = useTaroRequest(
    { url: "http://192.168.2.20:7002/prompt" },
    { manual: true }
  );

  useAsyncEffect(async () => {
    console.log("useAsyncEffect", state);

    // const ret1 = useFriendStatus();
    console.log("data", data);
  }, [data]);

  useDidShow(() => {
    console.log("componentDidShow");
  });

  useEffect(() => {
    console.log("useEffect");
    // const { data, error, loading } = useRequest(getUsername);
    // const getUsername = async () => {
    //   return Taro.request({ url: "http://192.168.2.20:7002/prompt" });
    // };
    // const ret = await getUsername();
    //ret2.run();
    console.log("ret2", ret2);
  }, [ret2.loading]);

  console.log("Index render");

  return (
    <ConfigProvider>
      <View className="nutui-react-demo">
        <View>welcome</View>
        <View>
          <Button type="primary" onClick={() => ret2.run()}>
            hello1
          </Button>
          <Button type="success" onClick={() => setVisible(true)}>
            world
          </Button>
          <Dialog
            visible={visible}
            onConfirm={() => setVisible(false)}
            onCancel={() => setVisible(false)}
          ></Dialog>
          <TextArea disabled showCount maxLength={20} />
        </View>
      </View>
    </ConfigProvider>
  );
}

export default Index;
