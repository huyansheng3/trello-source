import React, { createRef, useContext, useEffect } from 'react';
import moment from 'moment';
import cx from 'classnames';

import { isWeekend } from '@trello/dates';

import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import { HourCell } from './HourCell';

import styles from './MultiDayHourRow.less';

interface MultiDayHourRowProps {
  hour: number;
  dateRange: Date[];
  eventsForTheRange: EventData[][];
  selectedDate: Date;
  currentTime: Date;
  isFirstRow?: boolean;
  isRenderingSingleDay?: boolean;
}

export const MultiDayHourRow: React.FC<MultiDayHourRowProps> = ({
  hour,
  dateRange,
  eventsForTheRange,
  selectedDate,
  currentTime,
  isFirstRow,
  isRenderingSingleDay,
}) => {
  const rowRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (rowRef.current && rowRef.current.parentNode && hour === 12) {
      const container = rowRef.current.parentNode as HTMLElement,
        containerHeight = container.clientHeight,
        rowHeight = rowRef.current.clientHeight,
        centerAdjustment = (containerHeight - rowHeight) / 2;

      // Can't use scrollIntoView because it messes up
      // the CSSTransition
      container.scrollTop = rowRef.current.offsetTop - centerAdjustment;
    }
    // We only want to scroll once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { draggableState } = useContext(DraggableContext),
    { isDragging, originalSlotIsMultiDay } = draggableState;

  return (
    <div
      className={cx(
        styles.multiDayHourRowContainer,
        isFirstRow && styles.isFirstRow,
        isDragging && originalSlotIsMultiDay && styles.preventCursor,
      )}
      ref={rowRef}
    >
      <div
        className={cx(
          styles.gutter,
          (!isWeekend(dateRange[0]) || isRenderingSingleDay) &&
            styles.normalBgColor,
          isDragging && styles.normalBgColorWithTransition,
        )}
      >
        <div
          className={cx(styles.gutterLabel, isFirstRow && styles.withMarginTop)}
        >
          {moment({ hours: hour }).format('h A').toString()}
        </div>
      </div>
      <div className={styles.dateRangeContainer}>
        {dateRange.map((date, index) => {
          const dateClone = new Date(date.getTime());
          dateClone.setHours(hour);

          return (
            <div className={styles.dateRangeUnit} key={index}>
              <HourCell
                date={dateClone}
                eventsForTheHour={eventsForTheRange[index]}
                selectedDate={selectedDate}
                currentTime={currentTime}
                cellClassName={cx(isFirstRow && styles.withPaddingTop)}
                isRenderingSingleDay={isRenderingSingleDay}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
