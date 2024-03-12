import { Parser, ResultBuilder, TagType } from "./index.js";

export class GMTeamParser extends Parser {
  readonly regex =
    /^\[GM-Team\]\[国漫\]\[(?<tch>.+)\]\[(?<ten>.+)\]\[\d+\]\[(?<ep>(\d+|\d+-\d+|movie))(\s*(fin|end))?\](\[(?<vty>\w+)\])?\[(?<lang>\w+)\]\[(?<extra>[\w\s]+)\]$/i;

  public override name = "GMTeamParser";

  public override canParse(name: string, _builder: ResultBuilder): boolean {
    return name.startsWith("[GM-Team]");
  }

  public override rawParse(name: string, builder: ResultBuilder) {
    const parsed = this.regex.exec(name);
    if (!parsed?.groups) {
      builder.addError("failed to parse with regex");
      return builder;
    }
    const { tch, ten, ep, vty, lang, extra } = parsed.groups;
    if (!tch || !ten || !ep || !lang || !extra) {
      builder.addError("missing groups for regex: found " + Object.keys(parsed.groups).join(","));
      return;
    }
    builder.addTag(TagType.team, "国漫");
    builder.addTag(TagType.title, tch);
    builder.addTag(TagType.title, ten);
    builder.addTag(TagType.episode, ep);
    if (vty) builder.addTag(TagType.video_type, vty);
    builder.addTag(TagType.subtitle_language, lang);
    builder.addTags(TagType.unknown, ...extra.split(" "));
    return builder;
  }
}
