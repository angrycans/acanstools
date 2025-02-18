
import { WebSocket } from 'ws'; // ESM import syntax
import fs from 'node:fs/promises';
import * as base64js from 'base64-js';

const COMFYUI_API_URL = "http://192.168.2.20:7002/"; // 默认 ComfyUI API 地址
const WORKFLOW_JSON_PATH = "./workflow.json"; // 你的工作流 JSON 文件路径
const OUTPUT_DIR = "./output_images"; // 输出图像保存目录

async function loadWorkflowJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading workflow JSON:", error);
        throw error;
    }
}

async function sendPromptToComfyUI(workflowJSON) {
    const promptURL = `${COMFYUI_API_URL}/api/prompt`;
    try {

        const params={"prompt": workflowJSON, "client_id": "client_id"}
        const response = await fetch(promptURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.prompt_id;
    } catch (error) {
        console.error("Error sending prompt to ComfyUI API:", error);
        throw error;
    }
}

async function connectWebSocketAndGetOutput(promptId) {
    const wsURL = `ws://127.0.0.1:8188/ws?clientId=${promptId}`;
    const ws = new WebSocket(wsURL);
    const outputImages = {};

    return new Promise((resolve, reject) => {
        ws.onopen = () => {
            console.log("WebSocket connection opened");
        };

        ws.onmessage = async (event) => {
            const message = event.data;
            if (typeof message === 'string') {
                try {
                    const data = JSON.parse(message);
                    // console.log("WebSocket Message:", data); // 可选: 打印所有 WebSocket 消息

                    if (data.type === 'status') {
                        if (data.data.status_text) {
                            console.log(`Status: ${data.data.status_text}`);
                        }
                    } else if (data.type === 'executing') {
                        const nodeId = data.data.node;
                        const progress = data.data.progress;
                        const maxProgress = data.data.max;
                        if (progress !== null && maxProgress !== null) {
                            console.log(`Node ${nodeId}: ${progress}/${maxProgress}`);
                        }
                    } else if (data.type === 'executed') {
                        const nodeId = data.data.node;
                        const nodeOutput = data.data.output;
                        if (nodeOutput && nodeOutput.images) {
                            const images = nodeOutput.images;
                            for (const imageData of images) {
                                const imageName = imageData.filename;
                                const imageBase64 = imageData.image_data; // 新版本 ComfyUI API 返回 base64 字符串
                                outputImages[imageName] = imageBase64;
                                console.log(`Output Image: ${imageName}`);
                            }
                        }
                    } else if (data.type === 'prompt_done') {
                        console.log("Workflow execution finished!");
                        ws.close();
                        resolve(outputImages); // Resolve promise when workflow is done
                    } else if (data.type === 'execution_error') {
                        const errorNodeId = data.data.node_id;
                        const errorMessage = data.data.error;
                        console.error(`Error in node ${errorNodeId}: ${errorMessage}`);
                        ws.close();
                        reject(`Error in node ${errorNodeId}: ${errorMessage}`); // Reject promise on error
                    }
                } catch (jsonError) {
                    console.error("Error parsing WebSocket message JSON:", jsonError, message);
                }
            } else if (message instanceof Buffer) { // 处理二进制消息 (如果需要)
                // (新版本 ComfyUI API 通常返回 base64 字符串)
                // console.log("Received binary message:", message);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(error); // Reject promise on WebSocket error
        };
    });
}

async function saveImageFromBase64(base64String, filename) {
    try {
        const base64Data = base64String.split(',')[1]; // Remove data:image/png;base64, prefix if present
        const binaryData = base64js.toByteArray(base64Data);
        const buffer = Buffer.from(binaryData); // Convert Uint8Array to Buffer
        await fs.writeFile(`${OUTPUT_DIR}/${filename}`, buffer);
        console.log(`Image '${filename}' saved to ${OUTPUT_DIR}`);
    } catch (error) {
        console.error(`Error saving image '${filename}':`, error);
    }
}

async function ensureOutputDirExists() {
    try {
        await fs.mkdir(OUTPUT_DIR, { recursive: true }); // Create directory if it doesn't exist
    } catch (error) {
        if (error.code !== 'EEXIST') { // Ignore if directory already exists
            console.error("Error creating output directory:", error);
            throw error;
        }
    }
}


async function main() {
    try {
        await ensureOutputDirExists();
        const workflowJSON = await loadWorkflowJSON(WORKFLOW_JSON_PATH);

        //  你可以修改 workflowJSON 在这里，例如修改 prompt 文本
        //  workflowJSON.nodes["your_node_id"].inputs.text = "新的 Prompt 文本";

        const promptId = await sendPromptToComfyUI(workflowJSON);
        if (promptId) {
            const outputImagesBase64 = await connectWebSocketAndGetOutput(promptId);
            for (const imageName in outputImagesBase64) {
                if (outputImagesBase64.hasOwnProperty(imageName)) {
                    await saveImageFromBase64(outputImagesBase64[imageName], imageName);
                }
            }
            console.log("Workflow execution and image saving completed successfully!");
        } else {
            console.error("Failed to get prompt ID. Workflow submission failed.");
        }

    } catch (error) {
        console.error("An error occurred during workflow execution:", error);
    }
}

main();