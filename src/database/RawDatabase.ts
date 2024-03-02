import { Data } from "./index.js";

export abstract class RawDatabase {
  public abstract name: string;
  public abstract list(): AsyncIterable<Data>;
  public update(): Promise<void> {
    return Promise.resolve();
  }
}
