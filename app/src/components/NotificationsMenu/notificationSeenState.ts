/* eslint-disable @trello/disallow-filenames, @trello/export-matches-filename */
import { TrelloStorage } from '@trello/storage';
import { NotificationsCountModel } from 'app/gamma/src/types/models';
import { memberId } from '@trello/session-cookie';

const NOTIFICATION_SEEN_STATE_KEY_PREFIX = 'NotificationsSeenState';

export interface NotificationSeenState {
  lastSeenNotificationGroup: NotificationsCountModel;
}

const initialState: NotificationSeenState = {
  lastSeenNotificationGroup: {},
};

export const getNotificationSeenStateKey = () => {
  return `${NOTIFICATION_SEEN_STATE_KEY_PREFIX}-${memberId}`;
};

export const getNotificationSeenStateGroupCount = (): NotificationsCountModel => {
  if (!TrelloStorage.isEnabled() || !memberId) {
    return initialState.lastSeenNotificationGroup;
  }

  const key = getNotificationSeenStateKey();
  const notificationSeenState = TrelloStorage.get(key);

  if (!notificationSeenState) {
    TrelloStorage.set(key, initialState);

    return initialState.lastSeenNotificationGroup;
  }

  return notificationSeenState.lastSeenNotificationGroup;
};

// We take the current members NotificationsCountModel and
// store this in localstorage, this is expected to happen
// when the member opens the notification pane so whatever
// the count is at the time of opening the pane is their
// 'seen' notifications, which are then used to compare to
// their actual notification count (from the sever) to see
// if there are any notifications they haven't seen.
export const setNotificationSeenStateGroupCount = (
  value: NotificationsCountModel,
) => {
  if (!TrelloStorage.isEnabled() || !memberId) {
    return;
  }

  const key = getNotificationSeenStateKey();
  TrelloStorage.set(key, {
    ...(TrelloStorage.get(key) || initialState),
    lastSeenNotificationGroup: value,
  });
};
