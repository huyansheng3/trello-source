import { NotificationGroupModel } from 'app/gamma/src/types/models';
import { setNotificationsInGroupRead } from './setNotificationsInGroupRead';

export const setNotificationsInGroupsRead = (
  notificationGroups: NotificationGroupModel[],
  read: boolean,
  id?: string | string[],
  notificationsIds?: string[],
) =>
  notificationGroups.map((notificationGroup) =>
    id === undefined ||
    (typeof id === 'string' && notificationGroup.id === id) ||
    (Array.isArray(id) && id.includes(notificationGroup.id))
      ? setNotificationsInGroupRead(notificationGroup, read, notificationsIds)
      : notificationGroup,
  );
