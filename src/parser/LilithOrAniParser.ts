import { Parser, ResultBuilder, TagType } from "./index.js";
import _ from "lodash";

export class LilithOrAniParser extends Parser {
  readonly regex =
    /^\[(?<team>ANi|Lilith-Raws)\] (?<titles>.+?( \/ .+?)*) ?(- (?<episode>\d+(v\d+)?) |\[(?<episodes>\d+(-\d+)?)\])?(?<metas>(\[[^\]]+?\])+)$/;

  public override name = "LilithOrAniParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return name.startsWith("[Lilith-Raws]") || name.startsWith("[ANi]");
  }

  public override rawParse(name: string, builder: ResultBuilder): void {
    const parsed = this.regex.exec(name);
    if (!parsed?.groups) {
      builder.addError("failed to parse with regex");
      return;
    }
    const { team, titles, episode, episodes, metas } = parsed.groups;
    if (!team || !titles || !metas) {
      builder.addError("missing groups for regex: found " + Object.keys(parsed.groups).join(","));
    }
    builder.addTag(TagType.team, team ?? "");
    builder.addTags(TagType.title, ...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (episode) builder.addTag(TagType.episode, episode);
    // TODO: parse episode range
    if (episodes) builder.addTag(TagType.episode, episodes);
    for (const meta of (metas?.split("][") ?? []).flatMap((m) => m.split(" "))) {
      const m = _.trim(meta, "[]");
      if (m === "Baha") builder.addTag(TagType.source_team, "Baha");
      else if (m === "BiliBili") builder.addTag(TagType.source_team, "Bilibili");
      else if (m === "Bilibili") builder.addTag(TagType.source_team, "Bilibili");
      else if (m === "WEB-DL") builder.addTag(TagType.source_type, "Web-DL");
      else if (m === "WebDL") builder.addTag(TagType.source_type, "Web-DL");
      else if (m === "1080p") builder.addTag(TagType.resolution, "1080p");
      else if (m === "1080P") builder.addTag(TagType.resolution, "1080p");
      else if (m === "4K") builder.addTag(TagType.resolution, "4k");
      else if (m === "AVC") builder.addTag(TagType.video_type, "h264");
      else if (m === "AAC") builder.addTag(TagType.audio_type, "aac");
      else if (m === "CHS") builder.addTag(TagType.subtitle_language, "zh-Hans");
      else if (m === "CHT") builder.addTag(TagType.subtitle_language, "zh-Hant");
      else if (m === "CHTSRT") builder.addTag(TagType.subtitle_language, "zh-Hant");
      else if (m === "MP4") builder.addTag(TagType.file_type, "mp4");
      else if (m === "MKV") builder.addTag(TagType.file_type, "mkv");
      else if (m === "資金募集中") continue;
      else if (meta.startsWith("V")) continue;
      else builder.addTag(TagType.unknown, m);
    }
  }
}
