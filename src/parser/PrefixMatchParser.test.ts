import { GlobalDatabase } from "../database/index.js";
import { PrefixMatchParser } from "./PrefixMatchParser.js";
import { TagType } from "./index.js";
import test from "ava";

test("trie works", (t) => {
  const parser = new PrefixMatchParser();
  GlobalDatabase.loadPrefix("foo", { type: TagType.title });
  GlobalDatabase.loadPrefix("bar", { type: TagType.episode });
  GlobalDatabase.loadBasicPrefix();

  t.deepEqual(parser.parse("FOO/BAR/AA/FOO/BB/BAR/FOOO").build(), {
    errors: [],
    tags: [
      { parser: "PrefixMatchParser", type: "title", value: "FOO" },
      { parser: "PrefixMatchParser", type: "episode", value: "BAR" },
      { parser: "PrefixMatchParser", type: "unknown", value: "AA" },
      { parser: "PrefixMatchParser", type: "unknown", value: "BB" },
      { parser: "PrefixMatchParser", type: "unknown", value: "FOOO" },
    ],
  });

  GlobalDatabase.loadPrefix("生肉", { type: TagType.source_type });
  GlobalDatabase.loadPrefix("darling in the franxx", { type: TagType.title });
  t.deepEqual(parser.parse("darling in the franxx 生肉").build(), {
    errors: [],
    tags: [
      { parser: "PrefixMatchParser", type: "title", value: "darling in the franxx" },
      { parser: "PrefixMatchParser", type: "source_type", value: "生肉" },
    ],
  });

  // database exists "堀与宫村 " -> next
  GlobalDatabase.loadPrefix("堀与宫村", { type: TagType.title });
  GlobalDatabase.loadPrefix("堀与宫村 第二季", { type: TagType.title });
  t.deepEqual(parser.parse("堀与宫村").tags, [{ type: TagType.title, value: "堀与宫村", parser: "PrefixMatchParser" }]);
  t.deepEqual(parser.parse("堀与宫村 NN BB").build().tags, [
    { parser: "PrefixMatchParser", type: TagType.title, value: "堀与宫村" },
    { parser: "PrefixMatchParser", type: TagType.unknown, value: "NN" },
    { parser: "PrefixMatchParser", type: TagType.unknown, value: "BB" },
  ]);
});

test("parses", (t) => {
  const parser = new PrefixMatchParser();
  GlobalDatabase.loadBasicPrefix();

  GlobalDatabase.loadPrefix("TUcaptions", { type: TagType.team });
  GlobalDatabase.loadPrefix("2017春", { type: TagType.unknown, stdName: [] });
  GlobalDatabase.loadPrefix("サクラクエスト", { type: TagType.title });
  GlobalDatabase.loadPrefix("SAKURA QUEST", { type: TagType.title });
  GlobalDatabase.loadPrefix("02", { type: TagType.episode });
  GlobalDatabase.loadPrefix("繁", { type: TagType.subtitle_language });
  GlobalDatabase.loadPrefix("720P", { type: TagType.resolution });
  GlobalDatabase.loadPrefix("MP4", { type: TagType.file_type });
  GlobalDatabase.loadPrefix("新人招募中", { type: TagType.unknown, stdName: [] });
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
