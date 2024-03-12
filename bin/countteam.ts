import { GlobalDatabase } from "../src/database/index.js";
import { GJYParser, LilithOrAniParser, LoliHouseParser, NekomoeParser } from "../src/lib.js";
import { ResultBuilder } from "../src/parser/index.js";
import { normalize } from "../src/util.js";
import { readFile } from "fs/promises";
import _ from "lodash";
import log from "loglevel";
import { tqdm } from "ts-tqdm";

log.setLevel("silent");

const parsers = [new GJYParser(), new LilithOrAniParser(), new LoliHouseParser(), new NekomoeParser()];

const count = {} as Record<string, number>;
const main = async () => {
  await GlobalDatabase.init();
  const titles = (await readFile("data/qa/titles.csv")).toString("utf8");
  for (const title of tqdm(titles.split("\n"))) {
    if (parsers.some((p) => p.canParse(title as string, new ResultBuilder()))) continue;
    const title_ = normalize(title as string);
    const team = title_.split("]")[0] + "]";
    count[team] ??= 0;
    count[team] += 1;
  }
  for (const [team, c] of _.sortBy(Object.entries(count), ([_t, c]) => -c)) {
    console.log(team, c);
  }
};

main().catch(console.error);
