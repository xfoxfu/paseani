import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class LoliHouseParser extends Parser {
  readonly regex =
    /^\[(?<teams>(.+&)*LoliHouse)\] (?<titles>.+?( \/ .+?)*)( - ((?<ep>\d+)(v\d+)?))? (?<extra>(\[.+?\])+)((\(|（).+(\)|）))?(\s*v\d+)?$/;

  public override name = "LoliHouseParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return name.startsWith("[") && name.includes("LoliHouse] ") && !name.startsWith("[LoliHouse] 萝莉工坊");
  }

  public override rawParse(name: string, builder: ResultBuilder) {
    const parsed = this.regex.exec(name);
    if (!parsed?.groups) {
      builder.addError("failed to parse with regex");
      return builder;
    }
    const { teams, titles, ep, extra } = parsed.groups;
    if (!teams || !titles || !extra) {
      builder.addError("missing groups for regex: found " + Object.keys(parsed.groups).join(","));
    }
    builder.addTags(TagType.team, ..._.compact(teams?.split("&")));
    builder.addTags(TagType.title, ...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (ep) builder.addTag(TagType.episode, ep);
    const metas = _.compact(
      extra
        ?.split("][")
        .flatMap((m) => m.split(" "))
        .map((m) => _.trim(m, "[] ")),
    );
    builder.addTags(TagType.unknown, ...metas);

    return builder;
  }
}
