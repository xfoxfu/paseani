import { PrefixMatchParser } from "../src/parser/PrefixMatchParser.js";
import { chainedParse } from "../src/parser/index.js";
import { readFile, writeFile } from "fs/promises";
import _ from "lodash";
import { tqdm } from "ts-tqdm";

const parser = new PrefixMatchParser();

let perfect = 0;
let ok = 0;
let unparsed = 0;

let csv = "";
const main = async () => {
  await parser.init();
  parser.loadBasicPrefix();
  await parser.loadBangumiData();
  await parser.loadAniDB();
  parser.loadPrefixDB();
  const titles = (await readFile("data/qa/titles.csv")).toString("utf8");
  for (const title of tqdm(titles.split("\n"))) {
    const res = chainedParse([parser], title as string);
    let status = "ok";
    if (res.errors.length === 0) {
      perfect += 1;
      status = "perfect";
    } else if (res.title.length === 0 || res.team.length === 0 || res.episode.length === 0) {
      unparsed += 1;
      status = "unparsed";
    } else {
      ok += 1;
    }
    csv += `${title},${status},:${res.errors.join(":")}:\n`;
  }
  console.log(`perfect=${perfect} ok=${ok} unparsed=${unparsed}`);
  await writeFile("data/qa/result-prefix.csv", csv);
  await writeFile(
    "data/qa/unknown-prefix.csv",
    _.sortBy(Object.entries(_.countBy(parser.unknownTags.map((t) => parser.normalizeName(t)))), ([_k, v]) => -v)
      .map(([k, v]) => `${k},${v}`)
      .join("\n"),
  );
};

main().catch(console.error);
