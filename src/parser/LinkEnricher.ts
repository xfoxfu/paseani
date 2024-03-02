import { GlobalDatabase } from "../database/index.js";
import { Parser, Result, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class LinkEnricher extends Parser {
  public override name = "LinkEnricher";

  public override canParse(_name: string, _builder: ResultBuilder): boolean {
    return true;
  }

  public override rawParse(_name: string, builder: ResultBuilder): Result {
    for (const tag of _.clone(builder.tags)) {
      const data = GlobalDatabase.trie.get(tag.value);
      for (const item of data?.data ?? []) {
        if (!item.link || item.type !== tag.type) continue;
        builder.addTag(TagType.link, item.link);
      }
    }
    return builder;
  }
}
