import { NotificationModel } from 'app/gamma/src/types/models';

import { isCommentLike } from './isCommentLike';

export const getActionHash = ({
  type,
  data,
  idAction,
}: Pick<NotificationModel, 'type' | 'data' | 'idAction'>) => {
  if (idAction) {
    if (isCommentLike({ type, data })) {
      return `comment-${idAction}`;
    }
    return `action-${idAction}`;
  }

  return '';
};
