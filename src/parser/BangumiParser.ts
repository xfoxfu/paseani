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
