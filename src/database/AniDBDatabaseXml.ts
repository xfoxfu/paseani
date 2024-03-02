export type AniDBXml = Pokedex;

export interface Pokedex {
  "?xml": XML;
  "animetitles": Animetitles;
}

export interface XML {
  "@_version": string;
  "@_encoding": string;
}

export interface Animetitles {
  anime: Anime[];
}

export interface Anime {
  "title": TitleElement[] | PurpleTitle;
  "@_aid": string;
}

export interface TitleElement {
  "#text": number | string;
  "@_type": Type;
  "@_xml:lang": XMLLang;
}

export type Type = "short" | "official" | "syn" | "main" | "kana" | "card";

export type XMLLang =
  | "en"
  | "fr"
  | "pl"
  | "cs"
  | "x-jat"
  | "ru"
  | "ko"
  | "ja"
  | "zh-Hans"
  | "de"
  | "it"
  | "sv"
  | "es"
  | "pt"
  | "es-CA"
  | "zh-nan"
  | "hu"
  | "vi"
  | "tr"
  | "sl"
  | "pt-BR"
  | "lv"
  | "lt"
  | "hr"
  | "sk"
  | "fi"
  | "da"
  | "ro"
  | "et"
  | "el"
  | "mn"
  | "sr"
  | "bg"
  | "uk"
  | "he"
  | "ar"
  | "fa"
  | "zh-Hant"
  | "zh"
  | "th"
  | "es-419"
  | "es-GA"
  | "nl"
  | "tl"
  | "my"
  | "no"
  | "id"
  | "bd"
  | "x-zht"
  | "x-unk"
  | "x-kot"
  | "al"
  | "ur"
  | "ta"
  | "x-other"
  | "is"
  | "eo"
  | "hi"
  | "af"
  | "te"
  | "la"
  | "x-tht";

export interface PurpleTitle {
  "#text": string;
  "@_xml:lang": XMLLang;
  "@_type": Type;
}
