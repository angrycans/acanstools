import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function TestController(fastify: FastifyInstance) {
  // GET /api/v1/user
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
}
