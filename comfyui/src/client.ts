import "esm-hook";
import { Client } from "@stable-canvas/comfyui-client";

import WebSocket from "ws";
import fetch from "node-fetch";
import { readFile } from "node:fs/promises";

//const WORKFLOW_JSON_PATH = "./src/workflow.json"; // 你的工作流 JSON 文件路径
const WORKFLOW_JSON_PATH = "./src/workflow_soundclone.json";
const COMFYUI_API_URL = "192.168.2.20:7002"; // 默认 ComfyUI API 地址

async function loadWorkflowJSON(filePath) {
  try {
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading workflow JSON:", error);
    throw error;
  }
}

const client = new Client({
  api_host: COMFYUI_API_URL,
  WebSocket: WebSocket as any,
  fetch,
});

const main = async () => {
  client.connect();
  client.on("message", (event) => {
    const { data } = event;
    if (data instanceof Buffer || data instanceof ArrayBuffer) {
      console.log("Received image data");
    } else {
      console.log(data);
    }
  });

  console.log(client.socket?.url);
  const workflowJSON = await loadWorkflowJSON(WORKFLOW_JSON_PATH);

  const resp = await client.enqueue_polling(workflowJSON, {});
  console.log(resp);
};

main()
  .then(() => console.log("done"))
  .catch((e) => console.error(e))
  .finally(() => client.close());
