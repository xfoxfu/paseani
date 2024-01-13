import { Parser, Result, getEmptyResult } from "./index.js";
import _ from "lodash";

export class GJYParser extends Parser {
  readonly regex =
    /^(\[.+\]|【推しの子】) (?<titles>.+?( \/ .+?)*?)( - (?<episode>[\w.]+(\(\w+\))?))? (\((?<extra>[^)]+)\))?(?<extra2>(\[[^\]]+\])*)$/;

  public override name = "GJYParser";

  public override canParse(name: string): boolean {
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

  public override parse(name: string, previous: Result = getEmptyResult()): Result {
    const parsed = this.regex.exec(name);
    if (!parsed?.groups) {
      previous.errors.push("failed to parse with regex");
      return previous;
    }
    const { titles, episode, extra, extra2 } = parsed.groups;
    previous.team.push("NC-Raws");
    previous.title.push(...(titles?.split("/") ?? []).map((t) => t.trim()));
    if (episode) previous.episode.push(episode);
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
      else if (meta === "WEB-DL") previous.source_type.push("Web-DL");
      else if (meta === "1080p") previous.resolution.push("1080p");
      else if (meta === "Multiple") continue;
      else if (meta === "Subtitle") continue;
      else if (meta.includes("x")) previous.resolution.push(meta);
      else if (meta.startsWith("V")) continue;
      else previous.errors.push("unexpected metadata " + meta);
    }
    return previous;
  }
}
