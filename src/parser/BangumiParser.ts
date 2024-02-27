import { log } from "../log.js";
import { Parser, Result, ResultBuilder, TagType } from "./index.js";
import { open, writeFile } from "fs/promises";
import JSZip from "jszip";
import ky from "ky";
import _ from "lodash";
import * as OpenCC from "opencc-js";

export const parseInfoboxAlias = (infobox: string): string[] => {
  const infoboxNorm = infobox.replaceAll(/\s\s+/g, "");
  const aliasRegex = / ?别名 ?= ?{ ?(?<alias>(\[(\w+\|)?.+\])+) ?}/;
  const aliasMatch = aliasRegex.exec(infoboxNorm);
  const aliasText = aliasMatch?.groups?.["alias"];
  if (!aliasText) return [];
  const aliases = _.compact(
    aliasText
      .split("][")
      .map((a) => _.trim(a, "[]"))
      .map((a) => _.last(a.split("|"))),
  );
  return aliases;
};

export class BangumiParser extends Parser {
  public map = new Map<string, number>();
  public converter = OpenCC.Converter({ from: "t", to: "cn" });

  // eslint-disable-next-line no-unused-vars
  public constructor(public readonly dataPath = "data/bangumi/subject.jsonlines") {
    super();
  }

  public override name = "BangumiParser";

  public override canParse(_name: string, _builder: ResultBuilder): boolean {
    return true;
  }

  public override rawParse(_name: string, builder: ResultBuilder): Result {
    for (const title of builder.tags.filter((t) => t.type === TagType.title)) {
      const sid = this.map.get(title.value);
      if (sid) builder.addTag(TagType.link, "https://bgm.tv/subject/" + sid);
      const sid2 = this.map.get(this.converter(title.value));
      if (sid2) builder.addTag(TagType.link, "https://bgm.tv/subject/" + sid2);
    }
    return builder;
  }

  public override async init(): Promise<void> {
    const file = await open(this.dataPath);
    for await (const line of file.readLines()) {
      if (line.trim().length === 0) continue;
      try {
        const item = JSON.parse(line) as { id: number; type: number; name: string; name_cn: string; infobox: string };
        if (item.type !== 2) continue;
        if (item.name) this.map.set(item.name, item.id);
        if (item.name_cn) this.map.set(item.name_cn, item.id);
        for (const alias of parseInfoboxAlias(item.infobox)) {
          this.map.set(alias, item.id);
        }
      } catch (e) {
        log.error("error when parsing json " + line, e);
        /* ignore */
      }
    }
  }

  public async updateData(): Promise<void> {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
    const data = await ky("https://api.github.com/repos/bangumi/Archive/releases/tags/archive").json<any>();
    const asset = _.head(_.sortBy(data.assets, (d) => -new Date(d.created_at)));
    log.debug("Latest asset: ", asset.created_at);
    log.info("Found download URL at " + asset.browser_download_url);
    const zipBin = await ky(asset.browser_download_url).arrayBuffer();
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
    const zip = await JSZip.loadAsync(zipBin);
    log.info("Got archive data file");
    const subject = await zip.file("subject.jsonlines")?.async("nodebuffer");
    if (!subject) {
      log.error("subject.jsonlines not found in bangumi data archive");
      return;
    }
    await writeFile(this.dataPath, subject);
  }
}
