import { testParser, testParserResult } from "../testutil.js";
import { NekomoeParser } from "./NekomoeParser.js";
import test_, { TestFn } from "ava";

const test = test_ as TestFn<{ parser: NekomoeParser }>;
test.before((t) => (t.context.parser = new NekomoeParser()));

testParser(NekomoeParser, [
  "【喵萌奶茶屋】★10月新番★[葬送的芙莉莲 / Sousou no Frieren][25][1080p][简日双语][招募翻译时轴]",
  "【喵萌奶茶屋】[不当哥哥了！ / Oniichan wa Oshimai! / Onimai][01-12][BDRip][1080p][简日双语][招募翻译]",
  "【喵萌奶茶屋】★04月新番★[本田小狼與我/超級小狼/スーパーカブ/Super Cub][07][720p][繁日雙語][招募翻譯校對]",
  "【喵萌奶茶屋】★1月新番★[粗點心戰爭 2/Dagashi Kashi 2][02][720P][繁日雙語][招募後期♥]",
  "【喵萌奶茶屋】★01月新番★[恋爱小行星/Koisuru Asteroid/Shouwakusei][01-12END][720p][简日双语][招募翻译]",
  "【喵萌奶茶屋】★04月新番★[Estab Life: Great Escape][06][720p][繁體][招募翻譯校對]",
  "【喵萌奶茶屋】★10月新番★[在魔王城说晚安/Maoujou de Oyasumi][04v2][1080p][简体][招募翻译]",
  "【喵萌奶茶屋】★04月新番★[BNA/ビー・エヌ・エー/Brand New Animal][08][720p][简体](检索用：全新动物/动物新世代)",
]);

testParser(
  NekomoeParser,
  [
    "【喵萌奶茶屋】★剧场版★[甲铁城的卡巴内瑞 海门决战/KABANERI OF THE IRON FORTRESS - THE BATTLE OF UNATO][BDRip][720p][简日双语]",
    "【喵萌奶茶屋】★劇場版★[龍與雀斑公主/Ryuu to Sobakasu no Hime][先行版][1080p][繁體][招募翻譯校對]",
    "【喵萌奶茶屋】[烟花/升空的焰火，从下面看？还是从侧面看？/Uchiage Hanabi Shita kara Miru ka? Yoko kara Miru ka?][BDRip 1080p HEVC_Ma10p_FLAC][简繁外挂][Fin]",
  ],
  false,
);

testParserResult(
  NekomoeParser,
  "【喵萌奶茶屋】剧场版★[于离别之朝束起约定之花/道别的早晨就用约定之花点缀吧/在离别的清晨装饰约定之花/Sayonara no Asa ni Yakusoku no Hana o Kazarou][HEVC_FLAC][1080p][简体]",
  [
    "喵萌奶茶屋",
    "于离别之朝束起约定之花",
    "道别的早晨就用约定之花点缀吧",
    "在离别的清晨装饰约定之花",
    "sayonara no asa ni yakusoku no hana o kazarou",
    "hevc",
    "flac",
    "1080p",
    "简体",
  ],
);
