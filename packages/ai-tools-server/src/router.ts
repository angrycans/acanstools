import { FastifyInstance } from "fastify";
import testController from "./controller/testController";
import indexController from "./controller/indexController";
import LarkController from "./controller/larkController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(testController, { prefix: "/api/v1/user" });
  fastify.register(indexController, { prefix: "/" });
  fastify.register(LarkController, { prefix: "/api/v1/lark" });
}
