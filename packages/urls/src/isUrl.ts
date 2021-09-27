export const isUrl = (text: string): boolean =>
  // Must start with an http/https protocol
  // Can't contain any whitespace
  /^https?:\/\/\S+$/.test(text);
