import { LoliHouseParser } from "./LoliHouseParser.js";
import { ResultBuilder, TagType } from "./index.js";
import test from "ava";

test("can parser LoliHouse", (t) => {
  const titles = [
    "[LoliHouse] 魔都精兵的奴隶 / Mato Seihei no Slave - 06 [WebRip 1080p HEVC-10bit AAC][繁體内封字幕]",
    "[星空字幕组&LoliHouse] 勇气爆发 BANG BRAVERN / Yuuki Bakuhatsu BANG BRAVERN - 08 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]",
    "[LoliHouse] Love Live! 虹咲学园学园偶像同好会 NEXT SKY / Love Live! Nijigasaki NEXT SKY [BDRip 1080p HEVC-10bit FLAC]",
    "[UHA-WINGS&LoliHouse] 孤独摇滚！纽带乐队LIVE -恒星- / 結束バンドLIVE -恒星- / Kessoku Band LIVE -Kousei- [BDRip 1080p HEVC-10bit FLAC][简繁内封字幕]",
    "[悠哈璃羽字幕社&LoliHouse] 虹咲四格 / Nijiyon Animation - 15 [BDRip 1080p HEVC-10bit FLAC][简繁内封字幕][End]",
    "[LoliHouse] 龙王的工作!/Ryuuou no Oshigoto! - 11 [WebRip 1920x1080 HEVC-10bit AAC]( Loli High ! )",
    "[SweetSub&LoliHouse] 手工少女!! / Do It Yourself!! - 11 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]（检索用：DIY）",
    "[豌豆字幕组&风之圣殿字幕组&LoliHouse] 咒术回战 0 / Jujutsu Kaisen 0 [BDRip 1080p HEVC-10bit FLAC][简繁外挂字幕]v2",
    "[LoliHouse] 世界顶尖的暗杀者转生为异世界贵族 / Sekai Saikou no Ansatsusha - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕] v2",
  ];
  const parser = new LoliHouseParser();
  for (const title of titles) {
    t.true(parser.canParse(title, new ResultBuilder()));
    const result = parser.parse(title, new ResultBuilder()).build();
    t.true(result.errors.length === 0, `${title} ${result.errors.map((e) => e.message).join(",")}`);
  }

  t.deepEqual(
    parser
      .parse(
        "[SweetSub&LoliHouse] 手工少女!! / Do It Yourself!! - 07v2 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]（检索用：DIY）",
      )
      .build()
      .tags.find((t) => t.type === TagType.episode)?.value,
    "07",
  );
});
