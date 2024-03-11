import { testParserResult } from "../testutil.js";
import { LilithOrAniParser } from "./LilithOrAniParser.js";

testParserResult(
  LilithOrAniParser,
  "[Lilith-Raws] 神推偶像登上武道館我就死而無憾 / Oshibudo - 08 [Baha][WEB-DL][1080p][AVC AAC][CHT][MKV]",
  [
    "Lilith-Raws",
    "神推偶像登上武道館我就死而無憾",
    "Oshibudo",
    "08",
    "Baha",
    "WEB-DL",
    "1080p",
    "AVC",
    "AAC",
    "CHT",
    "MKV",
  ],
);

testParserResult(
  LilithOrAniParser,
  "[ANi] BUILDDIVIDE - BUILD-DIVIDE -#FFFFFF- CODE WHITE[14][1080P][Baha][WEB-DL][AAC AVC][MP4]",
  ["ANi", "BUILDDIVIDE - BUILD-DIVIDE -#FFFFFF- CODE WHITE", "14", "1080P", "Baha", "WEB-DL", "AAC", "AVC", "MP4"],
);

testParserResult(
  LilithOrAniParser,
  "[ANi]  打工吧，魔王大人！第二季 [特別篇] - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]",
  ["ANi", "打工吧，魔王大人！第二季 [特別篇]", "01", "1080P", "Baha", "WEB-DL", "AAC", "AVC", "CHT", "MP4"],
);

testParserResult(
  LilithOrAniParser,
  "[ANi]Healer Girls 歌愈少女（僅限港澳臺地區）[01][1080P][Bilibili][WEB-DL][AAC AVC]",
  ["ANi", "Healer Girls 歌愈少女（僅限港澳臺地區）", "01", "1080P", "Bilibili", "WEB-DL", "AAC", "AVC"],
);
