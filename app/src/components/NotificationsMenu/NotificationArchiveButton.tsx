import classNames from 'classnames';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { forTemplate } from '@trello/i18n';
import React from 'react';

import styles from './NotificationArchiveButton.less';

const format = forTemplate('notification');

interface NotificationArchiveButtonProps {
  active?: boolean;
  simple?: boolean;
  onClick: () => void;
  duration?: number;
}

export const NotificationArchiveButton: React.FunctionComponent<NotificationArchiveButtonProps> = ({
  active = false,
  simple = false,
  onClick,
}) => (
  <Button
    appearance="link"
    className={classNames(styles.archiveButton, {
      [styles.active]: active,
    })}
    onClick={onClick}
    iconBefore={<DownIcon dangerous_className={styles.icon} />}
  >
    {simple
      ? format('hide')
      : active
      ? format('hide-previous-card-activity')
      : format('show-previous-card-activity')}
  </Button>
);
