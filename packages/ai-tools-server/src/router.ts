import { FastifyInstance } from "fastify";
import testController from "./controller/testController";
import indexController from "./controller/indexController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(testController, { prefix: "/api/v1/user" });
  fastify.register(indexController, { prefix: "/" });
}
