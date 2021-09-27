import { makeSlug } from './makeSlug';

export const boardUrlFromShortLink = (shortLink: string, name: string) => {
  const nameSlug = name ? `/${makeSlug(name)}` : '';

  return `/b/${shortLink}${nameSlug}`;
};
