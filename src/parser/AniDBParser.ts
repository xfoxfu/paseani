import { log } from "../log.js";
import { AniDBXml } from "./anidb_xml.js";
import { Parser, Result, ResultBuilder, TagType } from "./index.js";
import { XMLParser } from "fast-xml-parser";
import { readFile, writeFile } from "fs/promises";
import ky from "ky";
import _ from "lodash";

export class AniDBParser extends Parser {
  public readonly dataPath = "data/anidb.dat";

  public mapToId = new Map<string, number>();
  public mapToSyms = new Map<number, string[]>();

  public override name = "AniDBParser";

  public override canParse(_name: string, _builder: ResultBuilder): boolean {
    return true;
  }

  public override rawParse(_name: string, builder: ResultBuilder): Result {
    const titles = _.clone(builder.tags.filter((t) => t.type === TagType.title));
    for (const title of titles) {
      const id = this.mapToId.get(title.value);
      if (id) builder.addTags(TagType.title, ...(this.mapToSyms.get(id) ?? []));
    }
    return builder;
  }

  public override async init(): Promise<void> {
    const text = await readFile(this.dataPath);
    const lines = text.toString("utf8").split("\n");
    const items = lines.filter((l) => !!l && !l.startsWith("#"));
    for (const item of items) {
      // <aid>|<type>|<language>|<title>
      const [aid, _type, lang, title] = item.split("|") as [string, string, string, string];
      const aid_ = Number.parseInt(aid, 10);
      this.mapToId.set(title, aid_);
      if (!this.mapToSyms.has(aid_)) this.mapToSyms.set(aid_, []);
      if (["x-jat", "ja"].includes(lang)) {
        this.mapToSyms.get(aid_)?.push(title);
      }
    }
  }

  public async updateData(): Promise<void> {
    const anidb = await ky("https://github.com/c032/anidb-animetitles-archive/raw/main/latest.xml").text();
    log.info("Got archive data file");
    const parser = new XMLParser({ ignoreAttributes: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: AniDBXml = parser.parse(anidb);
    let result = "";
    for (const anime of data.animetitles.anime) {
      // <aid>|<type>|<language>|<title>
      if (Array.isArray(anime.title)) {
        for (const title of anime.title) {
          result += `${anime["@_aid"]}|${title["@_type"]}|${title["@_xml:lang"]}|${title["#text"]}\n`;
        }
      } else {
        result += `${anime["@_aid"]}|${anime.title["@_type"]}|${anime.title["@_xml:lang"]}|${anime.title["#text"]}\n`;
      }
    }

    await writeFile(this.dataPath, result);
    await writeFile(this.dataPath + ".xml", anidb);
    await writeFile(this.dataPath + ".json", JSON.stringify(data));
  }
}
