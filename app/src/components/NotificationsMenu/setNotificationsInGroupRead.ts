import { NotificationGroupModel } from 'app/gamma/src/types/models';

export const setNotificationsInGroupRead = (
  notificationGroup: NotificationGroupModel,
  read: boolean,
  notificationsIds?: string[],
) => ({
  ...notificationGroup,

  notifications: notificationGroup.notifications.map((notification) =>
    notificationsIds && !notificationsIds.includes(notification.id)
      ? notification
      : {
          ...notification,
          dateRead: read ? notification.dateRead || new Date() : null,
          unread: !read,
        },
  ),
});
