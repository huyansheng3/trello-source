import React, { useCallback, useContext, useState } from 'react';
import cx from 'classnames';

import { isWeekend } from '@trello/dates';

import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';
import {
  AllDayWrapperProps,
  ExpandButton,
  WithDateHeaders,
} from 'app/src/components/BoardCalendarView/Shared';

import styles from './WeekAllDayWrapper.less';

export const WeekAllDayWrapper: React.FC<AllDayWrapperProps> = ({
  selectedDate,
  dateRange,
  numLevels,
  children,
}) => {
  const { draggableState } = useContext(DraggableContext);

  const [expanded, updateExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    updateExpanded((prevValue) => !prevValue);
  }, [updateExpanded]);

  const firstDayIsNotWeekend = !isWeekend(dateRange[0]);

  return (
    <div
      className={cx(
        styles.weekAllDayWrapper,
        !!numLevels && numLevels > 0 && styles.showShadow,
        expanded && styles.expanded,
      )}
    >
      <WithDateHeaders
        selectedDate={selectedDate}
        dates={dateRange}
        preventShadeOffRange={true}
        renderHeaderGutter={true}
        renderFixedHeaderDate={true}
      >
        <div className={styles.flexContainer}>
          <div
            className={cx(
              styles.weekGutter,
              firstDayIsNotWeekend && styles.normalBgColor,
              draggableState.isDragging && styles.normalBgColorWithTransition,
            )}
          >
            {!!numLevels && numLevels > 2 && (
              <ExpandButton expanded={expanded} handleExpand={handleExpand} />
            )}
          </div>
          {children}
        </div>
      </WithDateHeaders>
    </div>
  );
};
