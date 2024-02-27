import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class GJYParser extends Parser {
  readonly regex =
    /^(\[.+\]|【推しの子】) (?<titles>.+?( \/ .+?)*?)( (- )?(?<episode>[\w.]+(\(\w+\))?))? (\((?<extra>[^)]+)\))?(?<extra2>(\[[^\]]+\])*)$/;

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
      if (meta === "1280x720") builder.addTag(TagType.resolution, "720p");
      else if (meta === "1920x1080") builder.addTag(TagType.resolution, "1080p");
      else if (meta === "2048x870") builder.addTag(TagType.resolution, "2048x870");
      else if (meta === "2538x1080") builder.addTag(TagType.resolution, "2538x1080");
      else if (meta === "3840x2160") builder.addTag(TagType.resolution, "4k");
      else if (meta === "AAC") builder.addTag(TagType.audio_type, "aac");
      else if (meta === "AVC") builder.addTag(TagType.video_type, "h264");
      else if (meta === "HEVC") builder.addTag(TagType.video_type, "h265");
      else if (meta === "B-Global") builder.addTag(TagType.source_team, "B-Global");
      else if (meta === "Baha") builder.addTag(TagType.source_team, "Baha");
      else if (meta === "CR") builder.addTag(TagType.source_team, "CrunchyRoll");
      else if (meta === "Sentai") builder.addTag(TagType.source_team, "Sentai");
      else if (meta === "Donghua") continue;
      else if (meta === "MKV") builder.addTag(TagType.file_type, "mkv");
      else if (meta === "MP4") builder.addTag(TagType.file_type, "mp4");
      else if (meta === "WEB-DL") builder.addTag(TagType.source_type, "Web-DL");
      else if (meta === "1080p") builder.addTag(TagType.resolution, "1080p");
      else if (meta === "Multiple") continue;
      else if (meta === "Subtitle") continue;
      else if (meta.includes("x")) builder.addTag(TagType.resolution, meta);
      else if (meta.startsWith("V")) continue;
      else builder.addTag(TagType.unknown, meta);
    }
    return builder;
  }
}
