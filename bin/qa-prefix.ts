import { PrefixMatchParser } from "../src/parser/PrefixMatchParser.js";
import { chainedParse } from "../src/parser/index.js";
import { readFile, writeFile } from "fs/promises";
import _ from "lodash";
import { tqdm } from "ts-tqdm";

const parser = new PrefixMatchParser();

let ok = 0;
let unparsed = 0;

let csv = "";
const main = async () => {
  await parser.init();
  parser.loadBasicPrefix();
  await parser.loadBangumiData();
  const titles = (await readFile("data/qa/titles.csv")).toString("utf8");
  for (const title of tqdm(titles.split("\n"))) {
    const res = chainedParse([parser], title as string);
    let status = "ok";
    if (res.title.length === 0) {
      unparsed += 1;
      status = "unparsed";
    } else {
      ok += 1;
    }
    csv += `${title},${status},${res.errors.join(":")}\n`;
  }
  console.log(`ok=${ok} unparsed=${unparsed}`);
  await writeFile("data/qa/result-prefix.csv", csv);
  await writeFile("data/qa/unknown-prefix.csv", _.uniq(parser.unknownTags).join("\n"));
};

main().catch(console.error);
