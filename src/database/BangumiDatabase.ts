import { log } from "../log.js";
import { TagType } from "../parser/index.js";
import { RawDatabase } from "./RawDatabase.js";
import { Data } from "./index.js";
import JSZip from "jszip";
import ky from "ky";
import _ from "lodash";
import { open, writeFile } from "node:fs/promises";

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

export class BangumiDatabase extends RawDatabase {
  constructor(public readonly dataPath = "data/bangumi/subject.jsonlines") {
    super();
  }

  public override name = "BangumiDatabase";

  public override async *list(): AsyncIterable<Data> {
    const file = await open(this.dataPath);
    for await (const line of file.readLines()) {
      if (line.trim().length === 0) continue;
      try {
        const item = JSON.parse(line) as { id: number; type: number; name: string; name_cn: string; infobox: string };
        if (item.type !== 2) continue;
        if (!item.name && !item.name_cn) {
          log.warn(`bangumi item ${item.id} without name and name_cn`);
          continue;
        }
        const link = `https://bgm.tv/subject/${item.id}`;
        const stdName = [item.name ?? item.name_cn];
        if (item.name) {
          yield { name: item.name, type: TagType.title, link };
        }
        if (item.name_cn) {
          yield { name: item.name_cn, type: TagType.title, link, stdName };
        }
        for (const alias of parseInfoboxAlias(item.infobox)) {
          yield { name: alias, type: TagType.title, link, stdName };
        }
      } catch (e) {
        log.error("error when parsing json " + line, e);
        /* ignore */
      }
    }
  }

  public override async update(): Promise<void> {
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

    log.info("bangumi updated at " + this.dataPath);
  }
}
