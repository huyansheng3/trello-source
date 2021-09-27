export const isTrelloUrl = (
  url: string,
  overrideTrelloHost: string = location.host,
): boolean => {
  try {
    return new URL(url).host === overrideTrelloHost;
  } catch (e) {
    return false;
  }
};
