import { NotificationModel } from 'app/gamma/src/types/models';

export const isCommentLike = ({
  type,
  data,
}: Pick<NotificationModel, 'type' | 'data'>): boolean => {
  if (!type) {
    return false;
  }

  return (
    ['commentCard', 'copyCommentCard', 'mentionedOnCard'].includes(type) ||
    (type === 'reactionAdded' && !!data && data.actionType === 'commentCard')
  );
};
