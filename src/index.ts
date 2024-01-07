import express from "express";
import { ILogObj, Logger } from "tslog";
import { GJYParser, LilithParser } from "./parser/index.js";

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
  const parsers = [new GJYParser(), new LilithParser()];
  for (const parser of parsers) {
    if (parser.canParse(name)) {
      result.applied_parsers.push(parser.name);
      result = parser.parse(name, result);
    }
  }
  res.json(result);
});

app.listen(3000);
log.info("paseani listening on 3000");
