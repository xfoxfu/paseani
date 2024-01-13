import { PrefixMatchParser } from "./PrefixMatchParser.js";
import test from "ava";
import _ from "lodash";

test("trie works", (t) => {
  const parser = new PrefixMatchParser();
  parser.loadPrefix("foo", "title");
  parser.loadPrefix("bar", "episode");
  parser.loadBasicPrefix();

  t.deepEqual(_.pick(parser.parse("FOO/BAR/AA/FOO/BB/BAR"), ["episode", "errors", "title"]), {
    episode: ["BAR", "BAR"],
    errors: ["AA", "BB"],
    title: ["FOO", "FOO"],
  });

  parser.loadPrefix("生肉", "source_type");
  parser.loadPrefix("darling in the franxx", "title");
  t.deepEqual(_.pick(parser.parse("darling in the franxx 生肉"), ["source_type", "title"]), {
    source_type: ["生肉"],
    title: ["darling in the franxx"],
  });

  // database exists "堀与宫村 " -> next
  parser.loadPrefix("堀与宫村", "title");
  parser.loadPrefix("堀与宫村 第二季", "title");
  t.deepEqual(parser.parse("堀与宫村").title, ["堀与宫村"]);
  t.deepEqual(_.pick(parser.parse("堀与宫村 NN"), ["errors", "title"]), {
    errors: ["NN"],
    title: ["堀与宫村"],
  });
});

test("parses", (t) => {
  const parser = new PrefixMatchParser();
  parser.loadBasicPrefix();

  parser.loadPrefix("TUcaptions", "team");
  parser.loadPrefix("2017春", "drop");
  parser.loadPrefix("サクラクエスト", "title");
  parser.loadPrefix("SAKURA QUEST", "title");
  parser.loadPrefix("02", "episode");
  parser.loadPrefix("繁", "subtitle_language");
  parser.loadPrefix("720P", "resolution");
  parser.loadPrefix("MP4", "file_type");
  parser.loadPrefix("新人招募中", "drop");
  t.deepEqual(parser.parse("[TUcaptions][2017春][サクラクエスト/SAKURA QUEST][02][繁][720P MP4](新人招募中)"), {
    applied_parsers: [],
    audio_type: [],
    episode: ["02"],
    errors: [],
    file_type: ["MP4"],
    link: [],
    resolution: ["720P"],
    source_team: [],
    source_type: [],
    subtitle_language: ["繁"],
    team: ["TUcaptions"],
    title: ["サクラクエスト", "SAKURA QUEST"],
    video_type: [],
  });
});
