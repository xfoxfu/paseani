import { GlobalDatabase } from "../src/database/index.js";
import {
  GJYParser,
  GMTeamParser,
  LilithOrAniParser,
  LoliHouseParser,
  NekomoeParser,
  SakuratoParser,
} from "../src/lib.js";
import { ResultBuilder, TagType, chainedParse } from "../src/parser/index.js";
import { readFile, writeFile } from "fs/promises";
import log from "loglevel";
import { tqdm } from "ts-tqdm";

log.setLevel("silent");

const parser = (() => {
  if (process.argv[2] === "GJYParser") return new GJYParser();
  if (process.argv[2] === "LilithOrAniParser") return new LilithOrAniParser();
  if (process.argv[2] === "LoliHouseParser") return new LoliHouseParser();
  if (process.argv[2] === "NekomoeParser") return new NekomoeParser();
  if (process.argv[2] === "SakuratoParser") return new SakuratoParser();
  if (process.argv[2] === "GMTeamParser") return new GMTeamParser();
  throw new Error(`invalid parser '${process.argv[2]}'`);
})();

let ok = 0;
let errored = 0;
let unparsed = 0;

let report = "";
const main = async () => {
  await GlobalDatabase.init();
  const titles = (await readFile("data/qa/titles.csv")).toString("utf8");
  for (const title of tqdm(titles.split("\n"))) {
    if (!parser.canParse(title as string, new ResultBuilder())) continue;
    const res = chainedParse([parser], title as string);
    let status = "ok";
    if (res.errors.length > 0) {
      errored += 1;
      status = "errored";
    } else if (!res.tags.some((t) => t.type === TagType.title)) {
      unparsed += 1;
      status = "unparsed";
    } else {
      ok += 1;
    }
    if (status !== "ok") {
      report += `${title} (${status})
${res.errors.map((x) => x.message).join(":")}

`;
    }
  }
  console.log(`ok=${ok} unparsed=${unparsed} errored=${errored}`);
  await writeFile("data/qa/result.txt", report);
  console.log(`written report to data/qa/result.txt`);
};

main().catch(console.error);
