export abstract class Parser {
  public abstract name: string;
  public abstract canParse(name: string): boolean;
  public abstract parse(name: string, previous: Result): Result;
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
