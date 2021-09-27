import { difference, filter, last } from 'underscore';

import { NotificationModel } from 'app/gamma/src/types/models';

export interface ArchiveObject {
  active: NotificationModel[];
  archive: NotificationModel[];
}

export const mapNotificationsToArchive = (
  notifications: NotificationModel[],
): ArchiveObject => {
  let { active, archive } = notifications.reduce<ArchiveObject>(
    (acc, notification) => {
      if (notification.unread) {
        acc.active.push(notification);
      } else {
        acc.archive.push(notification);
      }

      return acc;
    },
    { active: [], archive: [] },
  );

  if (!active.length && archive.length) {
    const lastDateRead = last(archive)!.dateRead;
    if (lastDateRead) {
      active = filter(
        archive,
        (notification) =>
          (notification.dateRead || '').toString() === lastDateRead.toString(),
      );
    } else {
      active = last(archive, 1);
    }
    archive = difference(archive, active);
  }

  return { active, archive };
};
