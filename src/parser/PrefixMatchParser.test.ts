import { PrefixMatchParser } from "./PrefixMatchParser.js";
import { TagType } from "./index.js";
import test from "ava";

test("trie works", (t) => {
  const parser = new PrefixMatchParser();
  parser.loadPrefix("foo", TagType.title);
  parser.loadPrefix("bar", TagType.episode);
  parser.loadBasicPrefix();

  t.deepEqual(parser.parse("FOO/BAR/AA/FOO/BB/BAR").build(), {
    errors: [],
    tags: [
      { parser: "PrefixMatchParser", type: "title", value: "FOO" },
      { parser: "PrefixMatchParser", type: "episode", value: "BAR" },
      { parser: "PrefixMatchParser", type: "unknown", value: "AA" },
      { parser: "PrefixMatchParser", type: "unknown", value: "BB" },
    ],
  });

  parser.loadPrefix("生肉", TagType.source_type);
  parser.loadPrefix("darling in the franxx", TagType.title);
  t.deepEqual(parser.parse("darling in the franxx 生肉").build(), {
    errors: [],
    tags: [
      { parser: "PrefixMatchParser", type: "title", value: "darling in the franxx" },
      { parser: "PrefixMatchParser", type: "source_type", value: "生肉" },
    ],
  });

  // database exists "堀与宫村 " -> next
  parser.loadPrefix("堀与宫村", TagType.title);
  parser.loadPrefix("堀与宫村 第二季", TagType.title);
  t.deepEqual(parser.parse("堀与宫村").tags, [{ type: TagType.title, value: "堀与宫村", parser: "PrefixMatchParser" }]);
  t.deepEqual(parser.parse("堀与宫村 NN BB").build().tags, [
    { parser: "PrefixMatchParser", type: TagType.title, value: "堀与宫村" },
    { parser: "PrefixMatchParser", type: TagType.unknown, value: "NN" },
    { parser: "PrefixMatchParser", type: TagType.unknown, value: "BB" },
  ]);
});

test("parses", (t) => {
  const parser = new PrefixMatchParser();
  parser.loadBasicPrefix();

  parser.loadPrefix("TUcaptions", TagType.team);
  parser.loadPrefix("2017春", "drop");
  parser.loadPrefix("サクラクエスト", TagType.title);
  parser.loadPrefix("SAKURA QUEST", TagType.title);
  parser.loadPrefix("02", TagType.episode);
  parser.loadPrefix("繁", TagType.subtitle_language);
  parser.loadPrefix("720P", TagType.resolution);
  parser.loadPrefix("MP4", TagType.file_type);
  parser.loadPrefix("新人招募中", "drop");
  t.deepEqual(parser.parse("[TUcaptions][2017春][サクラクエスト/SAKURA QUEST][02][繁][720P MP4](新人招募中)").build(), {
    errors: [],
    tags: [
      { parser: "PrefixMatchParser", type: "team", value: "TUcaptions" },
      { parser: "PrefixMatchParser", type: "title", value: "サクラクエスト" },
      { parser: "PrefixMatchParser", type: "title", value: "SAKURA QUEST" },
      { parser: "PrefixMatchParser", type: "episode", value: "02" },
      { parser: "PrefixMatchParser", type: "subtitle_language", value: "繁" },
      { parser: "PrefixMatchParser", type: "resolution", value: "720P" },
      { parser: "PrefixMatchParser", type: "file_type", value: "MP4" },
    ],
  });
});
