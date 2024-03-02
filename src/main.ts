import { GlobalDatabase } from "./database/index.js";
import { LinkEnricher } from "./lib.js";
import { log } from "./log.js";
import { GJYParser } from "./parser/GJYParser.js";
import { LilithOrAniParser } from "./parser/LilithOrAniParser.js";
import { PrefixMatchParser } from "./parser/PrefixMatchParser.js";
import { TagNormalizer } from "./parser/TagNormalizer.js";
import { Parser, chainedParse } from "./parser/index.js";
import Router from "@koa/router";
import Koa from "koa";
import serve from "koa-static";

const app = new Koa();
const router = new Router();

const buildParsers = () => {
  parsers = [
    new GJYParser(),
    new LilithOrAniParser(),
    new PrefixMatchParser(),
    new LinkEnricher(),
    new TagNormalizer(),
  ];
};
const initParsers = async () => {
  await GlobalDatabase.init();
  for (const parser of parsers) {
    try {
      await parser.init();
      log.info(`parser ${parser.name} initialized`);
    } catch (e) {
      log.error(e);
    }
  }
};

let parsers: Parser[] = [];
buildParsers();
void initParsers();

router.get("/info", (ctx) => {
  const name = ctx.query["name"] as string;
  if (typeof name !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Query param `name` must be a string." };
  }
  const result = chainedParse(parsers, name);
  ctx.body = result;
});

router.post("/internal/database/update", async (ctx) => {
  if ((ctx.query["token"] ?? "INVALID_TOKEN") !== process.env["PASEANI_ADMIN_TOKEN"]) {
    ctx.status = 403;
    return;
  }
  await Promise.all(
    GlobalDatabase.rawDatabases.map(async (d) => {
      console.log(d.name);
      await d.update();
    }),
  );
  await GlobalDatabase.init();
  ctx.body = { status: "ok" };
});

app.use(router.routes()).use(router.allowedMethods()).use(serve("public", {})).listen(3000);
log.info("paseani listening on 3000");
