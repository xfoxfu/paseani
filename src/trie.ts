import log from "loglevel";

export class Trie<T> {
  public children = new Map<string, Trie<T>>();
  public data: T | null = null;

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

    return this.ensureChild(name[0]!).addChild(name.substring(1), value);
  }

  public get(name: string): Trie<T> | null {
    if (name.length === 0) {
      return this;
    }

    if (name.length === 1) {
      return this.children.get(name) ?? null;
    }

    log.trace("trie traverse", name[0], name.substring(1));
    return this.children.get(name[0]!)?.get(name.substring(1)) ?? null;
  }
}
