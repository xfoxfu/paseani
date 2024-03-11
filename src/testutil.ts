import { Parser } from "./lib.js";
import { ResultBuilder, TagType, simpleParse } from "./parser/index.js";
import test from "ava";

export const testParser = <T extends Parser>(Parser: new () => T, titles: string[], assertEp = true) => {
  const parser = new Parser();
  for (const title of titles) {
    test(`test ${parser.name} ${title}`, (t): void => {
      t.true(parser.canParse(title, new ResultBuilder()));
      const result = parser.parse(title, new ResultBuilder()).build();
      t.true(result.errors.length === 0, result.errors.map((e) => e.message).join(","));
      t.true(result.tags.filter((t) => t.type === TagType.title).length > 0, "should have title");
      if (assertEp) t.true(result.tags.filter((t) => t.type === TagType.episode).length > 0, "should have ep");
    });
  }
};

export const testParserResult = <T extends Parser>(
  Parser: new () => T,
  title: string,
  tags: string[],
  filter?: TagType,
) => {
  const parser = new Parser();
  test(`result of ${parser.name} ${title}`, (t): void => {
    const result = simpleParse(parser, title, filter);
    t.deepEqual(result, tags, "should have identical tags");
  });
};
