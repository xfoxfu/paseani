import _ from "lodash";
import { Parser, Result } from "./index.js";

export class LilithOrAniParser extends Parser {
  readonly regex =
    /\[(?<team>ANi|Lilith-Raws)\] (?<titles>.+?( \/ .+?)*) (- (?<episode>\d+(v\d+)?) |\[(?<episodes>\d+-\d+)\])?(?<metas>(\[.+?\])+)/;

  public override name = "LilithOrAniParser";

  public override canParse(name: string): boolean {
    return name.startsWith("[Lilith-Raws]");
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
      else if (m === "WEB-DL") previous.source_type.push("Web-DL");
      else if (m === "WebDL") previous.source_type.push("Web-DL");
      else if (m === "1080p") previous.resolution.push("1080p");
      else if (m === "AVC") previous.video_type.push("h264");
      else if (m === "AAC") previous.audio_type.push("aac");
      else if (m === "CHT") previous.subtitle_language.push("zh-Hans");
      else if (m === "MP4") previous.file_type.push("MP4");
      else previous.errors.push("unexpected metadata " + meta);
    }
    return previous;
  }
}
