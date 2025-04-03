import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as lark from "@larksuiteoapi/node-sdk";
// const fastify: FastifyInstance = Fastify({
//     logger: true
// });



// Authentication Middleware Function
const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const authorizationHeader = request.headers.authorization;
        console.log("authenticate start", authorizationHeader);

        if (!authorizationHeader) {
            reply.status(401).send({ message: 'Authorization header missing' });
            return; // Important: Terminate the request
        }


        const token = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.slice(7) : authorizationHeader;

        const ret2 = await (request.server as any).larkClient.authen.v1.userInfo.get({}, lark.withUserAccessToken(token));

        if (ret2.code == 0) {

            console.log("authenticate ok", ret2);
            (request as any).auth = { mobile: ret2.data?.mobile, openid: ret2.data?.union_id }
        } else {
            reply.status(401).send({ message: 'Authentication failed' });
        }



    } catch (error) {
        console.error("Authentication error:", error);
        reply.status(500).send({ message: 'Authentication failed' }); // Or 401, depending on error type
    }
};


export { authenticate }