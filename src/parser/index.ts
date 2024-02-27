import _ from "lodash";

export abstract class Parser {
  public abstract name: string;
  public abstract canParse(_name: string, _builder: ResultBuilder): boolean;
  protected abstract rawParse(_name: string, _builder: ResultBuilder): void;
  public parse(name: string, builder: ResultBuilder = new ResultBuilder()): ResultBuilder {
    builder.withParser(this.name);
    this.rawParse(name, builder);
    return builder;
  }
  public async init(): Promise<void> {
    /* nop */
  }
}

export interface Tag {
  type: TagType;
  value: string;
  parser: string;
}

export interface ParseError {
  message: string;
  parser: string;
}

export interface Result {
  tags: Tag[];
  errors: ParseError[];
}

export enum TagType {
  title = "title",
  team = "team",
  episode = "episode",
  source_team = "source_team",
  source_type = "source_type",
  resolution = "resolution",
  subtitle_language = "subtitle_language",
  file_type = "file_type",
  video_type = "video_type",
  audio_type = "audio_type",
  link = "link",
  unknown = "unknown",
}

export class ResultBuilder {
  public readonly tags: Tag[] = [];
  public readonly errors: ParseError[] = [];
  public readonly appliedParsers: string[] = [];
  public parser = "";

  public withParser(parser: string): typeof this {
    this.parser = parser;
    this.appliedParsers.push(parser);
    return this;
  }

  public addTag(type: TagType, value: string): typeof this {
    this.tags.push({ type, value, parser: this.parser });
    return this;
  }

  public addTags(type: TagType, ...values: string[]): typeof this {
    this.tags.push(...values.map((value) => ({ type, value, parser: this.parser })));
    return this;
  }

  public addError(message: string): typeof this {
    this.errors.push({ message, parser: this.parser });
    return this;
  }

  public build(): Result {
    const tags = _.uniqBy(this.tags, (t) => `${t.type}:${t.value}:${t.parser}`);
    return { tags, errors: this.errors };
  }
}

export const chainedParse = (parsers: Parser[], name: string): Result => {
  const normalizedName = name.replace(/\s\s+/g, " ");
  const result = new ResultBuilder();
  for (const parser of parsers) {
    if (parser.canParse(normalizedName, result)) {
      result.appliedParsers.push(parser.name);
      parser.parse(normalizedName, result);
    }
  }
  return result.build();
};
