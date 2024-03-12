import { GlobalDatabase } from "./database/index.js";
import { LinkEnricher, LoliHouseParser, NekomoeParser, SakuratoParser } from "./lib.js";
import { GJYParser } from "./parser/GJYParser.js";
import { LilithOrAniParser } from "./parser/LilithOrAniParser.js";
import { PrefixMatchParser } from "./parser/PrefixMatchParser.js";
import { TagNormalizer } from "./parser/TagNormalizer.js";
import { TagType, chainedParse } from "./parser/index.js";
import Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import cors from "cors";
import express from "express";
import log from "loglevel";

// validate env vars
if (process.env["LOG_LEVEL"] && !["trace", "debug", "info", "warn", "error"].includes(process.env["LOG_LEVEL"])) {
  throw new Error("invalid LOG_LEVEL");
}
if (!process.env["SENTRY_DSN"]) {
  log.warn("SENTRY_DSN not set, will not report error to sentry");
}
if (!process.env["PASEANI_ADMIN_TOKEN"]) {
  log.warn("PASEANI_ADMIN_TOKEN not set");
}

log.setLevel((process.env["LOG_LEVEL"] as "trace" | "debug" | "info" | "warn" | "error") ?? log.levels.INFO);

const parsers = [
  new GJYParser(),
  new LilithOrAniParser(),
  new LoliHouseParser(),
  new NekomoeParser(),
  new SakuratoParser(),
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

Sentry.init({
  dsn: process.env["SENTRY_DSN"] ?? "",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.options("/info", cors());
app.get("/info", cors(), (req, res) => {
  const name = req.query["name"] as string;
  if (typeof name !== "string") {
    res.status(400).send({ error: "Query param `name` must be a string." });
    return;
  }
  const result = chainedParse(parsers, name);
  for (const tag of result.tags) {
    if (tag.type === TagType.unknown) Sentry.captureMessage(`Unknown tag '${tag.value}'`, { level: "warning" });
  }
  for (const error of result.errors) {
    Sentry.captureMessage(`${error.parser}: ${error.message}`, { level: "error" });
  }
  res.status(200).send(result);
});

app.post("/internal/database/update", (req, res, next) => {
  (async () => {
    if ((req.query["token"] ?? "INVALID_TOKEN") !== process.env["PASEANI_ADMIN_TOKEN"]) {
      return { status: "invalid_token" };
    }
    await Promise.all(
      GlobalDatabase.rawDatabases.map(async (d) => {
        await d.update();
      }),
    );
    await GlobalDatabase.init();
    return { status: "ok" };
  })()
    .then((data) => res.status(200).send(data))
    .catch((err) => next(err));
});

app.use(express.static("public"));

app.use(Sentry.Handlers.errorHandler());

app.listen(3000);

log.info("paseani listening on 3000");
