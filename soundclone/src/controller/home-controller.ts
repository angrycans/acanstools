/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from "koa";
import homeService from "../service/home-service";

export const test = async (ctx: Context) => {
  const { name } = ctx.params;

  const res = await homeService.test(name);
  ctx.body = res;
};
