import React, { useEffect } from "react";
import Taro, { useDidShow, useDidHide } from "@tarojs/taro";
import { StoreProvider, useStore } from "./store";
// 全局样式
import "./app.scss";
import "@nutui/nutui-react-taro/dist/style.css";
import devVersion from "./dev-version.json";
import { Toast } from "@nutui/nutui-react-taro";

const Root = ({ children }: { children: React.ReactNode }) => {
  const { state, updateState } = useStore();

  useDidShow(async () => {
    // const ret1 = await tt.login({
    //   scopeList: ["auth:user.id:read"],
    //   state: "random_state", // 用于维护请求状态
    // });

    console.log("__DEV_VERSION__", devVersion.version);

    tt.requestAccess({
      scopeList: ["auth:user.id:read"],
      appID: "cli_a724240555b8d00e", // 网页应用必传
      success(res) {
        console.log(JSON.stringify(res));
        tt.login({
          async success(res: any) {
            console.log("tt.login ok", res);

            await Taro.request({
              url:
                process.env.TARO_APP_SERVER_HOST +
                "/api/v1/lark/login/" +
                res.code,
              header: {
                "content-type": "application/json", // 默认值
              },
              success: function (res) {
                console.log("/api/v1/lark/login/", res.data);
              },
            });

            tt.getUserInfo({
              withCredentials: true,
              success(res) {
                console.log("tt.getUserInfo", res);

                updateState((draft) => {
                  draft.userInfo = JSON.parse(res.rawData).userInfo;
                });
              },
              fail(res) {
                console.log(`getUserInfo fail: ${JSON.stringify(res)}`);
              },
            });
          },
          fail(res: any) {
            console.log("tt.login err", res);
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
