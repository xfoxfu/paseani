import { GlobalDatabase } from "../database/index.js";
import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class TagNormalizer extends Parser {
  public override name = "TagNormalizer";

  public override canParse(_name: string, _builder: ResultBuilder): boolean {
    return true;
  }

  protected static readonly normRegex: [RegExp, TagType | null][] = [
    [/^(\d+)$/, TagType.episode],
    [/^(\d+-\d+)$/, TagType.episode],
    [/^第(\d+(-\d+)?)(话|集)$/, TagType.episode],
    [/^(\d+x\d+)$/, TagType.resolution],
    [/^(\d+年)?\d+月新?番$/, null],
  ];

  public override rawParse(_name: string, builder: ResultBuilder): void {
    const originalTags = _.cloneDeep(builder.tags);
    _.remove(builder.tags);
    for (const tag of originalTags) {
      const operation = ((): [TagType, string[]] => {
        for (const [regex, type] of TagNormalizer.normRegex) {
          const match = regex.exec(tag.value);
          if (!match) continue;
          if (type === null) return [TagType.unknown, []];
          return [type, [match[1] ?? match[0]]];
        }

        const dbData = _.first(GlobalDatabase.get(tag.value)?.data);
        if (dbData) return [dbData.type, dbData.stdName ?? [tag.value]];

        return [tag.type, [tag.value]];
      })();

      // modify tag
      const [type, [first, ...rest]] = operation;
      if (first) builder.addTagWithParser(tag.parser + (tag.value !== first ? "*" : ""), type, first);
      if (rest.length > 0) {
        builder.addTags(type, ...rest);
      }
    }
  }
}
