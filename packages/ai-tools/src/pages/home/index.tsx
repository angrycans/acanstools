import { View } from "@tarojs/components";
import { clsx } from "clsx";
import "./index.scss";
import React, { useState } from "react";

const rooms = [
  {
    name: "音色制作",
    devices: 4,
    icon: "🧺",
    url: "/pages/audio2timbre/index",
  },
  { name: "虚拟形象", devices: 12, icon: "🛋️", url: "/pages/avatar1/index" },
  { name: "BEDROOM", devices: 8, icon: "🛏️" },
  { name: "BATHROOM", devices: 5, icon: "🛁" },
  { name: "KITCHEN", devices: 7, icon: "🍽️" },
  { name: "STUDY", devices: 3, icon: "📚" },
];
const Index = () => {
  const [flag, setFlag] = useState(true);

  const [clickedIndex, setClickedIndex] = useState(null);

  const handleClick = (index, url) => {
    setClickedIndex(index);
    setTimeout(() => {
      setClickedIndex(null);
      if (url) {
        tt.navigateTo({
          url, // 跳转的页面路径及参数
          success(res) {
            console.log("跳转成功", res);
          },
          fail(err) {
            console.error("跳转失败", err);
          },
        });
      }
    }, 300); // Reset after the animation duration
  };

  const className = clsx(
    flag ? "bg-[#123456]" : "bg-[#654321]",
    "text-white",
    "after:content-['click_here_to_switch_bg_className']",
    "p-[13.3333333px]",
    "rounded-[10086px]",
  );
  const logoClass = clsx(
    "bg-[url(https://pic1.zhimg.com/v2-3ee20468f54bbfefcd0027283b21aaa8_720w.jpg)] bg-[length:100%_100%] bg-no-repeat w-screen h-[41.54vw]",
  );
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b bg-[#a05aff]  p-6">
        {/* Header */}
        <div className="text-white text-2xl font-bold mb-4">All Tools</div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rooms.map((room, index) => (
            <div
              key={index}
              onClick={() => handleClick(index, room.url)}
              className={`bg-white rounded-2xl shadow-lg p-6 text-center transition-transform duration-300 cursor-pointer ${
                clickedIndex === index ? "animate-bounce" : "hover:scale-105"
              }`}
            >
              {/* Icon */}
              <div className="text-4xl mb-2">{room.icon}</div>

              {/* Room Name */}
              <h3 className="text-lg font-semibold text-gray-700">
                {room.name}
              </h3>

              {/* Device Count */}
              <p className="text-sm text-gray-500">{room.devices} Devices</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
