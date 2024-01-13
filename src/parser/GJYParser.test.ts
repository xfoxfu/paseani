import { GJYParser } from "./GJYParser.js";
import { getEmptyResult } from "./index.js";
import test_, { TestFn } from "ava";

const test = test_ as TestFn<{ parser: GJYParser }>;

test.before("prepare parser", async (t) => {
  t.context.parser = new GJYParser();
  await t.context.parser.init();
});

test("can parse properly", (t) => {
  t.deepEqual(
    t.context.parser.parse(
      "[NC-Raws] 龙蛇演义 / Dragon's Disciple - 16 (B-Global Donghua 1920x1080 HEVC AAC MKV)",
      getEmptyResult(),
    ),
    {
      applied_parsers: [],
      audio_type: ["aac"],
      episode: ["16"],
      errors: [],
      file_type: ["mkv"],
      link: [],
      resolution: ["1080p"],
      source_team: ["B-Global"],
      source_type: [],
      subtitle_language: [],
      team: ["NC-Raws"],
      title: ["龙蛇演义", "Dragon's Disciple"],
      video_type: ["h265"],
    },
  );
  t.deepEqual(
    t.context.parser.parse(
      "[NC-Raws] 夜夜猫歌 / Yoru wa Neko to Issho - 07 (B-Global 1920x1080 HEVC AAC MKV)",
      getEmptyResult(),
    ),
    {
      applied_parsers: [],
      audio_type: ["aac"],
      episode: ["07"],
      errors: [],
      file_type: ["mkv"],
      link: [],
      resolution: ["1080p"],
      source_team: ["B-Global"],
      source_type: [],
      subtitle_language: [],
      team: ["NC-Raws"],
      title: ["夜夜猫歌", "Yoru wa Neko to Issho"],
      video_type: ["h265"],
    },
  );
  t.deepEqual(
    t.context.parser.parse(
      "[NC-Raws] 白沙的水族馆 / Shiroi Suna no Aquatope - 24 [B-Global][WEB-DL][1080p][AVC AAC][Multiple Subtitle][MKV]",
      getEmptyResult(),
    ),
    {
      applied_parsers: [],
      audio_type: ["aac"],
      episode: ["24"],
      errors: [],
      file_type: ["mkv"],
      link: [],
      resolution: ["1080p"],
      source_team: ["B-Global"],
      source_type: ["Web-DL"],
      subtitle_language: [],
      team: ["NC-Raws"],
      title: ["白沙的水族馆", "Shiroi Suna no Aquatope"],
      video_type: ["h264"],
    },
  );
  t.deepEqual(t.context.parser.parse("【推しの子】 Opus.COLORs 色彩高校星 - 08 (Baha 1920x1080 AVC AAC MP4)"), {
    applied_parsers: [],
    audio_type: ["aac"],
    episode: ["08"],
    errors: [],
    file_type: ["mp4"],
    link: [],
    resolution: ["1080p"],
    source_team: ["Baha"],
    source_type: [],
    subtitle_language: [],
    team: ["NC-Raws"],
    title: ["Opus.COLORs 色彩高校星"],
    video_type: ["h264"],
  });
  t.deepEqual(
    t.context.parser.parse(
      "[NC-Raws] 杜鵑婚約 / Kakkou no Iinazuke (A Couple of Cuckoos) - 04 (Baha 1920x1080 AVC AAC MP4)",
      getEmptyResult(),
    ),
    {
      applied_parsers: [],
      audio_type: ["aac"],
      episode: ["04"],
      errors: [],
      file_type: ["mp4"],
      link: [],
      resolution: ["1080p"],
      source_team: ["Baha"],
      source_type: [],
      subtitle_language: [],
      team: ["NC-Raws"],
      title: ["杜鵑婚約", "Kakkou no Iinazuke (A Couple of Cuckoos)"],
      video_type: ["h264"],
    },
  );
});
