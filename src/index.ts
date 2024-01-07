import express from "express";
import _ from "lodash";
import { ILogObj, Logger } from "tslog";
import { BangumiParser, GJYParser, LilithOrAniParser, Parser } from "./parser/index.js";

const log: Logger<ILogObj> = new Logger();

const app = express();

export interface Result {
  title: string[];
  team: string[];
  episode: string[];
  source_team: string[];
  source_type: string[];
  resolution: string[];
  subtitle_language: string[];
  file_type: string[];
  video_type: string[];
  audio_type: string[];
  link: string[];
  errors: string[];
  applied_parsers: string[];
}

// const parsers: Parser[] = [new GJYParser(), new LilithOrAniParser(), new AniDBParser(), new BangumiParser()];
const parsers: Parser[] = [new GJYParser(), new LilithOrAniParser(), new BangumiParser()];
for (const parser of parsers) {
  parser
    .init()
    .then(() => log.info(`parser ${parser.name} initialized`))
    .catch((e) => log.error(e));
}

app.get("/info", (req, res) => {
  let name = req.query["name"] as string;
  if (typeof name !== "string") {
    res.status(400).send({ error: "Query param `name` must be a string." });
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
  res.json(result);
});

app.listen(3000);
log.info("paseani listening on 3000");
