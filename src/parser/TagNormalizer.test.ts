import { PrefixMatchParser } from "./PrefixMatchParser.js";
import { TagNormalizer } from "./TagNormalizer.js";
import { TagType, chainedParse } from "./index.js";
import test from "ava";

test("normalizes tags", async (t) => {
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

  const normalizer = new TagNormalizer();
  await normalizer.init();

  t.deepEqual(
    chainedParse(
      [parser, normalizer],
      "[TUcaptions][2017春][サクラクエスト/SAKURA QUEST][02][繁][720P MP4](新人招募中)",
    ),
    {
      errors: [],
      tags: [
        { parser: "PrefixMatchParser*", type: "team", value: "TUCaptions" },
        { parser: "PrefixMatchParser", type: "title", value: "サクラクエスト" },
        { parser: "PrefixMatchParser", type: "title", value: "SAKURA QUEST" },
        { parser: "PrefixMatchParser", type: "episode", value: "02" },
        { parser: "PrefixMatchParser*", type: "subtitle_language", value: "zh-hant" },
        { parser: "PrefixMatchParser*", type: "resolution", value: "720p" },
        { parser: "PrefixMatchParser*", type: "file_type", value: "mp4" },
      ],
    },
  );
});
