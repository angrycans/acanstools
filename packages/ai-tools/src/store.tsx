import { Updater, useImmer } from "use-immer";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
// // 定义 context 值接口
export interface StateContextType {
  state: any;
  updateState: Updater<any>;
}

const defaultState = {
  count: 0,
};
// 创建一个 context 对象并导出其 Provider 和 Consumer
const StateContext = createContext<StateContextType | null>(null);

// 创建一个自定义 Provider 组件，它将维护全局状态
export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 使用 useState 创建全局状态
  const [state, updateState] = useImmer(defaultState);

  // Context 的 value 包含了状态和更新状态的函数
  const value = { state, updateState };

  //debug
  (window as any).store = value;

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

// 创建一个自定义 hook 来访问 context 的值
export const useStore = () => {
  const context = useContext(StateContext);
  if (!context) {
    // 抛出错误，因为 context 不应该在 StateProvider 外部使用
    throw new Error("useStore must be used within a StateProvider");
  }
  return context;
};
