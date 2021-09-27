import { makeLocalUrl } from './makeLocalUrl';
import { isShortId } from '@trello/shortlinks';
import { makeSlug } from './makeSlug';

const getCardUrlWithoutModels = function (
  idBoard: string,
  idCard: number | string | null,
  cardName: string,
) {
  if (idCard === null) {
    return null;
  } else if (isShortId(idCard)) {
    return `/card/${makeSlug(cardName)}/${idBoard}/${idCard}`;
  } else {
    return `/card/board/${makeSlug(cardName)}/${idBoard}/${idCard}`;
  }
};

export const getCardUrl = (
  card: {
    url?: string;
    idBoard?: string;
    idShort?: number;
    id: string | null;
    name?: string;
  },
  highlight?: string,
  replyToComment?: boolean,
) => {
  let baseUrl = '';

  if (card.url) {
    baseUrl = makeLocalUrl(card.url);
  } else {
    baseUrl =
      getCardUrlWithoutModels(
        card.idBoard || '',
        card.idShort || card.id,
        card.name || '',
      ) || '';
  }

  if (replyToComment) {
    return `${baseUrl}?replyToComment=${replyToComment}`;
  } else if (highlight) {
    return `${baseUrl}#${highlight}`;
  } else {
    return baseUrl;
  }
};
