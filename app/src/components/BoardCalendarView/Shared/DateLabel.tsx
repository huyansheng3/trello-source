import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import { isDateToday } from '@trello/dates';

import { Dates } from 'app/scripts/lib/dates';

import styles from './DateLabel.less';

interface DateLabelProps {
  date: Date;
  hideMonth?: boolean;
  disableTodayColor?: boolean;
  className?: string;
}

export const DateLabel: React.FC<DateLabelProps> = ({
  date,
  hideMonth,
  disableTodayColor,
  className,
}) => {
  return (
    <div
      className={cx(
        styles.dateHeader,
        !disableTodayColor && isDateToday(date) && styles.isToday,
        className,
      )}
    >
      {!hideMonth && Dates.isFirstOfMonth(date) && moment(date).format('MMM')}{' '}
      {moment(date).format('D')}
    </div>
  );
};
