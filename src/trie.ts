export class Trie<T> {
  public children = new Map<string, Trie<T>>();
  public data: T | null = null;

  // eslint-disable-next-line no-unused-vars
  public constructor(public readonly fullString = "") {
    /* nop */
  }

  public ensureChild(char: string): Trie<T> {
    const child = this.children.get(char);
    if (child) {
      return child;
    }

    const newChild = new Trie<T>(this.fullString + char);
    this.children.set(char, newChild);
    return newChild;
  }

  public addChild(name: string, value: T) {
    if (name.length === 0) {
      this.data = value;
      return;
    }

    if (name.length === 1) {
      this.ensureChild(name).addChild("", value);
      return;
    }

    this.ensureChild(name[0]!).addChild(name.substring(1), value);
  }
}
