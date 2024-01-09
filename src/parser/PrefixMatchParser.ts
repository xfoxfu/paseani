import { Trie } from "../trie.js";
import { parseInfoboxAlias } from "./BangumiParser.js";
import { Parser, Result } from "./index.js";
import { readFile } from "fs/promises";
import * as OpenCC from "opencc-js";

type TrieData = keyof Result | "drop";

export class PrefixMatchParser extends Parser {
  public readonly trie = new Trie<TrieData>();

  public override name = "PrefixMatchParser";
  public converter = OpenCC.Converter({ from: "t", to: "cn" });

  public unknownTags: string[] = [];

  public override canParse(_name: string): boolean {
    return true;
  }

  public override parse(name_: string, previous: Result): Result {
    const name = this.converter(name_).toLowerCase() + " ";
    let node = this.trie.children.get(name[0]!);
    let i = 0;
    let accumulated = "";
    let last_emit_error = false;
    while (i + 1 < name.length) {
      accumulated += name_[i];
      i += 1;

      const next = node?.children.get(name[i]!);
      if (next && node?.data !== "drop" && !last_emit_error) {
        node = next;
      } else {
        if (!node?.data || (last_emit_error && node.data !== "drop")) {
          if (last_emit_error) previous.errors[previous.errors.length - 1] += accumulated;
          else previous.errors.push(accumulated);
          last_emit_error = true;
        } else {
          if (node.data !== "drop") previous[node?.data].push(accumulated);
          last_emit_error = false;
        }
        accumulated = "";
        node = this.trie.children.get(name[i]!);
      }
    }
    this.unknownTags.push(...previous.errors);
    return previous;
  }

  public loadPrefix(name: string, tag: TrieData) {
    this.trie.addChild(this.converter(name).toLowerCase(), tag);
  }

  private basicPrefix = " []/_-()【】★（）".split("");

  public loadBasicPrefix() {
    for (const p of this.basicPrefix) {
      this.trie.addChild(p, "drop");
    }
  }

  public async loadBangumiData(): Promise<void> {
    const text = await readFile("data/bangumi/subject.jsonlines");
    const lines = text.toString("utf8").split("\n");
    const items = lines
      .map((l) => {
        try {
          return JSON.parse(l) as { id: number; type: number; name: string; name_cn: string; infobox: string };
        } catch {
          return null;
        }
      })
      .filter((l): l is NonNullable<typeof l> => !!l);

    for (const item of items) {
      if (item.type !== 2) continue;
      if (item.name) this.loadPrefix(item.name, "title");
      if (item.name_cn) this.loadPrefix(item.name_cn, "title");
      for (const alias of parseInfoboxAlias(item.infobox)) {
        this.loadPrefix(alias, "title");
      }
    }
  }
}
