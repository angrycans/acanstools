import React, { useEffect } from "react";
import Taro, { useDidShow, useDidHide } from "@tarojs/taro";
import { StoreProvider, useStore } from "./store";
// 全局样式
import "./app.scss";
import "@nutui/nutui-react-taro/dist/style.css";

const Root = ({ children }: { children: React.ReactNode }) => {
  useDidShow(async () => {
    // const ret1 = await tt.login({
    //   scopeList: ["auth:user.id:read"],
    //   state: "random_state", // 用于维护请求状态
    // });

    tt.requestAccess({
      scopeList: ["auth:user.id:read"],
      appID: "cli_a724240555b8d00e", // 网页应用必传
      success(res) {
        console.log(JSON.stringify(res));

        tt.getUserInfo({
          withCredentials: true,
          success(res) {
            console.log(JSON.stringify(res));
          },
          fail(res) {
            console.log(`getUserInfo fail: ${JSON.stringify(res)}`);
          },
        });

        Taro.request({
          url: "http://127.0.0.1:7003/api/v1/lark/login/" + res.code,
          header: {
            "content-type": "application/json", // 默认值
          },
          success: function (res) {
            console.log(res.data);
          },
        });
      },
      fail(res) {
        console.log(`requestAccess fail: ${JSON.stringify(res)}`);
      },
    });

    // console.log("ret1", ret1);
    // const ret2 = await Taro.request({
    //   url: "http://127.0.0.1:7003/login/" + ret1.code, //仅为示例，并非真实的接口地址
    //   data: {
    //     x: "",
    //     y: "",
    //   },
    //   header: {
    //     "content-type": "application/json", // 默认值
    //   },
    // });

    // console.log("ret2", ret2);
  });

  useDidHide(() => {});

  return <React.Fragment>{children}</React.Fragment>;
};

function App(props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) {
  return (
    <StoreProvider>
      <Root>{props.children}</Root>
    </StoreProvider>
  );
}

export default App;
