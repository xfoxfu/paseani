import * as OpenCC from "opencc-js";

export const splitAt = (value: string, index: number): [string, string] => {
  return [value.substring(0, index), value.substring(index)];
};

const opencc = OpenCC.Converter({ from: "t", to: "cn" });

const FULL_TO_HALF = {
  "！": "!",
  "＂": '"',
  "＃": "#",
  "＄": "$",
  "％": "%",
  "＆": "&",
  "＇": "'",
  "（": "(",
  "）": ")",
  "＊": "*",
  "＋": "+",
  "，": ",",
  "－": "-",
  "．": ".",
  "／": "/",
  "：": ":",
  "；": ";",
  "＜": "<",
  "＝": "=",
  "＞": ">",
  "？": "?",
  "＠": "@",
  "［": "[",
  "【": "[",
  "＼": "\\",
  "］": "]",
  "】": "]",
  "＾": "^",
  "＿": "_",
  "｀": "`",
  "｛": "{",
  "｜": "|",
  "｝": "}",
  "～": "~",
};

export const normalize = (name: string): string => {
  let norm = opencc(name).toLowerCase();
  for (const [from, to] of Object.entries(FULL_TO_HALF)) {
    norm = norm.replaceAll(from, to);
  }
  return norm;
};
