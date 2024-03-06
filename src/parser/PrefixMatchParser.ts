import { GlobalDatabase } from "../database/index.js";
import { splitAt } from "../util.js";
import { Parser, ResultBuilder, TagType } from "./index.js";
import assert from "assert";
import _ from "lodash";

export class PrefixMatchParser extends Parser {
  public override name = "PrefixMatchParser";

  public override canParse(_name: string, builder: ResultBuilder): boolean {
    return builder.appliedParsers.length === 0 || builder.tags.filter((t) => t.type === TagType.title).length === 0;
  }

  protected static readonly prefixRegex: [RegExp, TagType][] = [
    [/^\d+/, TagType.episode],
    [/^\d+-\d+/, TagType.episode],
    [/^第\d+(话|集)/, TagType.episode],
    [/^\d+x\d+/, TagType.resolution],
    [/^(\d+年)?\d+月新番/, TagType.unknown],
  ];
  protected static readonly breakingRegex = /\p{P}|\s|★|\//u;

  public override rawParse(name_: string, builder: ResultBuilder): void {
    const name = GlobalDatabase.normalizeName(name_);
    let rest = name;
    let rest_ = name_;
    while (rest !== "") {
      const [ppos, node] = GlobalDatabase.trie.getFurthestWithData(rest);
      let [pos, data] = [ppos, node?.data?.map((d) => d.type)];
      // try regex matching
      if (data === undefined) {
        assert(pos === 0);
        const [altPos, altType] = _.first(
          _.sortBy(
            PrefixMatchParser.prefixRegex
              .map(([r, type]): [number, TagType] => [r.exec(rest)?.[0].length ?? 0, type])
              .filter(([p, _t]) => p > 0),
            (v) => -v[0],
          ),
        ) ?? [0, TagType.unknown];
        if (altPos > 0) {
          pos = altPos;
          data = [altType];
        }
      }
      const bmatch = PrefixMatchParser.breakingRegex.exec(rest);
      const bleft = bmatch?.index ?? rest.length;
      // extend to breaking character
      if (bleft > pos && data !== undefined) {
        pos = bleft;
        data = [TagType.unknown];
      }
      // last resort of mark unknown
      if (pos === 0 || data === undefined) {
        pos = bleft;
        if (pos === 0) pos += bmatch?.[0].length ?? 1;
        data = [TagType.unknown];
      }
      assert(pos > 0);
      const [, next] = splitAt(rest, pos);
      const [cur_, next_] = splitAt(rest_, pos);
      // take some action
      assert(cur_.length > 0);
      for (const tag of data) {
        builder.addTag(tag, cur_);
      }
      rest = next;
      rest_ = next_;
    }
  }
}
