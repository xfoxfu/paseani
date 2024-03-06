import { Trie } from "./trie.js";
import test, { ExecutionContext } from "ava";

test("get ignores space in query", (t) => {
  const trie = new Trie();
  trie.addChild("Foo", 1);
  trie.addChild("FooBar", 2);

  t.deepEqual(trie.get("Foo")?.data, 1);
  t.deepEqual(trie.get("Foo Bar")?.data, 2);
  t.deepEqual(trie.get("Foo  Bar")?.data, 2);
});

const assertFurthest = (
  t: ExecutionContext,
  furthest: [number, Trie<number>],
  pos: number,
  node: Trie<number> | undefined,
) => {
  t.deepEqual(furthest[0], pos);
  t.is(furthest[1] as typeof node, node);
};

test("getFurthest", (t) => {
  const trie = new Trie<number>();
  trie.addChild("Foo", 1);
  trie.addChild("Foo Bar", 2);
  trie.addChild("Baz", 3);

  assertFurthest(t, trie.getFurthestWithData("Foo"), 3, trie.get("Foo"));
  assertFurthest(t, trie.getFurthestWithData("Foo Bar"), 7, trie.get("Foo Bar"));
  assertFurthest(t, trie.getFurthestWithData("Foo  Bar"), 8, trie.get("Foo Bar"));
  assertFurthest(t, trie.getFurthestWithData("Foo=="), 3, trie.get("Foo"));
  assertFurthest(t, trie.getFurthestWithData("Foo Ba=="), 3, trie.get("Foo"));
  assertFurthest(t, trie.getFurthestWithData("Foo  Ba=="), 3, trie.get("Foo"));
  assertFurthest(t, trie.getFurthestWithData("BB"), 0, trie);
  assertFurthest(t, trie.getFurthestWithData("Foo ABC"), 3, trie.get("Foo"));
  assertFurthest(t, trie.getFurthestWithData("Foo "), 3, trie.get("Foo"));
  assertFurthest(t, trie.getFurthestWithData("Baz Baz"), 3, trie.get("Baz"));
});
