import { testParserResult } from "../testutil.js";
import { GJYParser } from "./GJYParser.js";

testParserResult(GJYParser, "[NC-Raws] 龙蛇演义 / Dragon's Disciple 16 (B-Global Donghua 1920x1080 HEVC AAC MKV)", [
  "NC-Raws",
  "龙蛇演义",
  "Dragon's Disciple",
  "16",
  "B-Global",
  "1920x1080",
  "HEVC",
  "AAC",
  "MKV",
]);

testParserResult(GJYParser, "[NC-Raws] 夜夜猫歌 / Yoru wa Neko to Issho 07 (B-Global 1920x1080 HEVC AAC MKV)", [
  "NC-Raws",
  "夜夜猫歌",
  "Yoru wa Neko to Issho",
  "07",
  "B-Global",
  "1920x1080",
  "HEVC",
  "AAC",
  "MKV",
]);

testParserResult(
  GJYParser,
  "[NC-Raws] 白沙的水族馆 / Shiroi Suna no Aquatope 24 [B-Global][WEB-DL][1080p][AVC AAC][Multiple Subtitle][MKV]",
  ["NC-Raws", "白沙的水族馆", "Shiroi Suna no Aquatope", "24", "B-Global", "WEB-DL", "1080p", "AVC", "AAC", "MKV"],
);

testParserResult(GJYParser, "【推しの子】 Opus.COLORs 色彩高校星 08 (Baha 1920x1080 AVC AAC MP4)", [
  "NC-Raws",
  "Opus.COLORs 色彩高校星",
  "08",
  "Baha",
  "1920x1080",
  "AVC",
  "AAC",
  "MP4",
]);

testParserResult(
  GJYParser,
  "[NC-Raws] 杜鵑婚約 / Kakkou no Iinazuke (A Couple of Cuckoos) 04 (Baha 1920x1080 AVC AAC MP4)",
  ["NC-Raws", "杜鵑婚約", "Kakkou no Iinazuke (A Couple of Cuckoos)", "04", "Baha", "1920x1080", "AVC", "AAC", "MP4"],
);
testParserResult(
  GJYParser,
  "[NC-Raws] 勇者鬥惡龍 達伊的大冒險 / Dragon Quest - Dai no Daibouken - 01 [Baha][WEB-DL][1080p][AVC AAC][CHT][MP4].mp4",
  [
    "NC-Raws",
    "勇者鬥惡龍 達伊的大冒險",
    "Dragon Quest - Dai no Daibouken",
    "01",
    "Baha",
    "WEB-DL",
    "1080p",
    "AVC",
    "AAC",
    "CHT",
    "MP4",
  ],
);
