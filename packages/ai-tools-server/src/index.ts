import fastify from "fastify";
import mongoose from "mongoose";
import multipart from '@fastify/multipart'
import formbody from '@fastify/formbody'



import config from "./plugins/config";

import router from "./router";

export const server = fastify({
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
    fileSize: 1000000,  // For multipart forms, the max file size in bytes
    files: 1,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
    parts: 1000         // For multipart forms, the max number of parts (fields + files)
  }
});

// await server.addContentTypeParser('*', (req, done) => {
//   //req.isMultipart = true;
//   done(null, req)
// });


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
