import { testParser, testParserResult } from "../testutil.js";
import { LoliHouseBParser } from "./LoliHouseBParser.js";
import { TagType } from "./index.js";

testParser(LoliHouseBParser, [
  "[SweetSub&LoliHouse][轻拍翻转小魔女][Flip Flappers][11][WebRip 1920x1080 HEVC AAC][简繁外挂字幕]",
  "[LoliHouse][乌菈菈迷路帖][Urara Meirochou][01][TVrip 1920x1080 HEVC AAC]【内附公告】",
  "[LoliHouse][政宗君的复仇][Masamune-kun no Revenge][01-12合集][WebRip 1920x1080 HEVC AAC][Fin]（度盘内附字幕）",
]);

testParser(
  LoliHouseBParser,
  ["[LoliHouse][避难所][Shelter][AnimeMV+制作访谈][WebRip 1920x1080 HEVC AAC][中英双语字幕][外挂字幕]"],
  false,
);

testParserResult(
  LoliHouseBParser,
  "[LoliHouse][政宗君的复仇][Masamune-kun no Revenge][01-12合集][WebRip 1920x1080 HEVC AAC][Fin]（度盘内附字幕）",
  ["01-12"],
  TagType.episode,
);
