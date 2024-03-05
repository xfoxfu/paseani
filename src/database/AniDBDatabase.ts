import { TagType } from "../parser/index.js";
import { Type as AniDBType, AniDBXml } from "./AniDBDatabaseXml.js";
import { RawDatabase } from "./RawDatabase.js";
import { Data } from "./index.js";
import { XMLParser } from "fast-xml-parser";
import ky from "ky";
import log from "loglevel";
import { open, writeFile } from "node:fs/promises";

interface AniDBData {
  aid: string;
  titles: { type: AniDBType; lang: string; title: string }[];
}

/**
 * @see https://wiki.anidb.net/User:Eloyard/anititles_dump
 */
export class AniDBDatabase extends RawDatabase {
  constructor(public readonly dataPath = "data/anidb.xml.jsonlines") {
    super();
  }

  public override name = "AniDBDatabase";

  public override async *list(): AsyncIterable<Data> {
    const file = await open(this.dataPath);
    for await (const line of file.readLines()) {
      if (line.trim().length === 0) continue;
      try {
        const item = JSON.parse(line) as AniDBData;
        const stdName = (
          item.titles.find((t) => t.type === "official" && t.lang === "ja") ??
          item.titles.find((t) => t.type === "official" && t.lang === "x-jat") ??
          item.titles.find((t) => t.type === "official" && t.lang.startsWith("zh")) ??
          item.titles.find((t) => t.type === "official" && t.lang === "en")
        )?.title;
        if (!stdName) {
          log.warn(`no std name for anidb ${item.aid}`);
          continue;
        }
        const link = `https://anidb.net/anime/${item.aid}`;
        for (const title of item.titles) {
          if (!["official", "syn", "main"].includes(title.type)) continue;
          if (!["ja", "en", "x-jat"].includes(title.lang) && !title.lang.startsWith("zh")) continue;
          yield { name: title.title, type: TagType.title, link, stdName: [stdName] };
        }
      } catch (e) {
        log.error("error when parsing json " + line, e);
        /* ignore */
      }
    }
  }

  public override async update(): Promise<void> {
    const anidb = await ky("https://github.com/c032/anidb-animetitles-archive/raw/main/latest.xml").text();
    log.info("Got archive data file");
    const parser = new XMLParser({ ignoreAttributes: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: AniDBXml = parser.parse(anidb);
    let result = "";
    for (const anime of data.animetitles.anime) {
      const titles = Array.isArray(anime.title) ? anime.title : [anime.title];
      result +=
        JSON.stringify({
          aid: anime["@_aid"],
          titles: titles.map((title) => ({
            type: title["@_type"],
            lang: title["@_xml:lang"],
            title: title["#text"].toString(),
          })),
        } satisfies AniDBData) + "\n";
    }

    await writeFile(this.dataPath, result);
    await writeFile(this.dataPath.replace(".jsonlines", ""), anidb);
    log.info("anidb updated at " + this.dataPath);
  }
}
