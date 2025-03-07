import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import devConfig from "./dev";
import prodConfig from "./prod";
import path from "path";
import { UnifiedWebpackPluginV5 } from "weapp-tailwindcss/webpack";
// const IncrementVersionPlugin = require("./webpack-plugins/IncrementVersionPlugin"); // 引入自定义插件
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
var __DEV_VERSION__ = 1;
console.log(
  path.resolve(__dirname, "../IncrementVersionPlugin.js"),
  path.resolve(__dirname, "../.env.development"),
);

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"webpack5">(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<"webpack5"> = {
    projectName: "ai-tools",
    date: "2025-2-13",
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: [
      "@tarojs/plugin-html",
      "/Users/Acans/Documents/github/acanstools/packages/ai-tools/IncrementVersionPlugin",
    ],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    alias: { "@": path.resolve(__dirname, "..", "src") },

    framework: "react",
    compiler: {
      type: "webpack5",
      prebundle: {
        enable: false,
      },
    },
    cache: {
      enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            selectorBlackList: ["nut-"],
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      webpackChain(chain) {
        chain;

        chain.watchOptions({
          ignored: [
            // 精确匹配文件（推荐绝对路径）
            path.resolve(__dirname, "../src/version.json"),
            // 通配符匹配模式
            "**/version.json",
          ],
          // 防抖处理（重要！）
          aggregateTimeout: 600,
        });
        chain.plugin("dotenv").use(Dotenv, [
          {
            path: path.resolve(__dirname, "../.env.development"),
            systemvars: true,
            watch: true, // 开启文件监听
          },
        ]);

        // chain.devServer.watchOptions({

        //   aggregateTimeout: 500,
        //   poll: 1000,
        //   followSymlinks: true,
        //   files: [".env.development"], // 监控文件
        //   ignored: [
        //     "**/version.json", // 忽略 version.json 自身变化
        //     "node_modules",
        //     "src/version.json", // 忽略 version.json 自身变化
        //   ],
        // });

        chain.plugin("define").use(webpack.DefinePlugin, [
          {
            "process.env": JSON.stringify({
              ...require("dotenv").config({ path: ".env.development" }).parsed,
              TARO_ENV: process.env.TARO_ENV,
              TARO_APP_DEV_VERSION2: __DEV_VERSION__ + "",
            }),
          },
        ]);

        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [
                {
                  appType: "taro",
                  // disabled: WeappTailwindcssDisabled,
                  rem2rpx: true,
                },
              ],
            },
          },
        });
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",
      output: {
        filename: "js/[name].[hash:8].js",
        chunkFilename: "js/[name].[chunkhash:8].js",
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
