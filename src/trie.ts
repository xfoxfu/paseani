import { splitAt } from "./util.js";
import log from "loglevel";

export class Trie<T> {
  public children = new Map<string, Trie<T>>();
  public data?: T;

  /* eslint-disable no-unused-vars */
  public constructor(
    public readonly parent: Trie<T> | null = null,
    public readonly fullString = "",
  ) {
    /* nop */
  }
  /* eslint-enable no-unused-vars */

  public ensureChild(char: string): Trie<T> {
    const child = this.children.get(char);
    if (child) {
      return child;
    }

    const newChild = new Trie<T>(this, this.fullString + char);
    this.children.set(char, newChild);
    return newChild;
  }

  public addChild(name: string, value: T): Trie<T> {
    if (name.length === 0) {
      this.data = value;
      return this;
    }

    if (name.length === 1) {
      return this.ensureChild(name).addChild("", value);
    }

    const [first, rest] = splitAt(name, 1);

    return this.ensureChild(first).addChild(rest, value);
  }

  public get(name: string): Trie<T> | undefined {
    if (name.length === 0) {
      return this;
    }

    if (name.length === 1) {
      return this.children.get(name);
    }

    log.debug("trie traverse", `"${name[0]}"`, `"${name.substring(1)}"`);
    if (name.startsWith(" ") && !this.children.get(" ")) {
      return this.get(name.substring(1));
    }
    return this.children.get(name[0]!)?.get(name.substring(1));
  }

  public getFurthestWithData(name: string): [number, Trie<T>] {
    if (name.length === 0) {
      return [0, this];
    }

    const [first, rest] = splitAt(name, 1);
    let [pos, node] = this.children.get(first)?.getFurthestWithData?.(rest) ?? [null, undefined];
    if (pos !== null && node) {
      pos += 1;
    }
    if (!node && first === " ") {
      [pos, node] = this.getFurthestWithData(rest);
      // only advance pos if parse succeeded with advance
      if (pos) pos += 1;
    }
    if (!node && this.data !== undefined) {
      [pos, node] = [0, this];
    }

    if (node?.data === undefined || pos === null) return [0, this];
    return [pos, node];
  }
}
