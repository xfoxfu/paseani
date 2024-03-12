import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class NekomoeParser extends Parser {
  readonly regexA =
    /^\[喵萌奶茶屋\](★?.+?★)?\[(?<titles>.+?)\](\[(?<ep>[\d-]+)(v\d+)?(end)?\])?(?<extra>(\[.+\])+)(?<note>.+)?$/i;
  readonly regexB =
    /^\[喵萌奶茶屋\](★.+?★)?(?<titles>.+?)( - (?<ep>[\d-]+)(v\d+)?(end)?)?(?<extra>(\[.+\])+)(?<note>.+)?$/i;

  public override name = "NekomoeParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return name.startsWith("【喵萌奶茶屋】");
  }

  public override rawParse(name: string, builder: ResultBuilder) {
    name = name.replaceAll("【", "[").replaceAll("】", "]");
    const parsedA = this.regexA.exec(name);
    const parsedB = this.regexB.exec(name);
    const groups = parsedA?.groups ?? parsedB?.groups;
    if (!groups) {
      builder.addError("failed to parse with regex");
      return builder;
    }
    const { titles, ep, extra, note } = groups;
    if (!titles || !extra) {
      builder.addError("missing groups for regex: found " + Object.keys(groups).join(","));
    }
    builder.addTag(TagType.team, "喵萌奶茶屋");
    builder.addTags(TagType.title, ...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (ep) builder.addTag(TagType.episode, ep);
    const metas = _.compact(
      extra
        ?.split("][")
        .flatMap((m) => m.split(" ").flatMap((n) => n.split("_")))
        .map((m) => _.trim(m, "[]()")),
    );
    builder.addTags(TagType.unknown, ...metas);
    if (note) builder.addTag(TagType.unknown, note);

    return builder;
  }
}
