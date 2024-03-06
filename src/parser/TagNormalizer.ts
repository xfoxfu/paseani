import { GlobalDatabase } from "../database/index.js";
import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class TagNormalizer extends Parser {
  public override name = "TagNormalizer";

  public override canParse(_name: string, _builder: ResultBuilder): boolean {
    return true;
  }

  protected static readonly regexEp = /^第(\d+)(话|集)$/;

  public override rawParse(_name: string, builder: ResultBuilder): void {
    const originalTags = _.cloneDeep(builder.tags);
    _.remove(builder.tags);
    for (const tag of originalTags) {
      const tagValue = GlobalDatabase.normalizeName(tag.value);
      const operation = ((): [TagType, string[]] => {
        if (TagNormalizer.regexEp.test(tag.value)) {
          return [TagType.episode, [_.trim(tagValue, "第话集")]];
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
