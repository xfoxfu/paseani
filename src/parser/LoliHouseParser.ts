import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class LoliHouseParser extends Parser {
  readonly regexA =
    /^\[(?<teams>(.+&)*LoliHouse)\] (?<titles>.+?( \/ .+?)*)( - ((?<ep>\d+)(v\d+)?))? (?<extra>(\[.+?\])+)((\(|（).+(\)|）))?(\s*v\d+)?$/;
  readonly regexB =
    /^\[(?<teams>(.+&)*LoliHouse)\](?<titles>(\[(?!\d+(-\d+)?(合集)?\]).+?\])+)(\[(?<ep>\d+(-\d+)?)(合集)?\])?(?<extra>((\[|【|（|\().+?(\]|】|）|\)))+)(\s*v\d+)?$/;

  public override name = "LoliHouseParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return name.startsWith("[") && name.includes("LoliHouse]") && !name.startsWith("[LoliHouse] 萝莉工坊");
  }

  public override rawParse(name: string, builder: ResultBuilder) {
    const parsedA = this.regexA.exec(name);
    const parsedB = this.regexB.exec(name);
    const groups = parsedA?.groups ?? parsedB?.groups;
    if (!groups) {
      builder.addError("failed to parse with regex");
      return builder;
    }
    const { teams, titles, ep, extra } = groups;
    if (!teams || !titles || !extra) {
      builder.addError("missing groups for regex: found " + Object.keys(groups).join(","));
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
