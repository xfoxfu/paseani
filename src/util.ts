export const splitAt = (value: string, index: number): [string, string] => {
  return [value.substring(0, index), value.substring(index)];
};
