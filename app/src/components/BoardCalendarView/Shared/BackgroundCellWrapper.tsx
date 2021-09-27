import React, { useContext, useEffect, useRef } from 'react';
import moment from 'moment';
import cx from 'classnames';

import { isDateToday, isWeekend } from '@trello/dates';
import { CalendarViewTestIds } from '@trello/test-ids';

import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';
import { ResizableContext } from 'app/src/components/BoardCalendarView/Resizable';

import styles from './BackgroundCellWrapper.less';

interface BackgroundCellWrapperProps {
  className?: string;
  date: Date;
  selectedDate: Date;
  isHourSlotCell?: boolean;
  preventShadeOffRange?: boolean;
  preventTodayHighlight?: boolean;
  preventShadedBgs?: boolean;
}

export const BackgroundCellWrapper: React.FC<BackgroundCellWrapperProps> = ({
  className,
  date,
  selectedDate,
  children,
  isHourSlotCell,
  preventShadeOffRange,
  preventTodayHighlight,
  preventShadedBgs,
}) => {
  const extraClassNames = [];

  const { draggableState } = useContext(DraggableContext),
    { isDragging } = draggableState;

  const { resizableState } = useContext(ResizableContext),
    { isResizing } = resizableState;

  let currentSlotIsMultiDay = false,
    highlightedDateRange: { start: Date | null; end: Date | null } = {
      start: null,
      end: null,
    },
    currentSlot = null;

  if (isDragging) {
    currentSlotIsMultiDay = !!draggableState.currentSlotIsMultiDay;
    highlightedDateRange = draggableState.highlightedDateRange;
    currentSlot = draggableState.currentSlot;
  } else if (isResizing) {
    currentSlotIsMultiDay = true;
    highlightedDateRange = resizableState.highlightedDateRange;
    currentSlot = resizableState.currentSlot;
  }

  const { start, end } = highlightedDateRange;

  if (!preventShadedBgs) {
    if (isDateToday(date)) {
      extraClassNames.push(styles.isTodayBg);
      if (!isHourSlotCell && !preventTodayHighlight) {
        extraClassNames.push(styles.isTodayHighlight);
      }
    } else if (isWeekend(date)) {
      extraClassNames.push(styles.isWeekendBg);
    } else if (
      !preventShadeOffRange &&
      selectedDate.getMonth() !== date.getMonth()
    ) {
      extraClassNames.push(styles.isOffRangeBg);
    }
  }

  if (isDragging) {
    if (currentSlotIsMultiDay) {
      if (
        !isHourSlotCell &&
        start &&
        end &&
        moment(date).isBetween(start, end, 'day', '[]')
      ) {
        extraClassNames.push(styles.isHighlightedBg);
      } else {
        extraClassNames.push(styles.regularBg);
      }
    } else {
      if (isHourSlotCell && currentSlot && moment(currentSlot).isSame(date)) {
        extraClassNames.push(styles.isHighlightedBg);
      } else {
        extraClassNames.push(styles.regularBg);
      }
    }
  }

  // This is a bit of a convoluted way of ensuring that we
  // only show the background transition when we first begin
  // the drag, and that the background doesn't transition
  // while we're changing which date slots we're hovering over
  const shouldNotTransition = useRef(false);
  useEffect(() => {
    if (isDragging) {
      setTimeout(() => {
        shouldNotTransition.current = true;
      }, 500);
    } else {
      shouldNotTransition.current = false;
    }
  }, [isDragging]);

  return (
    <div
      className={cx(
        className,
        styles.backgroundCellWrapper,
        extraClassNames,
        isDragging && !shouldNotTransition.current && styles.transition,
      )}
      data-test-id={CalendarViewTestIds.BackgroundCellWrapper}
    >
      {children}
    </div>
  );
};
