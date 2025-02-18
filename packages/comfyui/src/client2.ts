import { ComfyUIClient } from "comfy-ui-client";
import { readFile } from "node:fs/promises";

// Your prompt / workflow
const prompt = {
  "40": {
    inputs: {
      video: "lihaibao.mp4",
      force_rate: 0,
      force_size: "Disabled",
      custom_width: 512,
      custom_height: 512,
      frame_load_cap: 0,
      skip_first_frames: 0,
      select_every_nth: 1,
    },
    class_type: "VHS_LoadVideo",
    _meta: {
      title: "Load Video (Upload) 🎥🅥🅗🅢",
    },
  },
  "41": {
    inputs: {
      frame_rate: 25,
      loop_count: 0,
      filename_prefix: "latentsync",
      format: "video/h264-mp4",
      pix_fmt: "yuv420p",
      crf: 19,
      save_metadata: true,
      pingpong: false,
      save_output: true,
      images: ["43", 0],
      audio: ["43", 1],
    },
    class_type: "VHS_VideoCombine",
    _meta: {
      title: "Video Combine 🎥🅥🅗🅢",
    },
  },
  "43": {
    inputs: {
      seed: 1331,
      images: ["53", 0],
      audio: ["53", 1],
    },
    class_type: "D_LatentSyncNode",
    _meta: {
      title: "LatentSync Node",
    },
  },
  "53": {
    inputs: {
      mode: "pingpong",
      fps: 25,
      silent_padding_sec: 0.5,
      images: ["40", 0],
      audio: ["55", 0],
    },
    class_type: "D_VideoLengthAdjuster",
    _meta: {
      title: "Video Length Adjuster",
    },
  },
  "54": {
    inputs: {
      speaker_name: "zhang.pt",
    },
    class_type: "CosyVoiceLoadSpeakerModelNode",
    _meta: {
      title: "CosyVoice 加载说话人模型",
    },
  },
  "55": {
    inputs: {
      auto_download: false,
      tts_text: ["56", 0],
      speed: 1,
      seed: 1135,
      text_frontend: true,
      polyreplace: false,
      speaker_model: ["54", 0],
    },
    class_type: "CosyVoice2ZeroShotNode",
    _meta: {
      title: "CosyVoice2 音色克隆",
    },
  },
  "56": {
    inputs: {
      string: "啊哈哈[laughter]，事情怎么这么多啊，明天又要开会了啊</strong>。",
    },
    class_type: "Primitive string multiline [Crystools]",
    _meta: {
      title: "🪛 Primitive string multiline",
    },
  },
};

export interface UploadImageResult {
  name: string;
  subfolder: string;
  type: string;
}
const uploadImage = async (image: Buffer, filename: string, overwrite?: boolean) => {
  const formData = new FormData();
  formData.append("image", new Blob([image]), filename);

  if (overwrite !== undefined) {
    formData.append("overwrite", overwrite.toString());
  }

  const res = await fetch(`http://192.168.2.20:7002/upload/image`, {
    method: "POST",
    body: formData,
  });

  const json: UploadImageResult | any = await res.json();

  if ("error" in json) {
    throw new Error(JSON.stringify(json));
  }

  return json;
};

const test = async () => {
  const videoFilePath = "./assets/lihaibao.mp4"; // Path to your video file
  const videoBuffer = await readFile(videoFilePath);
  const videoFilename = "lihaibao.mp4"; // Or you can extract filename from path if needed

  const updata = await uploadImage(videoBuffer, videoFilename, true);
  console.log(updata);

  // const serverAddress = "192.168.2.20:7002";
  // const clientId = "baadbabe-b00b-4206-9420-deadd00d1337";
  // const client = new ComfyUIClient(serverAddress, clientId);

  // // Connect to server
  // await client.connect();

  // // Generate images
  // const images = await client.getImages(prompt);

  // // Save images to file
  // const outputDir = "./output_images";
  // await client.saveImages(images, outputDir);

  // // Disconnect
  // await client.disconnect();
};

test();
