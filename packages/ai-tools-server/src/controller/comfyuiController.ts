import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Document } from "mongoose";
import Car, { ICar } from "../models/car";
import { successResponse, errorResponse } from "@/utils/api-response"
import * as fs from 'fs';

import { server } from "@/index"
import { ComfyApi, CallWrapper, PromptBuilder, TSamplerName, TSchedulerName, } from "@saintno/comfyui-sdk";

import workflowJson from "../../assets/workflow/workflow.json";
import audio2Timbre from "../../assets/workflow/audio2Timbre.json";


const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const seed = () => randomInt(1000, 9999);

export default async function TestController(fastify: FastifyInstance) {
  // /api/v1/comfyui
  fastify.get("/", async function (_request: FastifyRequest, reply: FastifyReply) {
    reply.send({
      balance: "$0.01",
      picture: "U NO HAVE PICTURE",
      age: 48,
      name: "charster Li",
      gender: "male",
      company: "none",
      email: "angrycans@gmail.com",
    });
  });

  fastify.post("/audio2Timbre", function (_request: FastifyRequest, reply: FastifyReply) {
    try {

      const { speaker_name, prompt, audio } = _request.body as { audio: string; prompt: string, speaker_name: string };



      if (speaker_name && prompt && audio) {

        console.log("req params", _request.body)
        const api = new ComfyApi("http://192.168.2.20:7002").init();

        const audio2TimbreWorkflow = new PromptBuilder(
          audio2Timbre,
          ["audio", "speaker_name", "prompt", "seed"],
          ["audio"],
        )
          .setInputNode("audio", "5.inputs.audio")
          .setInputNode("speaker_name", "8.inputs.speaker_name")
          .setInputNode("prompt", "9.inputs.string")
          .setInputNode("seed", "6.inputs.seed")

          .setOutputNode("audio", "7")

        console.log("audio2TimbreWorkflow end")

        const workflow = audio2TimbreWorkflow
          .input("audio", audio)
          .input("prompt", prompt)
          .input("speaker_name", speaker_name)
          .input("seed", seed())
        console.log("workflow end")


        new CallWrapper(api, workflow)
          .onFinished((data) => {
            console.log("onFinished ", data)
            //console.log(data.images?.images.map((img: any) => api.getPathImage(img)));
            reply.send(successResponse(data))


          })
          .onPending((promptId) => { console.log("onPending ", promptId) })
          .onStart((promptId) => { console.log("onStart ", promptId) })
          .onOutput((out) => { console.log("onOutput", out) })
          .onProgress((NodeProgress, promptId) => { console.log("NodeProgress", NodeProgress) })
          .onFailed((err, promptId) => {
            console.log("onFailed ", err, promptId);
            //reply.send(errorResponse(err))

          })
          .run();

      } else {
        reply.send(errorResponse("参数错误"))
      }
    } catch (err) {
      console.log("catch err", err)
      reply.send(errorResponse(err.message))
    }


  });


  fastify.get("/test", function (_request: FastifyRequest, reply: FastifyReply) {
    try {
      const api = new ComfyApi("http://192.168.2.20:7002").init();

      const workflow = new PromptBuilder(
        workflowJson,
        ["seed"],
        ["images"],


      )
        .setOutputNode("images", "9")
        .setInputNode("seed", "3.inputs.seed")
        .input("seed", seed())



      new CallWrapper(api, workflow)
        .onFinished((data) => {
          console.log("onFinished ", data)
          console.log(data.images?.images.map((img: any) => api.getPathImage(img)));
          reply.send(successResponse({ ret: "ok" }))

        })
        .onPending((promptId) => { console.log("onPending ", promptId) })
        .onStart((promptId) => { console.log("onStart ", promptId) })
        .onOutput(() => { console.log("onOutput") })
        .onProgress((NodeProgress, promptId) => { console.log("NodeProgress", NodeProgress) })
        .onFailed((err, promptId) => { console.log("onFailed ", err) })
        .run();

    } catch (err) {
      reply.send(errorResponse(err.message))
    }
  });
}
