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
import { Grid } from "@nutui/nutui-react-taro";
import { Image } from "@nutui/icons-react-taro";
import { SafeArea } from "@nutui/nutui-react-taro";

function Index() {
  const [visible, setVisible] = useState(false);
  const { state, updateState } = useStore();

  useDidShow(() => {
    console.log("componentDidShow");
  });

  console.log("Index render");

  return (
    <>
      <Grid columns={3}>
        <Grid.Item text="文字">
          <Image />
        </Grid.Item>
        <Grid.Item text="文字">
          <Image />
        </Grid.Item>
        <Grid.Item text="文字">
          <Image />
        </Grid.Item>
        <Grid.Item text="文字">
          <Image />
        </Grid.Item>
        <Grid.Item text="文字">
          <Image />
        </Grid.Item>
        <Grid.Item text="文字">
          <Image />
        </Grid.Item>
      </Grid>
      <SafeArea position="bottom" />
    </>
  );
}

export default Index;
