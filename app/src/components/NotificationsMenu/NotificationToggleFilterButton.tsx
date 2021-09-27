import { NotificationTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
import React, { useCallback, FunctionComponent } from 'react';

// eslint-disable-next-line @trello/less-matches-component
import styles from './NotificationsMenu.less';
import { useSharedState } from '@trello/shared-state';
import { notificationsMenuState } from './notificationsMenuState';
import { Analytics } from '@trello/atlassian-analytics';

const formatNotificationList = forTemplate('header_notification_list_menu');

const trackFilterChangeEvent = (verb: 'show-unread' | 'show-all') => {
  Analytics.sendClickedButtonEvent({
    buttonName: 'notificationsToggleFilterButton',
    source: 'notificationsInlineDialog',
    attributes: {
      filter: verb,
    },
  });
};

export const NotificationToggleFilterButton: FunctionComponent = () => {
  const [{ visibilityFilter }, setState] = useSharedState(
    notificationsMenuState,
  );

  const isFilteringByUnread = visibilityFilter === 'VISIBILITY_UNREAD';

  const filterByUnreadNotifications = useCallback(() => {
    setState({
      visibilityFilter: 'VISIBILITY_UNREAD',
    });
    trackFilterChangeEvent('show-unread');
  }, [setState]);

  const viewAllNotifications = useCallback(() => {
    setState({
      visibilityFilter: 'VISIBILITY_ALL',
    });
    trackFilterChangeEvent('show-all');
  }, [setState]);

  return (
    <button
      className={styles.notificationAction}
      onClick={
        isFilteringByUnread ? viewAllNotifications : filterByUnreadNotifications
      }
      data-test-id={
        isFilteringByUnread
          ? NotificationTestIds.ViewAll
          : NotificationTestIds.FilterByUnread
      }
    >
      {isFilteringByUnread
        ? formatNotificationList('visibility-filter-all')
        : formatNotificationList('visibility-filter-unread')}
    </button>
  );
};
