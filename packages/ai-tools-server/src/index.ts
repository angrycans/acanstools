import fastify from "fastify";
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
server.listen({ host, port });

console.log(`🚀  AI-tools-server running on port :${port}`);
