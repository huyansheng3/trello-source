import { ActionDataModel } from 'app/gamma/src/types/models';
import { makeSlug } from '@trello/urls';

export const getNotificationCardShortUrl = (data: ActionDataModel) => {
  const card = data.card;
  if (card) {
    return `/c/${card.shortLink}/${card.idShort}-${makeSlug(card.name || '')}`;
  } else {
    return '#';
  }
};
