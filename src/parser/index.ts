import _ from "lodash";

export abstract class Parser {
  public abstract name: string;
  public abstract canParse(_name: string): boolean;
  public abstract parse(_name: string, _previous: Result): Result;
  public async init(): Promise<void> {}
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
