/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { NotificationTestIds } from '@trello/test-ids';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import React from 'react';

import styles from './NotificationEmptyState.less';

const format = forTemplate('notification');

interface NotificationEmptyStateProps {
  onClickViewAll?: () => void;
  isShowAll?: boolean;
  visible: boolean;
  testId?: NotificationTestIds;
}

export const NotificationEmptyState: React.FunctionComponent<NotificationEmptyStateProps> = ({
  onClickViewAll,
  isShowAll,
  visible,
}) => (
  <div
    className={classNames(styles.notificationEmptyState, {
      [styles.visible]: visible,
      [styles.hidden]: !visible,
    })}
    data-test-id={
      visible
        ? NotificationTestIds.NotificationsEmptyState
        : NotificationTestIds.NotificationsEmptyStateHidden
    }
  >
    <img
      className={styles.tacoSleep}
      alt="Taco"
      src={require('resources/images/taco-sleep.svg')}
    />
    <div>
      <h3>
        {isShowAll
          ? format('no-notifications')
          : format('no-unread-notifications')}
      </h3>
      <p
        className={classNames({ [styles.hidden]: isShowAll })}
        onClick={onClickViewAll}
      >
        {format('click-show-all-to-view-all', {
          showAll: (
            <span key="view-all" className={styles.viewAll}>
              {format('view-all')}
            </span>
          ),
        })}
      </p>
    </div>
  </div>
);
