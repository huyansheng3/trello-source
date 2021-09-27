export const makeLocalUrl = (url: string) =>
  url.replace(/^[a-z]+:\/\/[^/]+/, '');
