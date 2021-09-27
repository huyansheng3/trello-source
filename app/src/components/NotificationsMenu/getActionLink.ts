import { getCardUrl } from '@trello/urls';

import { CardModel, NotificationModel } from 'app/gamma/src/types/models';

import { shouldGenerateActionLink } from './shouldGenerateActionLink';
import { getActionHash } from './getActionHash';
import { getNotificationCardShortUrl } from './getNotificationCardShortUrl';

export const getActionLink = function (
  notification: Pick<NotificationModel, 'type' | 'data' | 'idAction'>,
  card?: CardModel,
) {
  if (shouldGenerateActionLink(notification)) {
    const actionHash = getActionHash(notification);

    if (card && card.url) {
      return getCardUrl(card, actionHash);
    } else if (notification.data && notification.data.card) {
      return `${getNotificationCardShortUrl(notification.data)}#${actionHash}`;
    }
  }
};
