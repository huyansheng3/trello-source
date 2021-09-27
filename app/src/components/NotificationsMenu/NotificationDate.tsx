import React from 'react';

import classNames from 'classnames';
import { getDateDeltaString } from '@trello/dates';

import styles from './NotificationDate.less';

interface NotificationDateProps {
  date: Date;
  className?: string;
}

export const NotificationDate: React.FunctionComponent<NotificationDateProps> = ({
  date,
  className,
}) => {
  return (
    <span className={classNames(styles.notificationDate, className)}>
      {'\xa0 '}
      {getDateDeltaString(date, new Date())}
    </span>
  );
};
