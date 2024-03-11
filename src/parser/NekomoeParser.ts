import { normalize } from "../util.js";
import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class NekomoeParser extends Parser {
  readonly regex = /^\[喵萌奶茶屋\](★.+?★)?\[(?<titles>.+?)\]\[(?<ep>[\d-]+).+?\](?<extra>(\[.+\])+)(?<note>.+)?$/;

  public override name = "NekomoeParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return name.startsWith("【喵萌奶茶屋】");
  }

  public override rawParse(name: string, builder: ResultBuilder) {
    name = normalize(name);
    const parsed = this.regex.exec(name);
    if (!parsed?.groups) {
      builder.addError("failed to parse with regex");
      return builder;
    }
    const { titles, ep, extra, note } = parsed.groups;
    if (!titles || !extra) {
      builder.addError("missing groups for regex: found " + Object.keys(parsed.groups).join(","));
    }
    builder.addTag(TagType.team, "喵萌奶茶屋");
    builder.addTags(TagType.title, ...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (ep) builder.addTag(TagType.episode, ep);
    const metas = _.compact(
      extra
        ?.split("][")
        .flatMap((m) => m.split(" "))
        .map((m) => _.trim(m, "[]()")),
    );
    builder.addTags(TagType.unknown, ...metas);
    if (note) builder.addTag(TagType.unknown, note);

    return builder;
  }
}
