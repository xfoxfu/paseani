import test_, { TestFn } from "ava";
import { LilithOrAniParser } from "./LilithOrAniParser.js";
import { getEmptyResult } from "./index.js";

const test = test_ as TestFn<{ parser: LilithOrAniParser }>;

test.before("prepare parser", async (t) => {
  t.context.parser = new LilithOrAniParser();
  await t.context.parser.init();
});

test("can parse properly", (t) => {
  t.deepEqual(
    t.context.parser.parse(
      "[Lilith-Raws] 神推偶像登上武道館我就死而無憾 / Oshibudo - 08 [Baha][WEB-DL][1080p][AVC AAC][CHT][MKV]",
      getEmptyResult()
    ),
    {
      applied_parsers: [],
      audio_type: ["aac"],
      episode: ["08"],
      errors: [],
      file_type: ["MKV"],
      link: [],
      resolution: ["1080p"],
      source_team: ["Baha"],
      source_type: ["Web-DL"],
      subtitle_language: ["zh-Hant"],
      team: ["Lilith-Raws"],
      title: ["神推偶像登上武道館我就死而無憾", "Oshibudo"],
      video_type: ["h264"],
    }
  );
  t.deepEqual(
    t.context.parser.parse(
      "[ANi] BUILDDIVIDE - BUILD-DIVIDE -#FFFFFF- CODE WHITE[14][1080P][Baha][WEB-DL][AAC AVC][MP4]",
      getEmptyResult()
    ),
    {
      applied_parsers: [],
      audio_type: ["aac"],
      episode: ["14"],
      errors: [],
      file_type: ["MP4"],
      link: [],
      resolution: ["1080p"],
      source_team: ["Baha"],
      source_type: ["Web-DL"],
      subtitle_language: [],
      team: ["ANi"],
      title: ["BUILDDIVIDE - BUILD-DIVIDE -#FFFFFF- CODE WHITE"],
      video_type: ["h264"],
    }
  );
  t.deepEqual(
    t.context.parser.parse(
      "[ANi]  打工吧，魔王大人！第二季 [特別篇] - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]",
      getEmptyResult()
    ),
    {
      applied_parsers: [],
      audio_type: ["aac"],
      episode: ["01"],
      errors: [],
      file_type: ["MP4"],
      link: [],
      resolution: ["1080p"],
      source_team: ["Baha"],
      source_type: ["Web-DL"],
      subtitle_language: ["zh-Hant"],
      team: ["ANi"],
      title: ["打工吧，魔王大人！第二季 [特別篇]"],
      video_type: ["h264"],
    }
  );
});
