import fastify from "fastify";
import mongoose from "mongoose";
import multipart from '@fastify/multipart'
import formbody from '@fastify/formbody'
import * as fs from 'fs';
import path, { resolve } from "path";

import fastifyStatic from "@fastify/static";

import { fileURLToPath } from "url";
import * as lark from "@larksuiteoapi/node-sdk";


import config from "./plugins/config";

import router from "./router";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

//console.log(path.join(__dirname, 'key.pem'))

export const server = fastify({
  // https: {
  //   key: fs.readFileSync(path.join(__dirname, '../assets/private-key.pem')), // 读取私钥文件
  //   cert: fs.readFileSync(path.join(__dirname, '../assets/certificate.pem')) // 读取证书文件
  // },
  ajv: {
    customOptions: {
      removeAdditional: "all",
      coerceTypes: true,
      useDefaults: true,
    },
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
});

await server.register(config);

await server.register(formbody)
await server.register(multipart, {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100,     // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 500 * 1024 * 1024,  // For multipart forms, the max file size in bytes
    files: 1,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
    parts: 1000         // For multipart forms, the max number of parts (fields + files)
  }
});


await server.register(fastifyStatic, {
  root: path.join('/home/acans/ComfyUI/output'),
  prefix: '/output/',
  decorateReply: false
});

await server.register(fastifyStatic, {
  root: path.join('/home/acans/ComfyUI/input'),
  prefix: '/input/',
  decorateReply: false
});


// await server.addContentTypeParser('*', (req, done) => {
//   //req.isMultipart = true;
//   done(null, req)
// });

// Extract the token
const larkClient = new lark.Client({
  appId: "cli_a724240555b8d00e",
  appSecret: "a7cBwE2gkjEJ6dpXQROvjepfAsWDCC4L",
  disableTokenCache: false,
});


await server.decorate('larkClient', larkClient);


await server.register(router);
await server.ready();

const port = +server.config.API_PORT;
const host = server.config.API_HOST;
mongoose
  .connect(`${server.config.MONGODB}`, { socketTimeoutMS: 10000 })
  .then(() => {
    server.log.info("MongoDB connected...");
    server.listen({ host, port });
    server.log.info(`🚀  AI-tools-server running on port :${port}`);
  })
  .catch((err) => server.log.error(err));
