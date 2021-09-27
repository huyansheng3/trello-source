import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import { isDateToday } from '@trello/dates';

import styles from './DayOfWeekLabel.less';

interface DayOfWeekLabelProps {
  date: Date;
  fixed?: boolean;
}

export const DayOfWeekLabel: React.FC<DayOfWeekLabelProps> = ({
  date,
  fixed,
}) => {
  return (
    <div
      className={cx(
        !fixed && isDateToday(date) && styles.isToday,
        styles.dayOfWeekLabel,
      )}
    >
      {moment(date).format('ddd')}
    </div>
  );
};
