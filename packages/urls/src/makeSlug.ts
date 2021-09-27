const removeAccents = (s: string) => {
  return s
    .replace(/[àáâãäåāăą]/g, 'a')
    .replace(/æ/g, 'ae')
    .replace(/[çćĉċč]/g, 'c')
    .replace(/[ďđ]/g, 'd')
    .replace(/[èéêëēĕėęě]/g, 'e')
    .replace(/[ĝğġģ]/g, 'g')
    .replace(/[ĥħ]/g, 'h')
    .replace(/[ìíîïĩīĭįı]/g, 'i')
    .replace(/[ñńņňŉŋ]/g, 'n')
    .replace(/[òóôõöōŏő]/g, 'o')
    .replace(/œ/g, 'oe')
    .replace(/ř/g, 'r')
    .replace(/[śŝşš]/g, 's')
    .replace(/ß/g, 'ss')
    .replace(/[ùúûüũūŭůűų]/g, 'u')
    .replace(/[ýÿ]/g, 'y');
};

const isPunctuation = (symbol: string) => {
  const code = symbol.charCodeAt(0);
  return (
    // control chars and ASCII punctuation
    // before number, including nul, !"#&{},/
    (code >= 0x0000 && code <= 0x002f) ||
    // ASCII between numbers and uppercase letters, including :;<=>?
    (code >= 0x003a && code <= 0x0040) ||
    // ASCII between uppercase and lowercase letters, including []\^_
    (code >= 0x005b && code <= 0x0060) ||
    // ASCII after lowercase letters, including {}|~
    (code >= 0x007b && code <= 0x007f) ||
    // C1 controls and Latin-1 supplement, including £¥©«¼¶, and ÷
    (code >= 0x0080 && code <= 0x00bf) ||
    code === 0x00f7 ||
    // unicode general punctuation block
    (code >= 0x2000 && code <= 0x206f) ||
    // unicode supplemental punctuation block
    (code >= 0x2e00 && code <= 0x2e7f)
  );
};

const removePunctuation = (s: string, ignored: string) =>
  Array.from(s).reduce((buffer, symbol) => {
    if (symbol === ignored || !isPunctuation(symbol)) {
      buffer += symbol;
    }
    return buffer;
  }, '');

export const makeSlug = (s: string | null, sep: string = '-') => {
  if (!s || s.length === 0) {
    return sep;
  }

  let slug;

  slug = s.toLowerCase();
  slug = slug.replace(new RegExp(`[\\s\\\\/—–…]+`, 'g'), sep);
  slug = removeAccents(slug);
  slug = removePunctuation(slug, sep);
  // remove runs of separators
  slug = slug.replace(new RegExp(`${sep}{2,}`, 'g'), sep);

  // we can't truncate the slug by calling .substr(0, 128) because substr does
  // not handle astral symbols properly. Javascript represents astral symbols as
  // as surrogate pairs, and it exposes the separate surrogate halves as
  // separate characters. If you try to call encodeURIComponent on just a
  // surrogate half it will throw a URIError
  const symbols = Array.from(slug);
  if (symbols.length > 128) {
    slug = symbols.slice(0, 128).join('');
  }

  // the slice might leave a trailing separator
  slug = slug.replace(new RegExp(`^${sep}|${sep}$`, 'g'), '');
  if (!slug) {
    slug = '';
  }

  return slug || sep;
};
