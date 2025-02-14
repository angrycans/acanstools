import React, { useEffect } from "react";
import Taro, { useDidShow, useDidHide } from "@tarojs/taro";
import { StoreProvider, useStore } from "./store";
// 全局样式
import "./app.scss";

const Root = ({ children }: { children: React.ReactNode }) => {
  useDidShow(() => {});

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
