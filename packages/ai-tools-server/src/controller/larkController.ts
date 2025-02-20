import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as lark from "@larksuiteoapi/node-sdk";

export default async function LarkController(fastify: FastifyInstance) {
  // GET /api/v1/lark
  fastify.get("/", async function (_request: FastifyRequest, reply: FastifyReply) {
    reply.send("Hello, Lark!");
  });

  fastify.get("/login/:code", async function (_request: FastifyRequest, reply: FastifyReply) {
    const client = new lark.Client({
      appId: "cli_a724240555b8d00e",
      appSecret: "a7cBwE2gkjEJ6dpXQROvjepfAsWDCC4L",
      disableTokenCache: false,
    });

    const code = (_request.params as any).code;
    const res = await client.authen.accessToken.create({ data: { code, grant_type: "authorization_code" } });
    if (res.code == 0) {
      const { access_token, refresh_token, open_id } = res.data;
      //   client.authen.v1.userInfo
      //     .get({})
      //     .then((res) => {
      //       console.log(res);
      //       reply.send({ code: 0, data: { access_token, refresh_token, open_id } });
      //     })
      //     .catch((e) => {
      //       console.error(JSON.stringify(e.response.data, null, 4));
      //       reply.send({ code: 0, msg: e });
      //     });

      const ret2 = await client.authen.v1.userInfo.get({}, lark.withUserAccessToken(access_token));
      console.log(ret2);
      reply.send({ code: 0, data: { access_token, refresh_token, open_id } });
    } else {
      reply.send({ code: -1, msg: res.msg });
    }

    // try {
    //   // 调用接口获取 user_access_token 和 openid
    //   const response = await client.authen.v2.oauth.token({
    //     data: {
    //       grant_type: "authorization_code",
    //       code: code, // 小程序端获取的授权码
    //     },
    //   });

    //   if (response.data) {
    //     const { access_token, open_id } = response.data;
    //     console.log("Access Token:", access_token);
    //     console.log("Open ID:", open_id);
    //     return { access_token, open_id };,
    //   } else {
    //     console.error("获取失败:", response);
    //   }
    // } catch (error) {
    //   console.error("调用接口失败:", error);
    // }

    //reply.send("Hello, Lark!");
  });
}
