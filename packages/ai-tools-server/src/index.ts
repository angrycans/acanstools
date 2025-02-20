import fastify from "fastify";
import mongoose from "mongoose";

import config from "./plugins/config";

import router from "./router";

const server = fastify({
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
