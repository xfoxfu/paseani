import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class GJYParser extends Parser {
  readonly regex =
    /^(\[.+\]|【推しの子】) (?<titles>.+?( \/ .+?)*?)( (- )?(?<episode>[\w.]+(\(\w+\))?))? (\((?<extra>[^)]+)\))?(?<extra2>(\[[^\]]+\])*)(\.\w{3})?$/;

  public override name = "GJYParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return (
      name.startsWith("[DD]") ||
      name.startsWith("[GJ.Y]") ||
      name.startsWith("[NC-Raws]") ||
      name.startsWith("[まひろ🍥]") ||
      name.startsWith("【推しの子】") ||
      name.startsWith("[神楽坂 まひろ]") ||
      name.startsWith("[神樂坂 まひろ]")
    );
  }

  public override rawParse(name: string, builder: ResultBuilder) {
    const parsed = this.regex.exec(name);
    if (!parsed?.groups) {
      builder.addError("failed to parse with regex");
      return builder;
    }
    const { titles, episode, extra, extra2 } = parsed.groups;
    builder.addTag(TagType.team, "NC-Raws");
    builder.addTags(TagType.title, ...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (episode) builder.addTag(TagType.episode, episode);
    const metas = _.compact(
      _.concat(
        extra?.split(" "),
        extra2
          ?.split("][")
          .flatMap((m) => m.split(" "))
          .map((m) => _.trim(m, "[] ")),
      ),
    );
    for (const meta of metas) {
      if (meta.match(/^\d+x\d+$/)) builder.addTag(TagType.resolution, meta);
      else if (meta === "Donghua") continue;
      else if (meta === "Multiple") continue;
      else if (meta === "Subtitle") continue;
      else if (meta.match(/^V\d+$/)) continue;
      else builder.addTag(TagType.unknown, meta);
    }
    return builder;
  }
}
