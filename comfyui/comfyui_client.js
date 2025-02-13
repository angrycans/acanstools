import { Client } from "@stable-canvas/comfyui-client";

import WebSocket from "ws";
import fetch from "node-fetch";
import fs from 'node:fs/promises';


const WORKFLOW_JSON_PATH = "./workflow.json"; // 你的工作流 JSON 文件路径
const COMFYUI_API_URL = "192.168.2.20:7002"; // 默认 ComfyUI API 地址


async function loadWorkflowJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading workflow JSON:", error);
        throw error;
    }
}

const client = new Client({
    api_host: COMFYUI_API_URL,
    WebSocket,
    fetch,
});


const workflowJSON = await loadWorkflowJSON(WORKFLOW_JSON_PATH);

const result = await client.enqueue(
    workflowJSON,
    {
      progress: ({max,value}) => console.log(`progress: ${value}/${max}`)
    }
  );


// connect ws client
//client.connect();