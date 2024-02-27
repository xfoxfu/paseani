import { Trie } from "../trie.js";
import { parseInfoboxAlias } from "./BangumiParser.js";
import { Parser, ResultBuilder, TagType } from "./index.js";
import { prefixdb } from "./prefixdb.js";
import { readFile } from "fs/promises";
import _ from "lodash";
import * as OpenCC from "opencc-js";

type TrieData = TagType | "drop";

export class PrefixMatchParser extends Parser {
  public readonly trie = new Trie<TrieData>();

  public override name = "PrefixMatchParser";
  public converter = OpenCC.Converter({ from: "t", to: "cn" });

  public override canParse(_name: string, builder: ResultBuilder): boolean {
    return builder.appliedParsers.length === 0 || builder.tags.filter((t) => t.type === TagType.title).length === 0;
  }

  public override rawParse(name_: string, builder: ResultBuilder): void {
    const name = this.normalizeName(name_);
    let i = 0;
    let last_is_error = false;
    while (i < name.length) {
      // forward pass
      let node: typeof this.trie | null = this.trie;
      let word = "";
      do {
        node = node.children.get(name[i]!) ?? null;
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
      // a tag should only be closed at "breaking" characters
      while (node.data !== "drop" && !name[i]?.match(/\p{P}|\s|★|\//u) && i < name.length) {
        word += name_[i];
        i += 1;
        node = this.trie;
      }
      // take some action
      if (node.data !== "drop") {
        if (!last_is_error) {
          const words = this.normalizeWithDb(word);
          if (Array.isArray(words)) {
            builder.addTags(node.data ?? TagType.unknown, ...words);
          } else {
            builder.addTag(node.data ?? TagType.unknown, words);
          }
        } else builder.tags[builder.tags.length - 1]!.value += word;
      }
      last_is_error = !node.data;
    }
    // reprocessing of errors
    const splitErrors = _.compact(
      builder.tags
        .filter((t) => t.parser === this.name && t.type === TagType.unknown)
        .map((e_): [TagType, string] | null => {
          const getType = () => {
            const e = this.normalizeName(e_.value);
            if (e.match(/^\d+$/)) return TagType.episode;
            if (e.match(/^\d+-\d+$/)) return TagType.episode;
            if (e.match(/^第\d+话$/)) return TagType.episode;
            if (e.match(/^\d+x\d+$/)) return TagType.resolution;
            if (e.match(/新番$/)) return "drop";
            return TagType.unknown;
          };
          const type = getType();
          return type !== "drop" ? [type as TagType, e_.value] : null;
        }),
    );

    _.remove(builder.tags, (t) => t.parser === this.name && t.type === TagType.unknown);
    for (const [type, value] of splitErrors) {
      builder.addTag(type, value);
    }
  }

  public override async init(): Promise<void> {
    this.loadBasicPrefix();
    await this.loadBangumiData();
    await this.loadAniDB();
    this.loadPrefixDB();
  }

  public normalizeName(name: string): string {
    return this.converter(name).toLowerCase();
  }

  public normalizeWithDb(name: string): string | string[] {
    const name_ = this.normalizeName(name);
    if (prefixdb[name_]) {
      const attempt = prefixdb[name_]![1];
      if (attempt.includes("|")) return attempt.split("|");
      return attempt;
    }
    return name;
  }

  public loadPrefix(name: string, tag: TrieData) {
    this.trie.addChild(this.normalizeName(name), tag);
  }

  private basicPrefix = " []/_-()【】★（）·◆☆\u{200B}&".split("");

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
      if (item.name) this.loadPrefix(item.name, TagType.title);
      if (item.name_cn) this.loadPrefix(item.name_cn, TagType.title);
      for (const alias of parseInfoboxAlias(item.infobox)) {
        this.loadPrefix(alias, TagType.title);
      }
    }
  }

  public async loadAniDB(): Promise<void> {
    const text = await readFile("data/anidb.dat");
    const lines = text.toString("utf8").split("\n");
    const items = lines.filter((l) => !!l && !l.startsWith("#"));
    for (const item of items) {
      // <aid>|<type>|<language>|<title>
      const [_type, title] = item.split("|") as [string, string, string, string];
      this.loadPrefix(title, TagType.title);
    }
  }

  public loadPrefixDB() {
    for (const [key, operation] of Object.entries(prefixdb)) {
      this.loadPrefix(key, operation![0]);
    }
  }
}
