import { Parser, ResultBuilder, TagType } from "./index.js";

export class SakuratoParser extends Parser {
  readonly regex =
    /^\[桜都字幕组\]\s*\[?(?<titles>.+)\s*\]?\[(?<ep>([\d.]+|\d+-\d+))(\s*(fin|end))?(\s*v\d+)?\]\[(?<res>.+)\]\[(?<sub>.+)\]$/i;

  public override name = "SakuratoParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return name.startsWith("[桜都字幕组]");
  }

  public override rawParse(name: string, builder: ResultBuilder) {
    const parsed = this.regex.exec(name);
    if (!parsed?.groups) {
      builder.addError("failed to parse with regex");
      return builder;
    }
    const { titles, ep, res, sub } = parsed.groups;
    if (!titles || !ep || !res || !sub) {
      builder.addError("missing groups for regex: found " + Object.keys(parsed.groups).join(","));
      return;
    }
    builder.addTag(TagType.team, "桜都字幕组");
    builder.addTags(TagType.title, ...titles.split("/").map((t) => t.trim()));
    if (ep) builder.addTag(TagType.episode, ep);
    builder.addTag(TagType.resolution, res);
    builder.addTag(TagType.subtitle_language, sub);
    return builder;
  }
}
