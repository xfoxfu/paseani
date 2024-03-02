import { log } from "../log.js";
import { TagType } from "../parser/index.js";
import { Trie } from "../trie.js";
import { AniDBDatabase } from "./AniDBDatabase.js";
import { BangumiDatabase } from "./BangumiDatabase.js";
import { PrefixDatabase } from "./PrefixDatabase.js";
import { RawDatabase } from "./RawDatabase.js";
import * as OpenCC from "opencc-js";

export interface Data {
  name: string;
  type: TagType;
  link?: string;
  stdName?: string[];
}

type TrieData = Data & { sourceName: string };
export class Database {
  public trie = new Trie<TrieData[]>();
  public readonly opencc = OpenCC.Converter({ from: "t", to: "cn" });
  public readonly rawDatabases = [new AniDBDatabase(), new BangumiDatabase(), new PrefixDatabase()];

  public normalizeName(name: string): string {
    return this.opencc(name).toLowerCase();
  }

  public loadPrefix(name: string, data: Omit<Data, "name">, dbName = "NoDB") {
    const normName = this.normalizeName(name);
    let existingData = this.trie.get(normName);
    const newData = { ...data, name, sourceName: dbName };
    if (!existingData?.data) {
      existingData = this.trie.addChild(normName, []);
    }
    this.trie.get(normName)!.data!.push(newData);
  }

  protected static readonly BASIC_PREFIX = " \t[]/_-()【】★（）·◆☆\u{200B}&.".split("");
  public loadBasicPrefix() {
    for (const p of Database.BASIC_PREFIX) {
      this.loadPrefix(p, { type: TagType.unknown, stdName: [] }, "BasicPrefixDb");
    }
  }

  public async loadRawDatabase(db: RawDatabase): Promise<void> {
    for await (const data of db.list()) {
      this.loadPrefix(data.name, data, db.name);
    }
  }

  public async init(): Promise<void> {
    this.trie = new Trie();
    this.loadBasicPrefix();
    await Promise.all(this.rawDatabases.map((d) => this.loadRawDatabase(d)));
    log.info("database initialized");
  }

  public hasNoDrop(node: typeof this.trie): boolean {
    return node.data === null || node.data?.some((t) => (t.stdName?.length ?? 1) > 0);
  }

  public get(name: string): typeof this.trie | null {
    return this.trie.get(this.normalizeName(name));
  }
}

export const GlobalDatabase = new Database();
