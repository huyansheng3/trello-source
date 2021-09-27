const urlEncode = (str: string): string => {
  type specialChars = '!' | "'" | '(' | ')' | '~' | '%20' | '%00';
  const specialCharsMap: { [key in specialChars]: string } = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00',
  };

  return encodeURIComponent(str).replace(
    /[!'()~]|%20|%00/g,
    (match: string): string => specialCharsMap[match as specialChars],
  );
};

/*
 * MS EdgeHTML 17 does not properly encode URLSearchParams if they include a space
 * character. Due to this, URL::toString() may throw. Catch for this here and
 * build up the url string manually.
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/17865834/
 */
export const urlToString = (url: URL): string => {
  try {
    return url.toString();
  } catch (e) {
    const search = [...url.searchParams.entries()]
      .map(([key, value]) => `${urlEncode(key)}=${urlEncode(value)}`)
      .join('&');

    return `${url.protocol}//${url.host}${url.pathname}?${search}`;
  }
};
