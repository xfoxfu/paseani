import { parseInfoboxAlias } from "./BangumiDatabase.js";
import test from "ava";

test("parse alias in infobox", (t) => {
  const aliases = parseInfoboxAlias(
    "{{Infobox animanga/Manga\r\n|中文名= 我心里危险的东西\r\n|别名={\r\n[cn2|我心中的野兽]\r\n[tl|我內心的糟糕念頭]\r\n[en|The Dangers in My Heart.]\r\n}\r\n|作者= 桜井のりお\r\n|出版社= 秋田書店\r\n|价格= \r\n|其他出版社= \r\n|连载杂志= 週刊少年チャンピオン→チャンピオンクロス(→マンガクロス)\r\n|发售日= 2018-12-07\r\n|册数= \r\n|页数= \r\n|话数= \r\n|ISBN= \r\n|其他= \r\n|开始= 2018-03-08 (2018年15号/週チャン)\r\n}}",
  );
  t.deepEqual(aliases, ["我心中的野兽", "我內心的糟糕念頭", "The Dangers in My Heart."]);
  const aliases2 = parseInfoboxAlias(
    "{{Infobox animanga/TVAnime\r\n|中文名= 我心里危险的东西 第二季\r\n|别名={\r\n[我内心的糟糕念头 第二季]\r\n[我心中的野兽 第二季]\r\n[The Dangers in My Heart 2nd Season]\r\n[Boku no Kokoro no Yabai Yatsu 2nd Season]\r\n}\r\n|话数= *\r\n|放送开始= 2024年1月\r\n|放送星期= \r\n|官方网站= https://bokuyaba-anime.com/\r\n|播放电视台= テレビ朝日系\r\n|其他电视台= \r\n|播放结束= \r\n|其他= \r\n|Copyright= ©桜井のりお（秋田書店）／僕ヤバ製作委員会\r\n|原作= 桜井のりお（秋田書店「マンガクロス」連載）\r\n}}",
  );
  t.deepEqual(aliases2, [
    "我内心的糟糕念头 第二季",
    "我心中的野兽 第二季",
    "The Dangers in My Heart 2nd Season",
    "Boku no Kokoro no Yabai Yatsu 2nd Season",
  ]);
  const aliases3 = parseInfoboxAlias(
    "{{Infobox animanga/Anime\r\n|中文名= \r\n|别名={\r\n[台版|沙盒1]\r\n[日版|沙盒2]\r\n[沙盒0|沙盒3]\r\n}\r\n|上映年度= *\r\n|片长= \r\n|官方网站= \r\n|其他= \r\n|Copyright= \r\n|话数= 7\r\n|放送开始= 1960年\r\n|放送星期= 星期日\r\n|平台={\r\n[龟壳]\r\n[Xbox Series S]\r\n[Xbox Series X]\r\n[Xbox Series X/S]\r\n[PC]\r\n[Xbox Series X|S]\r\n}\r\n|其他别名=沙\r\n}}",
  );
  t.deepEqual(aliases3, ["沙盒1", "沙盒2", "沙盒3"]);
});
