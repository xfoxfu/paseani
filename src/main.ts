import { log } from "./log.js";
import { BangumiParser } from "./parser/BangumiParser.js";
import { GJYParser } from "./parser/GJYParser.js";
import { LilithOrAniParser } from "./parser/LilithOrAniParser.js";
import { Parser, chainedParse } from "./parser/index.js";
import Router from "@koa/router";
import Koa from "koa";

const app = new Koa();
const router = new Router();

const parsers: Parser[] = [new GJYParser(), new LilithOrAniParser(), new BangumiParser()];
for (const parser of parsers) {
  parser
    .init()
    .then(() => log.info(`parser ${parser.name} initialized`))
    .catch((e) => log.error(e));
}

router.get("/info", (ctx) => {
  const name = ctx.query["name"] as string;
  if (typeof name !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Query param `name` must be a string." };
  }
  const result = chainedParse(parsers, name);
  ctx.body = result;
});

router.post("/internal/bangumi/update", async (ctx) => {
  const parser = parsers.find((x) => x instanceof BangumiParser) as BangumiParser | undefined;
  await parser?.updateData();
  await parser?.init();
  ctx.body = { status: "ok" };
});

app.use(router.routes()).use(router.allowedMethods()).listen(3000);
log.info("paseani listening on 3000");
