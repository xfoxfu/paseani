import { GlobalDatabase } from "../database/index.js";
import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class PrefixMatchParser extends Parser {
  public override name = "PrefixMatchParser";

  public override canParse(_name: string, builder: ResultBuilder): boolean {
    return builder.appliedParsers.length === 0 || builder.tags.filter((t) => t.type === TagType.title).length === 0;
  }

  protected static readonly regex = [/^\d+$/, /^\d+-\d+$/, /^第\d+话$/, /^\d+x\d+$/, /新番$/];

  public override rawParse(name_: string, builder: ResultBuilder): void {
    const name = GlobalDatabase.normalizeName(name_);
    let i = 0;
    while (i < name.length) {
      // forward pass
      let node: typeof GlobalDatabase.trie | null = GlobalDatabase.trie;
      let word = "";
      do {
        node = node.children.get(name[i]!) ?? null;
        word += name_[i];
        i += 1;
      } while (node?.children.has(name[i]!));
      if (!node) node = GlobalDatabase.trie;
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
      if (revert.node !== GlobalDatabase.trie) {
        // revert succeeded, do revert
        node = revert.node;
        word = revert.word;
        i = revert.i;
      }
      // a tag should only be closed at "breaking" characters
      while (
        i < name.length &&
        GlobalDatabase.hasNoDrop(node) &&
        (!name[i]?.match(/\p{P}|\s|★|\//u) ||
          // and do not break a `00-99` eposide pattern
          (["-", "x"].includes(name[i] ?? "") && word.match(/^\d+$/)))
      ) {
        word += name_[i];
        i += 1;
        node = GlobalDatabase.trie;
      }
      // take some action
      if (GlobalDatabase.hasNoDrop(node)) {
        for (const tag of node.data ?? [{ type: TagType.unknown }]) {
          builder.addTag(tag.type, word);
        }
      }
    }
    // reprocessing of errors
    for (const tag of builder.tags) {
      if (tag.parser !== this.name) continue;
      if (tag.type !== TagType.unknown) continue;

      const type = (() => {
        const e = GlobalDatabase.normalizeName(tag.value);
        if (e.match(/^\d+$/)) return TagType.episode;
        if (e.match(/^\d+-\d+$/)) return TagType.episode;
        if (e.match(/^第\d+话$/)) return TagType.episode;
        if (e.match(/^\d+x\d+$/)) return TagType.resolution;
        if (e.match(/新番$/)) return null;
        return TagType.unknown;
      })();
      if (type !== null) tag.type = type;
      else tag.value = "";
    }
    _.remove(builder.tags, (t) => t.parser === this.name && t.value.length === 0);
  }
}
