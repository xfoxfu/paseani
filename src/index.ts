import { log } from "./log.js";
import { BangumiParser } from "./parser/BangumiParser.js";
import { GJYParser } from "./parser/GJYParser.js";
import { LilithOrAniParser } from "./parser/LilithOrAniParser.js";
import { Parser, Result } from "./parser/index.js";
import Router from "@koa/router";
import Koa from "koa";
import _ from "lodash";

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
  let name = ctx.query["name"] as string;
  if (typeof name !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Query param `name` must be a string." };
  }
  name = name.replace(/\s\s+/g, " ");
  let result: Result = {
    title: [],
    team: [],
    episode: [],
    source_team: [],
    source_type: [],
    resolution: [],
    subtitle_language: [],
    file_type: [],
    video_type: [],
    audio_type: [],
    link: [],
    errors: [],
    applied_parsers: [],
  } satisfies Result;
  for (const parser of parsers) {
    if (parser.canParse(name)) {
      result.applied_parsers.push(parser.name);
      result = parser.parse(name, result);
    }
  }
  for (const key in result) {
    result[key as keyof Result] = _.uniq(result[key as keyof Result]);
  }
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
