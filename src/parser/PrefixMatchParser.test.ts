import { PrefixMatchParser } from "./PrefixMatchParser.js";
import { getEmptyResult } from "./index.js";
import test from "ava";

test("trie works", (t) => {
  const parser = new PrefixMatchParser();
  parser.loadPrefix("foo", "title");
  parser.loadPrefix("bar", "episode");
  parser.loadBasicPrefix();

  t.deepEqual(parser.parse("FOO/BAR/AA/FOO/BB/BAR", getEmptyResult()), {
    applied_parsers: [],
    audio_type: [],
    episode: ["BAR", "BAR"],
    errors: ["AA", "BB"],
    file_type: [],
    link: [],
    resolution: [],
    source_team: [],
    source_type: [],
    subtitle_language: [],
    team: [],
    title: ["FOO", "FOO"],
    video_type: [],
  });
});

test("parses", async (t) => {
  const parser = new PrefixMatchParser();
  parser.loadBasicPrefix();
  await parser.loadBangumiData();

  t.deepEqual(
    parser.parse("[TUcaptions][2017春][サクラクエスト/SAKURA QUEST][02][繁][720P MP4](新人招募中)", getEmptyResult()),
    {
      applied_parsers: [],
      audio_type: [],
      episode: [],
      errors: ["TUcaptions", "2017春", "02", "繁", "720P", "MP4", "新人招募中"],
      file_type: [],
      link: [],
      resolution: [],
      source_team: [],
      source_type: [],
      subtitle_language: [],
      team: [],
      title: ["サクラクエスト", "SAKURA QUEST"],
      video_type: [],
    },
  );

  parser.loadPrefix("生肉", "source_type");
  t.deepEqual(parser.parse("darling in the franxx 生肉", getEmptyResult()), {
    applied_parsers: [],
    audio_type: [],
    episode: [],
    errors: [],
    file_type: [],
    link: [],
    resolution: [],
    source_team: [],
    source_type: ["生肉"],
    subtitle_language: [],
    team: [],
    title: ["darling in the franxx"],
    video_type: [],
  });
});
