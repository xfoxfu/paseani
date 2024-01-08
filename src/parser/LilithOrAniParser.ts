import _ from "lodash";
import { Parser, Result } from "./index.js";

// [Lilith-Raws] 神推偶像登上武道館我就死而無憾 / Oshibudo - 08 [Baha][WEB-DL][1080p][AVC AAC][CHT][MKV]
// [ANi] BUILDDIVIDE - BUILD-DIVIDE -#FFFFFF- CODE WHITE[14][1080P][Baha][WEB-DL][AAC AVC][MP4]
// [ANi]  打工吧，魔王大人！第二季 [特別篇] - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]

export class LilithOrAniParser extends Parser {
  readonly regex =
    /^\[(?<team>ANi|Lilith-Raws)\] (?<titles>.+?( \/ .+?)*) ?(- (?<episode>\d+(v\d+)?) |\[(?<episodes>\d+(-\d+)?)\])?(?<metas>(\[[^\]]+?\])+)$/;

  public override name = "LilithOrAniParser";

  public override canParse(name: string): boolean {
    return name.startsWith("[Lilith-Raws]") || name.startsWith("[ANi]");
  }

  public override parse(name: string, previous: Result): Result {
    const parsed = this.regex.exec(name);
    if (!parsed || !parsed.groups) {
      previous.errors.push("failed to parse with regex");
      return previous;
    }
    const { team, titles, episode, episodes, metas } = parsed.groups;
    if (!team || !titles || !metas) {
      previous.errors.push("missing groups for regex: found " + Object.keys(parsed.groups));
      return previous;
    }
    previous.team.push(team);
    previous.title.push(...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (episode) previous.episode.push(episode);
    // TODO: parse episode range
    if (episodes) previous.episode.push(episodes);
    for (const meta of (metas?.split("][") ?? []).flatMap((m) => m.split(" "))) {
      const m = _.trim(meta, "[]");
      if (m === "Baha") previous.source_team.push("Baha");
      else if (m === "BiliBili") previous.source_team.push("Bilibili");
      else if (m === "Bilibili") previous.source_team.push("Bilibili");
      else if (m === "WEB-DL") previous.source_type.push("Web-DL");
      else if (m === "WebDL") previous.source_type.push("Web-DL");
      else if (m === "1080p") previous.resolution.push("1080p");
      else if (m === "1080P") previous.resolution.push("1080p");
      else if (m === "4K") previous.resolution.push("4k");
      else if (m === "AVC") previous.video_type.push("h264");
      else if (m === "AAC") previous.audio_type.push("aac");
      else if (m === "CHS") previous.subtitle_language.push("zh-Hans");
      else if (m === "CHT") previous.subtitle_language.push("zh-Hant");
      else if (m === "CHTSRT") previous.subtitle_language.push("zh-Hant");
      else if (m === "MP4") previous.file_type.push("MP4");
      else if (m === "MKV") previous.file_type.push("MKV");
      else if (m === "資金募集中") continue;
      else if (meta.startsWith("V")) continue;
      else previous.errors.push("unexpected metadata " + m);
    }
    return previous;
  }
}
