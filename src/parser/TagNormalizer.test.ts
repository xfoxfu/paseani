import { GlobalDatabase } from "../database/index.js";
import { PrefixMatchParser } from "./PrefixMatchParser.js";
import { TagNormalizer } from "./TagNormalizer.js";
import { ResultBuilder, TagType, chainedParse } from "./index.js";
import test from "ava";

test("normalizes tags", async (t) => {
  const parser = new PrefixMatchParser();
  GlobalDatabase.loadBasicPrefix();

  GlobalDatabase.loadPrefix("TUcaptions", { type: TagType.team, stdName: ["TUCaptions"] });
  GlobalDatabase.loadPrefix("2017春", { type: TagType.unknown, stdName: [] });
  GlobalDatabase.loadPrefix("サクラクエスト", { type: TagType.title });
  GlobalDatabase.loadPrefix("SAKURA QUEST", { type: TagType.title, stdName: ["SAKURA QUEST"] });
  GlobalDatabase.loadPrefix("繁", { type: TagType.subtitle_language, stdName: ["zh-hant"] });
  GlobalDatabase.loadPrefix("720P", { type: TagType.resolution, stdName: ["720p"] });
  GlobalDatabase.loadPrefix("MP4", { type: TagType.file_type, stdName: ["mp4"] });
  GlobalDatabase.loadPrefix("新人招募中", { type: TagType.unknown, stdName: [] });

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

  t.deepEqual(normalizer.parse("", new ResultBuilder().addTag(TagType.title, "SAKURA   QUEST")).build(), {
    errors: [],
    tags: [{ parser: "*", type: "title", value: "SAKURA QUEST" }],
  });
});
