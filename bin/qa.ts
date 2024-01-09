import { BangumiParser, GJYParser, LilithOrAniParser, Parser } from "../src/lib.js";
import { chainedParse } from "../src/parser/index.js";
import { readFile, writeFile } from "fs/promises";
import { tqdm } from "ts-tqdm";

const parsers: Parser[] = [new GJYParser(), new LilithOrAniParser(), new BangumiParser()];

let ok = 0;
let errored = 0;
let unparsed = 0;

let csv = "";
const main = async () => {
  await Promise.all(parsers.map((p) => p.init()));
  const titles = (await readFile("data/qa/titles.csv")).toString("utf8");
  for (const title of tqdm(titles.split("\n"))) {
    const res = chainedParse(parsers, title as string);
    let status = "ok";
    if (res.errors.length > 0) {
      errored += 1;
      status = "errored";
    } else if (res.title.length === 0) {
      unparsed += 1;
      status = "unparsed";
    } else {
      ok += 1;
    }
    csv += `${title},${status},${res.errors.join(":")}\n`;
  }
  console.log(`ok=${ok} unparsed=${unparsed} errored=${errored}`);
  await writeFile("data/qa/result.csv", csv);
};

main().catch(console.error);
