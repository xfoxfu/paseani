import { BangumiParser, parseInfoboxAlias } from "./BangumiParser.js";
import { getEmptyResult } from "./index.js";
import test_, { TestFn } from "ava";
import { access, mkdir, writeFile } from "fs/promises";
import _ from "lodash";

const test = test_ as TestFn<{ parser: BangumiParser }>;

test.before("prepare parser", async (t) => {
  try {
    await mkdir("data/bangumi", { recursive: true });
  } catch {
    /* ignore */
  }
  t.context.parser = new BangumiParser("data/bangumi/subject-test.jsonlines");
  try {
    await access(t.context.parser.dataPath);
  } catch {
    await writeFile(
      t.context.parser.dataPath,
      `
{"id":443146,"type":1,"name":"デキる猫は今日も憂鬱 (8)","name_cn":"","infobox":"{{Infobox animanga/Manga\\r\\n|中文名= \\r\\n|别名={\\r\\n}\\r\\n|作者= 山田ヒツジ\\r\\n|出版社= 講談社\\r\\n|价格= ￥1,045\\r\\n|其他出版社= \\r\\n|连载杂志= \\r\\n|发售日= 2023-08-08\\r\\n|册数= \\r\\n|页数= 128\\r\\n|话数= \\r\\n|ISBN= 978-4065325285\\r\\n|其他= \\r\\n}}","platform":1001,"summary":"仕事以外の生活能力が壊滅的な28歳のOL福澤幸来《サク》と、仔猫の頃に凍死寸前のところを彼女に拾われた家事万能(!)の大きめの猫の諭吉(ゆきち)の思いっきり幸せな一人と一匹暮らしを描く日常4コマ\u0026ショートコメディー。月刊少年シリウス、ニコニコ漫画、マガポケ、Palcy、コミックDAYS、pixivコミックで大好評連載中! TVアニメも2023年7がつより放送開始!!\\r\\n憩いの我が家に闖入者!って、お父さんとお母さん!? 父親は将棋の講師のために上京、母親は諭吉に会いたくてついてきたのだという。突然の両親の来訪と滞在に、幸来は振り回されっぱなし。いつもよりにぎやかな福澤家のドタバタの中で、微妙な距離感があった幸来と母親との関係を修復するのは、やはり諭吉なのでした! 恒例の単行本描きおろしエピソードも収録いたします。","nsfw":false,"tags":[],"score":0,"score_details":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0},"rank":0}
{"id":443147,"type":2,"name":"絆のアリル セカンドシーズン","name_cn":"绊之Allele 第二季","infobox":"{{Infobox animanga/TVAnime\\r\\n|中文名= 绊之Allele 第二季\\r\\n|别名={\\r\\n[Kizuna no Allele Season 2]\\r\\n[Kizuna no Allele 2nd Season]\\r\\n}\\r\\n|话数= 12\\r\\n|放送开始= 2023年10月4日\\r\\n|放送星期= 星期三\\r\\n|官方网站= https://kizunanoallele.com/\\r\\n|播放电视台= テレビ東京\\r\\n|其他电视台= テレビ大阪 / テレビ愛知 / アニマックス\\r\\n|播放结束= \\r\\n|其他= \\r\\n|Copyright= ©KA/絆のアリルPJ ©絆のアリル製作委員会\\r\\n|导演= 駒屋健一郎\\r\\n|人物设定= 朝香栞、森田二惟奈\\r\\n|人物原案= 森倉円、Asuna\\r\\n|动画制作= WIT STUDIO×SIGNAL.MD\\r\\n|製作= 絆のアリル製作委員会（小学館集英社プロダクション、テレビ東京、网易游戏、キズナアイ、アニマックスブロードキャスト・ジャパン、BANDAI SPIRITS、ムービック、Production I.G、NTTぷらら、小学館ミュージック\u0026amp;デジタルエンタテイメント、レッグス）\\r\\n|主题歌演出= PathTLive（OP） / #kzn（ED）\\r\\n|企画= 藤田亮、丸茂礼、葛仰骞、新井拓郎、佐々木朗、大矢陽久、髙橋竜、和田丈嗣、小林智、久保雅一、西島賢；企画协力：伊藤香織、勝谷潤一、並木智誠、菊池宣広、今川寛隆、坂本優香子、杉本壮太郎、佐藤功、長谷川嘉範、小笠原由記\\r\\n|制片人= 中島直人、村松紗也子、吳倩莹、新井拓郎\\r\\n|计划管理= 中村英祥\\r\\n|联合制片人= 川瀬好一、長谷川友紀\\r\\n|副制片人= 大場幸、鈴木里奈、坪井信人、駱玉清、吉田奏介、成毛克憲、喜多菜月、吉崎邦法、岩崎沙耶花、外川明宏、伊藤整、高橋亮、連景伊、大隅啓良、田端良平、山口冬馬\\r\\n|动画制片人= 大谷丞、吉信慶太、千野孝敏\\r\\n}}","platform":1,"summary":"セカンドシーズン、開幕！！\\r\\nPathTLive全員でバーチャルグリッドアワードADENシード本選に進むことができたミラク達。\\r\\nしかし、喜ぶのも束の間、早速次の試練が彼女たちに降りかかる\\r\\n学園から提示された次なる課題はユニットバトル！!\\r\\nPathTLiveの絆にも亀裂が？！\\r\\n新たな強敵ライバル達との出会い\\r\\n仲間との別れ\\r\\n揺れ動くミラク達の友情\\r\\nこの試練はミラク達に何をもたらすのか。\\r\\nPathTLiveの運命は—————？！","nsfw":false,"tags":[{"name":"2023年10月","count":13},{"name":"2023","count":12},{"name":"TV","count":9},{"name":"WITSTUDIO","count":9},{"name":"原创","count":7},{"name":"SIGNAL.MD","count":4},{"name":"TVA","count":4},{"name":"续集","count":4},{"name":"三重野瞳","count":3},{"name":"日原あゆみ","count":2},{"name":"表","count":2}],"score":4.6,"score_details":{"1":7,"2":2,"3":4,"4":4,"5":6,"6":3,"7":2,"8":2,"9":1,"10":3},"rank":0}
{"id":443148,"type":3,"name":"No Frontier","name_cn":"","infobox":"{{Infobox Album\\r\\n|中文名= \\r\\n|别名={\\r\\n[Aile The Shota 4th Digital Single]\\r\\n[TVアニメ「AIの遺電子」オープニングテーマ]\\r\\n}\\r\\n|版本特性= Single, Digital\\r\\n|发售日期= 2023-07-05\\r\\n|价格= ￥261\\r\\n|播放时长= 03:06\\r\\n|录音= \\r\\n|碟片数量= \\r\\n|艺术家= Aile The Shota\\r\\n|插图= 山田胡瓜\\r\\n|厂牌= Virgin Music Label And Artist Services\\r\\n|作词= Aile The Shota\\r\\n|作曲= Ryosuke ”Dr.R” Sakai、Aile The Shota\\r\\n|编曲= Ryosuke ”Dr.R” Sakai\\r\\n}}","platform":0,"summary":"テレビアニメ「AIの遺電子」オープニングテーマに決定している Aile The Shota「No Frontier」7月5日リリース決定\\r\\n\\r\\n今作は、Ryosuke “Dr.R” Sakaiのエレクトロニックなエフェクトが鳴り響くエクスペリメンタルなトラック、\\r\\n原作からインスパイアを受け描き上げた、不完全な未来に向かう心情と現在を生きる愛情を表現したリリック、\\r\\n唯一無二のフロウで語りかけるような歌、の3要素が化学変化して産み落とされた珠玉の1曲。","nsfw":false,"tags":[{"name":"OP","count":3},{"name":"2023","count":2},{"name":"ai电子基因","count":2}],"score":5.8,"score_details":{"1":0,"2":0,"3":1,"4":1,"5":2,"6":1,"7":1,"8":2,"9":0,"10":0},"rank":0}
`,
    );
  }
  await t.context.parser.init();
});

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
});

test("add link to bangumi", async (t) => {
  const validate = (title: string, link: string) =>
    t.deepEqual(_.uniq(t.context.parser.parse("foobar", { ...getEmptyResult(), title: [title] }).link), [link]);

  t.deepEqual(t.context.parser.canParse("foobar"), true);
  validate("絆のアリル セカンドシーズン", "https://bgm.tv/subject/443147");
  validate("绊之Allele 第二季", "https://bgm.tv/subject/443147");
  validate("Kizuna no Allele 2nd Season", "https://bgm.tv/subject/443147");
});
