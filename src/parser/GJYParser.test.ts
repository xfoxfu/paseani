import { GJYParser } from "./GJYParser.js";
import test_, { TestFn } from "ava";

const test = test_ as TestFn<{ parser: GJYParser }>;

test.before("prepare parser", async (t) => {
  t.context.parser = new GJYParser();
  await t.context.parser.init();
});

test("can parse properly", (t) => {
  t.deepEqual(
    t.context.parser
      .parse("[NC-Raws] 龙蛇演义 / Dragon's Disciple 16 (B-Global Donghua 1920x1080 HEVC AAC MKV)")
      .build(),
    {
      errors: [],
      tags: [
        { parser: "GJYParser", type: "team", value: "NC-Raws" },
        { parser: "GJYParser", type: "title", value: "龙蛇演义" },
        { parser: "GJYParser", type: "title", value: "Dragon's Disciple" },
        { parser: "GJYParser", type: "episode", value: "16" },
        { parser: "GJYParser", type: "source_team", value: "B-Global" },
        { parser: "GJYParser", type: "resolution", value: "1080p" },
        { parser: "GJYParser", type: "video_type", value: "h265" },
        { parser: "GJYParser", type: "audio_type", value: "aac" },
        { parser: "GJYParser", type: "file_type", value: "mkv" },
      ],
    },
  );
  t.deepEqual(
    t.context.parser.parse("[NC-Raws] 夜夜猫歌 / Yoru wa Neko to Issho 07 (B-Global 1920x1080 HEVC AAC MKV)").build(),
    {
      errors: [],
      tags: [
        { parser: "GJYParser", type: "team", value: "NC-Raws" },
        { parser: "GJYParser", type: "title", value: "夜夜猫歌" },
        { parser: "GJYParser", type: "title", value: "Yoru wa Neko to Issho" },
        { parser: "GJYParser", type: "episode", value: "07" },
        { parser: "GJYParser", type: "source_team", value: "B-Global" },
        { parser: "GJYParser", type: "resolution", value: "1080p" },
        { parser: "GJYParser", type: "video_type", value: "h265" },
        { parser: "GJYParser", type: "audio_type", value: "aac" },
        { parser: "GJYParser", type: "file_type", value: "mkv" },
      ],
    },
  );
  t.deepEqual(
    t.context.parser
      .parse(
        "[NC-Raws] 白沙的水族馆 / Shiroi Suna no Aquatope 24 [B-Global][WEB-DL][1080p][AVC AAC][Multiple Subtitle][MKV]",
      )
      .build(),
    {
      errors: [],
      tags: [
        { parser: "GJYParser", type: "team", value: "NC-Raws" },
        { parser: "GJYParser", type: "title", value: "白沙的水族馆" },
        { parser: "GJYParser", type: "title", value: "Shiroi Suna no Aquatope" },
        { parser: "GJYParser", type: "episode", value: "24" },
        { parser: "GJYParser", type: "source_team", value: "B-Global" },
        { parser: "GJYParser", type: "source_type", value: "Web-DL" },
        { parser: "GJYParser", type: "resolution", value: "1080p" },
        { parser: "GJYParser", type: "video_type", value: "h264" },
        { parser: "GJYParser", type: "audio_type", value: "aac" },
        { parser: "GJYParser", type: "file_type", value: "mkv" },
      ],
    },
  );
  t.deepEqual(t.context.parser.parse("【推しの子】 Opus.COLORs 色彩高校星 08 (Baha 1920x1080 AVC AAC MP4)").build(), {
    errors: [],
    tags: [
      { parser: "GJYParser", type: "team", value: "NC-Raws" },
      { parser: "GJYParser", type: "title", value: "Opus.COLORs 色彩高校星" },
      { parser: "GJYParser", type: "episode", value: "08" },
      { parser: "GJYParser", type: "source_team", value: "Baha" },
      { parser: "GJYParser", type: "resolution", value: "1080p" },
      { parser: "GJYParser", type: "video_type", value: "h264" },
      { parser: "GJYParser", type: "audio_type", value: "aac" },
      { parser: "GJYParser", type: "file_type", value: "mp4" },
    ],
  });
  t.deepEqual(
    t.context.parser
      .parse("[NC-Raws] 杜鵑婚約 / Kakkou no Iinazuke (A Couple of Cuckoos) 04 (Baha 1920x1080 AVC AAC MP4)")
      .build(),
    {
      errors: [],
      tags: [
        { parser: "GJYParser", type: "team", value: "NC-Raws" },
        { parser: "GJYParser", type: "title", value: "杜鵑婚約" },
        { parser: "GJYParser", type: "title", value: "Kakkou no Iinazuke (A Couple of Cuckoos)" },
        { parser: "GJYParser", type: "episode", value: "04" },
        { parser: "GJYParser", type: "source_team", value: "Baha" },
        { parser: "GJYParser", type: "resolution", value: "1080p" },
        { parser: "GJYParser", type: "video_type", value: "h264" },
        { parser: "GJYParser", type: "audio_type", value: "aac" },
        { parser: "GJYParser", type: "file_type", value: "mp4" },
      ],
    },
  );
});
