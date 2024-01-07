import { readFile } from "fs/promises";
import _ from "lodash";
import * as OpenCC from "opencc-js";
import { Parser, Result } from "./index.js";

export class BangumiParser extends Parser {
  public map: Map<string, number> = new Map();
  public converter = OpenCC.Converter({ from: "t", to: "cn" });

  public override name = "BangumiParser";

  public override canParse(_name: string): boolean {
    return true;
  }

  public override parse(_name: string, previous: Result): Result {
    for (const title of previous.title) {
      const sid = this.map.get(title);
      if (sid) previous.link.push("https://bgm.tv/subject/" + sid);
      const sid2 = this.map.get(this.converter(title));
      if (sid2) previous.link.push("https://bgm.tv/subject/" + sid2);
    }
    return previous;
  }

  public override async init(): Promise<void> {
    const text = await readFile("bangumi/subject.jsonlines");
    const lines = text.toString("utf8").split("\n");
    const items = lines
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter((l) => !!l);
    // {"id":1,"type":1,"name":"第一次的親密接觸","name_cn":"第一次的亲密接触","infobox":"{{Infobox animanga/Novel\r\n|中文名= 第一次的亲密接触\r\n|别名={\r\n}\r\n|出版社= 紅色文化、知识出版社\r\n|价格= NT$160\r\n|连载杂志= \r\n|发售日= 1998-09-25\r\n|册数= \r\n|页数= 188\r\n|话数= \r\n|ISBN= 9577086705\r\n|其他= \r\n|作者= 蔡智恒\r\n}}","platform":1002,"summary":"　　風靡華人世界的網戀小說經典，暢銷紀錄超過百萬冊！\r\n　　有最初的《第一次的親密接觸》，才有今日網路文學。\r\n　　蔡智恆的最新作品《暖暖》，提升你的戀愛幸福溫度。\r\n　　紀念版收錄蔡智恆醞釀十年，最溫柔的純愛萬語宣言。\r\n　　PH值小於7的微酸心情，讓十年後的痞子蔡告訴你。\r\n　　一場最美麗的網路解逅，當痞子蔡遇見輕舞飛揚……\r\n　　蔡智恆最真實的情感原點\r\n　　痞子蔡與輕舞飛揚一起記錄的甜蜜日子\r\n　　一則發生在成大校園的純愛故事，網路上一再被轉載的熱門小說。","nsfw":false,"tags":[{"name":"痞子蔡","count":21},{"name":"蔡智恒","count":11},{"name":"小说","count":10},{"name":"爱情","count":10},{"name":"轻舞飞扬","count":10},{"name":"台湾","count":8},{"name":"经典","count":6},{"name":"三次元","count":5},{"name":"国产","count":4},{"name":"网络小说","count":3},{"name":"网文","count":3}],"score":7.7,"score_details":{"1":1,"2":0,"3":1,"4":0,"5":0,"6":9,"7":16,"8":35,"9":11,"10":5},"rank":1724}
    for (const item of items) {
      if (item.type !== 2) continue;
      if (item.name) this.map.set(item.name, item.id);
      if (item.name_cn) this.map.set(item.name_cn, item.id);
      const infobox = item.infobox.replaceAll(/\s\s+/g, "");
      const aliasRegex = / ?别名 ?= ?{ ?(?<alias>(\[(\w+\|)?.+\])+) ?}/;
      const aliasMatch = aliasRegex.exec(infobox);
      const aliasText = aliasMatch?.groups?.["alias"];
      if (aliasText) {
        const aliases = aliasText.split("][").map((a) => _.trim(a, "[]"));
        for (const alias of aliases) {
          this.map.set(alias, item.id);
        }
      }
    }
  }
}
