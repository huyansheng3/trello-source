import {
  NotificationGroupModel,
  NotificationModel,
} from 'app/gamma/src/types/models';

export const groupNotifications = (
  notifications: NotificationModel[],
): NotificationGroupModel[] =>
  Object.values(
    notifications.reduce(
      (groups: { [key: string]: NotificationGroupModel }, notification) => {
        const { data, id } = notification;
        const cardId = data && data.card && data.card.id;
        const prefix = cardId ? 'Card:' : 'Notification:';
        const normalizedId = (cardId || id).substring(id.indexOf(':') + 1);
        const groupId = prefix.concat(normalizedId);

        (
          groups[groupId] ||
          (groups[groupId] = {
            id: normalizedId,
            idGroup: groupId,
            notifications: [],
          })
        ).notifications.push(notification);

        return groups;
      },
      {},
    ),
  );
