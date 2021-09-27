import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import {
  AllDayWrapperProps,
  ExpandButton,
} from 'app/src/components/BoardCalendarView/Shared';

import styles from './DayAllDayWrapper.less';

export const DayAllDayWrapper: React.FC<AllDayWrapperProps> = ({
  selectedDate,
  numLevels,
  children,
}) => {
  const [expanded, updateExpanded] = React.useState(false);

  const handleExpand = React.useCallback(() => {
    updateExpanded((prevValue) => !prevValue);
  }, [updateExpanded]);

  const showGutter = !!numLevels && numLevels > 2;

  return (
    <div
      className={cx(
        styles.dayAllDayWrapper,
        !!numLevels && numLevels > 0 && styles.showShadow,
        expanded && styles.expanded,
      )}
    >
      <div className={styles.scrollableContainer}>
        <div className={styles.flexContainer}>
          {showGutter && (
            <div className={cx(styles.dayGutter)}>
              <ExpandButton expanded={expanded} handleExpand={handleExpand} />
            </div>
          )}
          <div
            className={cx(
              styles.eventsSection,
              !showGutter && styles.withoutGutter,
            )}
          >
            <div className={styles.dayOfWeekLabel}>
              {moment(selectedDate).format('dddd')}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
