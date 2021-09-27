import { NotificationModel } from 'app/gamma/src/types/models';

import { isCommentLike } from './isCommentLike';

export const shouldGenerateActionLink = ({
  type,
  data,
}: Pick<NotificationModel, 'type' | 'data'>) =>
  isCommentLike({ type, data }) ||
  (type &&
    [
      'changeCard',
      'createdCard',
      'addAttachmentToCard',
      'addedToCard',
      'removedFromCard',
      'cardDueSoon',
    ].includes(type));
