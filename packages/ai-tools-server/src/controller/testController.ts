import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Document } from "mongoose";
import Car, { ICar } from "../models/car";

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

  fastify.get("/getcars", async function (_request: FastifyRequest, reply: FastifyReply) {
    try {
      const cars = await Car.find();
      return cars;
    } catch (err) {
      return reply.code(500).send({ error: err });
    }
  });
}
