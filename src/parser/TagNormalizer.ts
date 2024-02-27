import { Parser, ResultBuilder } from "./index.js";
import { prefixdb } from "./prefixdb.js";
import * as OpenCC from "opencc-js";

export class TagNormalizer extends Parser {
  public readonly tagdb: Record<string, (typeof prefixdb)[keyof typeof prefixdb]> = {};

  public override name = "TagNormalizer";
  public converter = OpenCC.Converter({ from: "t", to: "cn" });

  public override canParse(_name: string, _builder: ResultBuilder): boolean {
    return true;
  }

  public override rawParse(_name: string, builder: ResultBuilder): void {
    for (const tag of builder.tags) {
      const operation = this.tagdb[this.normalizeName(tag.value)];
      if (operation === undefined) continue;

      if (operation === null) {
        tag.value = "";
      } else {
        const [type, valuesExpr] = operation;
        tag.type = type;
        const [first, ...rest] = valuesExpr.includes("|") ? valuesExpr.split("|") : [valuesExpr];
        tag.value = first ?? "";
        if (rest.length > 0) {
          builder.addTags(type, ...rest);
        }
      }
    }
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
