import { readFile } from "fs/promises";
import _ from "lodash";
import { Parser, Result } from "./index.js";

export class AniDBParser extends Parser {
  public mapToId: Map<string, number> = new Map();
  public mapToSyms: Map<number, string[]> = new Map();

  public override name = "AniDBParser";

  public override canParse(_name: string): boolean {
    return true;
  }

  public override parse(_name: string, previous: Result): Result {
    const titles = _.clone(previous.title);
    for (const title of titles) {
      const id = this.mapToId.get(title);
      if (id) previous.title.push(...(this.mapToSyms.get(id) ?? []));
    }
    return previous;
  }

  public override async init(): Promise<void> {
    const text = await readFile("anidb.dat");
    const lines = text.toString("utf8").split("\n");
    const items = lines.filter((l) => !!l && !l.startsWith("#"));
    for (const item of items) {
      // <aid>|<type>|<language>|<title>
      const [aid, type, lang, title] = item.split("|") as [string, string, string, string];
      const aid_ = Number.parseInt(aid, 10);
      this.mapToId.set(title, aid_);
      if (!this.mapToSyms.has(aid_)) this.mapToSyms.set(aid_, []);
      if (["x-jat", "ja"].includes(lang)) {
        this.mapToSyms.get(aid_)?.push(title);
      }
    }
  }
}
