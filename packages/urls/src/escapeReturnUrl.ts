export const escapeReturnUrl = (url: string) =>
  encodeURIComponent(url.replace(/^https?:\/\/[^/]+/, ''));
