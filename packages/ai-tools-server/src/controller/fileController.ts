import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Document } from "mongoose";
import Car, { ICar } from "../models/car";
import {successResponse,errorResponse}from "@/utils/api-response"
import * as fs from 'fs';  

import {server} from "@/index"


function renameFilename(originalFilename: string): string {
  // 1. Remove the UUID part at the beginning
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/;
  const filenameWithoutUuid = originalFilename.replace(uuidRegex, '');

  // 2. URL decode the remaining filename
  const decodedFilename = decodeURIComponent(filenameWithoutUuid);

  return decodedFilename;
}


export default async function TestController(fastify: FastifyInstance) {
  // /api/v1/file
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

  fastify.post("/upload", async function (_request: FastifyRequest, reply: FastifyReply) {
    try {
        const file = await _request.file()
        const path=`${server.config.UPLOAD_DIR}/${renameFilename(file.filename)}`
        const writeStream = fs.createWriteStream(path);  

        console.log("file",file)
        file.file.pipe(writeStream);  



      reply.send(successResponse(path))
    } catch (err) {
       reply.send(errorResponse(err.message))
    }
  });
}
