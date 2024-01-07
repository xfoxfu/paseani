import { readFile, writeFile } from "fs/promises";
import JSZip from "jszip";
import ky from "ky";
import _ from "lodash";
import * as OpenCC from "opencc-js";
import { log } from "../index.js";
import { Parser, Result } from "./index.js";

export const parseInfoboxAlias = (infobox: string): string[] => {
  const infoboxNorm = infobox.replaceAll(/\s\s+/g, "");
  const aliasRegex = / ?别名 ?= ?{ ?(?<alias>(\[(\w+\|)?.+\])+) ?}/;
  const aliasMatch = aliasRegex.exec(infoboxNorm);
  const aliasText = aliasMatch?.groups?.["alias"];
  if (!aliasText) return [];
  const aliases = aliasText.split("][").map((a) => _.trim(a, "[]"));
  return aliases;
};

export class BangumiParser extends Parser {
  public map: Map<string, number> = new Map();
  public converter = OpenCC.Converter({ from: "t", to: "cn" });

  public override name = "BangumiParser";

  public override canParse(_name: string): boolean {
    return true;
  }

  public override parse(_name: string, previous: Result): Result {
    for (const title of previous.title) {
      const sid = this.map.get(title);
      if (sid) previous.link.push("https://bgm.tv/subject/" + sid);
      const sid2 = this.map.get(this.converter(title));
      if (sid2) previous.link.push("https://bgm.tv/subject/" + sid2);
    }
    return previous;
  }

  public override async init(): Promise<void> {
    const text = await readFile("data/bangumi/subject.jsonlines");
    const lines = text.toString("utf8").split("\n");
    const items = lines
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter((l) => !!l);

    for (const item of items) {
      if (item.type !== 2) continue;
      if (item.name) this.map.set(item.name, item.id);
      if (item.name_cn) this.map.set(item.name_cn, item.id);
      for (const alias of parseInfoboxAlias(item.infobox)) {
        this.map.set(alias, item.id);
      }
    }
  }

  public static async updateData(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await ky("https://api.github.com/repos/bangumi/Archive/releases/tags/archive").json<any>();
    const asset = _.head(_.sortBy(data.assets, (d) => new Date(d.created_at)));
    log.info("Found download URL at " + asset.browser_download_url);
    const zipBin = await ky(asset.browser_download_url).arrayBuffer();
    const zip = await JSZip.loadAsync(zipBin);
    log.info("Got archive data file");
    const subject = await zip.file("subject.jsonlines")?.async("nodebuffer");
    if (!subject) {
      log.error("subject.jsonlines not found in bangumi data archive");
      return;
    }
    await writeFile("data/bangumi/subject.jsonlines", subject);
  }
}
