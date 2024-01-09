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
    const name = this.converter(name_).toLowerCase();
    let i = 0;
    let last_is_error = false;
    while (i < name.length) {
      // forward pass
      let node = this.trie;
      let word = "";
      do {
        node = node.children.get(name[i]!)!;
        word += name_[i];
        i += 1;
      } while (node?.children.has(name[i]!));
      if (!node) node = this.trie;
      // here we reach some point the current node is valid but cannot go to a child
      // backward pass
      // go to some point which is associated with an action
      const revert = { node, word, i };
      while (!revert.node.data) {
        if (!revert.node.parent) break;
        revert.node = revert.node.parent;
        revert.i -= 1;
        revert.word = revert.word.substring(0, revert.word.length - 1);
      }
      if (revert.node !== this.trie) {
        // revert succeeded, do revert
        node = revert.node;
        word = revert.word;
        i = revert.i;
      }
      // take some action
      if (node.data !== "drop") {
        if (!last_is_error) previous[node.data ?? "errors"].push(word);
        else previous.errors[previous.errors.length - 1] += word;
      }
      last_is_error = !node.data;
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
