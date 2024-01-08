import test_, { TestFn } from "ava";
import _ from "lodash";
import { BangumiParser, parseInfoboxAlias } from "./BangumiParser.js";
import { getEmptyResult } from "./index.js";

const test = test_ as TestFn<{ parser: BangumiParser }>;

test.before("prepare parser", async (t) => {
  t.context.parser = new BangumiParser();
  await t.context.parser.init();
});

test("parse alias in infobox", (t) => {
  const aliases = parseInfoboxAlias(
    "{{Infobox animanga/Manga\r\n|中文名= 我心里危险的东西\r\n|别名={\r\n[cn2|我心中的野兽]\r\n[tl|我內心的糟糕念頭]\r\n[en|The Dangers in My Heart.]\r\n}\r\n|作者= 桜井のりお\r\n|出版社= 秋田書店\r\n|价格= \r\n|其他出版社= \r\n|连载杂志= 週刊少年チャンピオン→チャンピオンクロス(→マンガクロス)\r\n|发售日= 2018-12-07\r\n|册数= \r\n|页数= \r\n|话数= \r\n|ISBN= \r\n|其他= \r\n|开始= 2018-03-08 (2018年15号/週チャン)\r\n}}"
  );
  t.deepEqual(aliases, ["我心中的野兽", "我內心的糟糕念頭", "The Dangers in My Heart."]);
  const aliases2 = parseInfoboxAlias(
    "{{Infobox animanga/TVAnime\r\n|中文名= 我心里危险的东西 第二季\r\n|别名={\r\n[我内心的糟糕念头 第二季]\r\n[我心中的野兽 第二季]\r\n[The Dangers in My Heart 2nd Season]\r\n[Boku no Kokoro no Yabai Yatsu 2nd Season]\r\n}\r\n|话数= *\r\n|放送开始= 2024年1月\r\n|放送星期= \r\n|官方网站= https://bokuyaba-anime.com/\r\n|播放电视台= テレビ朝日系\r\n|其他电视台= \r\n|播放结束= \r\n|其他= \r\n|Copyright= ©桜井のりお（秋田書店）／僕ヤバ製作委員会\r\n|原作= 桜井のりお（秋田書店「マンガクロス」連載）\r\n}}"
  );
  t.deepEqual(aliases2, [
    "我内心的糟糕念头 第二季",
    "我心中的野兽 第二季",
    "The Dangers in My Heart 2nd Season",
    "Boku no Kokoro no Yabai Yatsu 2nd Season",
  ]);
});

test("add link to bangumi", async (t) => {
  const validate = (title: string, link: string) =>
    t.deepEqual(_.uniq(t.context.parser.parse("foobar", { ...getEmptyResult(), title: [title] }).link), [link]);

  t.deepEqual(t.context.parser.canParse("foobar"), true);
  validate("絆のアリル セカンドシーズン", "https://bgm.tv/subject/443147");
  validate("绊之Allele 第二季", "https://bgm.tv/subject/443147");
  validate("Kizuna no Allele 2nd Season", "https://bgm.tv/subject/443147");
});
