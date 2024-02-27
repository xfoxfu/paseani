import { LilithOrAniParser } from "./LilithOrAniParser.js";
import test_, { TestFn } from "ava";

const test = test_ as TestFn<{ parser: LilithOrAniParser }>;

test.before("prepare parser", async (t) => {
  t.context.parser = new LilithOrAniParser();
  await t.context.parser.init();
});

test("can parse properly", (t) => {
  t.deepEqual(
    t.context.parser
      .parse("[Lilith-Raws] 神推偶像登上武道館我就死而無憾 / Oshibudo - 08 [Baha][WEB-DL][1080p][AVC AAC][CHT][MKV]")
      .build(),
    {
      errors: [],
      tags: [
        { parser: "LilithOrAniParser", type: "team", value: "Lilith-Raws" },
        { parser: "LilithOrAniParser", type: "title", value: "神推偶像登上武道館我就死而無憾" },
        { parser: "LilithOrAniParser", type: "title", value: "Oshibudo" },
        { parser: "LilithOrAniParser", type: "episode", value: "08" },
        { parser: "LilithOrAniParser", type: "unknown", value: "Baha" },
        { parser: "LilithOrAniParser", type: "unknown", value: "WEB-DL" },
        { parser: "LilithOrAniParser", type: "unknown", value: "1080p" },
        { parser: "LilithOrAniParser", type: "unknown", value: "AVC" },
        { parser: "LilithOrAniParser", type: "unknown", value: "AAC" },
        { parser: "LilithOrAniParser", type: "unknown", value: "CHT" },
        { parser: "LilithOrAniParser", type: "unknown", value: "MKV" },
      ],
    },
  );
  t.deepEqual(
    t.context.parser
      .parse("[ANi] BUILDDIVIDE - BUILD-DIVIDE -#FFFFFF- CODE WHITE[14][1080P][Baha][WEB-DL][AAC AVC][MP4]")
      .build(),
    {
      errors: [],
      tags: [
        { parser: "LilithOrAniParser", type: "team", value: "ANi" },
        { parser: "LilithOrAniParser", type: "title", value: "BUILDDIVIDE - BUILD-DIVIDE -#FFFFFF- CODE WHITE" },
        { parser: "LilithOrAniParser", type: "episode", value: "14" },
        { parser: "LilithOrAniParser", type: "unknown", value: "1080P" },
        { parser: "LilithOrAniParser", type: "unknown", value: "Baha" },
        { parser: "LilithOrAniParser", type: "unknown", value: "WEB-DL" },
        { parser: "LilithOrAniParser", type: "unknown", value: "AAC" },
        { parser: "LilithOrAniParser", type: "unknown", value: "AVC" },
        { parser: "LilithOrAniParser", type: "unknown", value: "MP4" },
      ],
    },
  );
  t.deepEqual(
    t.context.parser
      .parse("[ANi]  打工吧，魔王大人！第二季 [特別篇] - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]")
      .build(),
    {
      errors: [],
      tags: [
        { parser: "LilithOrAniParser", type: "team", value: "ANi" },
        { parser: "LilithOrAniParser", type: "title", value: "打工吧，魔王大人！第二季 [特別篇]" },
        { parser: "LilithOrAniParser", type: "episode", value: "01" },
        { parser: "LilithOrAniParser", type: "unknown", value: "1080P" },
        { parser: "LilithOrAniParser", type: "unknown", value: "Baha" },
        { parser: "LilithOrAniParser", type: "unknown", value: "WEB-DL" },
        { parser: "LilithOrAniParser", type: "unknown", value: "AAC" },
        { parser: "LilithOrAniParser", type: "unknown", value: "AVC" },
        { parser: "LilithOrAniParser", type: "unknown", value: "CHT" },
        { parser: "LilithOrAniParser", type: "unknown", value: "MP4" },
      ],
    },
  );
});
