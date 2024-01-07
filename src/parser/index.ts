import _ from "lodash";
import { Result } from "../index.js";

export abstract class Parser {
  public abstract name: string;
  public abstract canParse(name: string): boolean;
  public abstract parse(name: string, previous: Result): Result;
}

export class GJYParser extends Parser {
  readonly regex = /\[GJ.Y\] (?<titles>.+?( \/ .+?)*?)( - (?<episode>[\w.]+(\(\w+\))?))? \((?<extra>.+)\)/;

  public name = "GJYParser";

  public canParse(name: string): boolean {
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
  public parse(name: string, previous: Result): Result {
    const parsed = this.regex.exec(name);
    if (!parsed || !parsed.groups) {
      previous.errors.push("failed to parse with regex");
      return previous;
    }
    const { titles, episode, extra } = parsed.groups;
    previous.team.push("NC-Raws");
    previous.title.push(...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (episode) previous.episode.push(episode);
    for (const meta of extra?.split(" ") ?? []) {
      if (meta === "1280x720") previous.resolution.push("720p");
      else if (meta === "1920x1080") previous.resolution.push("1080p");
      else if (meta === "2048x870") previous.resolution.push("2048x870");
      else if (meta === "2538x1080") previous.resolution.push("2538x1080");
      else if (meta === "3840x2160") previous.resolution.push("4k");
      else if (meta === "AAC") previous.audio_type.push("aac");
      else if (meta === "AVC") previous.video_type.push("h264");
      else if (meta === "HEVC") previous.video_type.push("h265");
      else if (meta === "B-Global") previous.source_team.push("B-Global");
      else if (meta === "Baha") previous.source_team.push("Baha");
      else if (meta === "CR") previous.source_team.push("CrunchyRoll");
      else if (meta === "Sentai") previous.source_team.push("Sentai");
      else if (meta === "Donghua") previous;
      else if (meta === "MKV") previous.file_type.push("mkv");
      else if (meta === "MP4") previous.file_type.push("mp4");
      else previous.errors.push("unexpected metadata " + meta);
    }
    return previous;
  }
}
export class LilithParser extends Parser {
  readonly regex =
    /\[Lilith-Raws\] (?<titles>.+?( \/ .+?)*) (- (?<episode>\d+) |\[(?<episodes>\d+-\d+)\])?(?<metas>(\[.+?\])+)/;

  public name = "LilithParser";

  public canParse(name: string): boolean {
    return name.startsWith("[Lilith-Raws]");
  }
  public parse(name: string, previous: Result): Result {
    const parsed = this.regex.exec(name);
    if (!parsed || !parsed.groups) {
      previous.errors.push("failed to parse with regex");
      return previous;
    }
    const { titles, episode, episodes, metas } = parsed.groups;
    previous.team.push("Lilith-Raws");
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
