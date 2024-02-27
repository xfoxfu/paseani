import { Parser, ResultBuilder, TagType } from "./index.js";
import { prefixdb } from "./prefixdb.js";
import _ from "lodash";
import * as OpenCC from "opencc-js";

export class TagNormalizer extends Parser {
  public readonly tagdb: Record<string, (typeof prefixdb)[keyof typeof prefixdb]> = {};

  public override name = "TagNormalizer";
  public converter = OpenCC.Converter({ from: "t", to: "cn" });

  public override canParse(_name: string, _builder: ResultBuilder): boolean {
    return true;
  }

  protected static readonly regexEp = /^第(\d+)话$/;

  public override rawParse(_name: string, builder: ResultBuilder): void {
    for (const tag of builder.tags) {
      const tagValue = this.normalizeName(tag.value);
      const operation = ((): [TagType, string] | null | undefined => {
        if (TagNormalizer.regexEp.test(tag.value)) {
          return [TagType.episode, _.trim(tagValue, "第话")];
        }

        return this.tagdb[tagValue];
      })();
      if (operation === undefined) continue;
      if (tag.parser === this.name) continue;

      if (operation === null) {
        tag.value = "";
      } else {
        const [type, valuesExpr] = operation;
        tag.type = type;
        const [first, ...rest] = valuesExpr.includes("|") ? valuesExpr.split("|") : [valuesExpr];
        tag.value = first ?? "";
        tag.parser += "*";
        if (rest.length > 0) {
          builder.addTags(type, ...rest);
        }
      }
    }
    _.remove(builder.tags, (t) => t.value.length <= 0);
  }

  public override init(): Promise<void> {
    for (const [key, operation] of Object.entries(prefixdb)) {
      this.tagdb[key] = operation;
    }
    return Promise.resolve();
  }

  public normalizeName(name: string): string {
    return this.converter(name).toLowerCase();
  }
}
