import { GlobalDatabase } from "../src/database/index.js";
import {
  GJYParser,
  GMTeamParser,
  LilithOrAniParser,
  LinkEnricher,
  LoliHouseParser,
  NekomoeParser,
  PrefixMatchParser,
  SakuratoParser,
  TagNormalizer,
} from "../src/lib.js";
import { TagType, chainedParse } from "../src/parser/index.js";
import { readFile, writeFile } from "fs/promises";
import _ from "lodash";
import log from "loglevel";
import { tqdm } from "ts-tqdm";

log.setLevel("silent");

const parsers = [
  new GJYParser(),
  new LilithOrAniParser(),
  new LoliHouseParser(),
  new NekomoeParser(),
  new SakuratoParser(),
  new GMTeamParser(),
  new PrefixMatchParser(),
  new TagNormalizer(),
  new LinkEnricher(),
];

const count = {} as Record<string, number>;

let report = "";
const main = async () => {
  await GlobalDatabase.init();
  const titles = (await readFile("data/qa/titles.csv")).toString("utf8");
  for (const title of tqdm(titles.split("\n"))) {
    const res = chainedParse(parsers, title as string);
    for (const tag of res.tags.filter((t) => t.type === TagType.unknown)) {
      count[tag.value] ??= 0;
      count[tag.value] += 1;
    }
  }
  for (const [tag, c] of _.sortBy(Object.entries(count), ([_, c]) => -c)) {
    report += `${tag} => ${c}\n`;
  }
  await writeFile("data/qa/unknown-prefix.txt", report);
  console.log(`written report to data/qa/unknown-prefix.txt`);
};

main().catch(console.error);
