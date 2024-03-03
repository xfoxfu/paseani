import { GlobalDatabase } from "./database/index.js";
import { LinkEnricher } from "./lib.js";
import { log } from "./log.js";
import { GJYParser } from "./parser/GJYParser.js";
import { LilithOrAniParser } from "./parser/LilithOrAniParser.js";
import { PrefixMatchParser } from "./parser/PrefixMatchParser.js";
import { TagNormalizer } from "./parser/TagNormalizer.js";
import { chainedParse } from "./parser/index.js";
import express from "express";

const parsers = [
  new GJYParser(),
  new LilithOrAniParser(),
  new PrefixMatchParser(),
  new TagNormalizer(),
  new LinkEnricher(),
];

void (async () => {
  await GlobalDatabase.init();
  for (const parser of parsers) {
    try {
      await parser.init();
      log.info(`parser ${parser.name} initialized`);
    } catch (e) {
      log.error(e);
    }
  }
})();

const app = express();

app.get("/info", (req, res) => {
  const name = req.query["name"] as string;
  if (typeof name !== "string") {
    res.status(400).send({ error: "Query param `name` must be a string." });
    return;
  }
  const result = chainedParse(parsers, name);
  res.status(200).send(result);
});

app.post("/internal/database/update", (req, res) => {
  (async () => {
    if ((req.query["token"] ?? "INVALID_TOKEN") !== process.env["PASEANI_ADMIN_TOKEN"]) {
      return { status: "invalid_token" };
    }
    await Promise.all(
      GlobalDatabase.rawDatabases.map(async (d) => {
        console.log(d.name);
        await d.update();
      }),
    );
    await GlobalDatabase.init();
    return { status: "ok" };
  })()
    .then((data) => res.status(200).send(data))
    .catch((err: Error & { status?: number }) => res.status(err.status ?? 500).send({ message: err.message }));
});

app.use(express.static("public"));

app.listen(3000);

log.info("paseani listening on 3000");
