import { LoliHouseBParser } from "./LoliHouseBParser.js";
import { ResultBuilder, TagType, simpleParse } from "./index.js";
import test from "ava";

test("can parser LoliHouse", (t) => {
  const titles = [
    "[SweetSub&LoliHouse][轻拍翻转小魔女][Flip Flappers][11][WebRip 1920x1080 HEVC AAC][简繁外挂字幕]",
    "[LoliHouse][乌菈菈迷路帖][Urara Meirochou][01][TVrip 1920x1080 HEVC AAC]【内附公告】",
    "[LoliHouse][避难所][Shelter][AnimeMV+制作访谈][WebRip 1920x1080 HEVC AAC][中英双语字幕][外挂字幕]",
    "[LoliHouse][政宗君的复仇][Masamune-kun no Revenge][01-12合集][WebRip 1920x1080 HEVC AAC][Fin]（度盘内附字幕）",
  ];
  const parser = new LoliHouseBParser();
  for (const title of titles) {
    t.true(parser.canParse(title, new ResultBuilder()));
    const result = parser.parse(title, new ResultBuilder()).build();
    t.true(result.errors.length === 0, `${title} ${result.errors.map((e) => e.message).join(",")}`);
  }

  t.deepEqual(
    simpleParse(
      parser,
      "[LoliHouse][政宗君的复仇][Masamune-kun no Revenge][01-12合集][WebRip 1920x1080 HEVC AAC][Fin]（度盘内附字幕）",
      TagType.episode,
    ),
    ["01-12"],
  );
});
