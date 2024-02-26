import _ from "lodash";

export abstract class Parser {
  public abstract name: string;
  public abstract canParse(_name: string): boolean;
  public abstract canParse(_name: string, _previous: Result): boolean;
  public abstract parse(_name: string): Result;
  public abstract parse(_name: string, _previous: Result): Result;
  public async init(): Promise<void> {
    /* nop */
  }
}

export interface Result {
  title: string[];
  team: string[];
  episode: string[];
  source_team: string[];
  source_type: string[];
  resolution: string[];
  subtitle_language: string[];
  file_type: string[];
  video_type: string[];
  audio_type: string[];
  link: string[];
  errors: string[];
  applied_parsers: string[];
}

export const getEmptyResult = (): Result =>
  _.cloneDeep({
    title: [],
    team: [],
    episode: [],
    source_team: [],
    source_type: [],
    resolution: [],
    subtitle_language: [],
    file_type: [],
    video_type: [],
    audio_type: [],
    link: [],
    errors: [],
    applied_parsers: [],
  });

export const chainedParse = (parsers: Parser[], name: string): Result => {
  const normalizedName = name.replace(/\s\s+/g, " ");
  let result = getEmptyResult();
  for (const parser of parsers) {
    if (parser.canParse(normalizedName, result)) {
      result.applied_parsers.push(parser.name);
      result = parser.parse(normalizedName, result);
    }
  }
  for (const key in result) {
    result[key as keyof Result] = _.uniq(result[key as keyof Result]);
  }
  return result;
};
