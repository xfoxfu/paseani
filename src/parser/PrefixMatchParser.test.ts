import { PrefixMatchParser } from "./PrefixMatchParser.js";
import { getEmptyResult } from "./index.js";
import test from "ava";
import _ from "lodash";

test("trie works", (t) => {
  const parser = new PrefixMatchParser();
  parser.loadPrefix("foo", "title");
  parser.loadPrefix("bar", "episode");
  parser.loadBasicPrefix();

  t.deepEqual(_.pick(parser.parse("FOO/BAR/AA/FOO/BB/BAR", getEmptyResult()), ["episode", "errors", "title"]), {
    episode: ["BAR", "BAR"],
    errors: ["AA", "BB"],
    title: ["FOO", "FOO"],
  });

  parser.loadPrefix("生肉", "source_type");
  parser.loadPrefix("darling in the franxx", "title");
  t.deepEqual(_.pick(parser.parse("darling in the franxx 生肉", getEmptyResult()), ["source_type", "title"]), {
    source_type: ["生肉"],
    title: ["darling in the franxx"],
  });

  // database exists "堀与宫村 " -> next
  parser.loadPrefix("堀与宫村", "title");
  parser.loadPrefix("堀与宫村 第二季", "title");
  t.deepEqual(parser.parse("堀与宫村", getEmptyResult()).title, ["堀与宫村"]);
  t.deepEqual(_.pick(parser.parse("堀与宫村 NN", getEmptyResult()), ["errors", "title"]), {
    errors: ["NN"],
    title: ["堀与宫村"],
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
      episode: ["02"],
      errors: ["TUcaptions", "2017春", "繁", "720P", "MP4", "新人招募中"],
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
});
