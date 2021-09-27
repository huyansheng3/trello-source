/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import moment from 'moment';

import { AddPopoverContext } from 'app/src/components/BoardCalendarView/AddPopoverContext';
import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';
import { ResizableContext } from 'app/src/components/BoardCalendarView/Resizable';
import {
  getDateAtMousePosition,
  getEventLevels,
  getEventSegments,
  isInRange,
  sortEvents,
} from 'app/src/components/BoardCalendarView/helpers';
import {
  EventData,
  EventSegment,
} from 'app/src/components/BoardCalendarView/types';

import { BackgroundCellWrapper } from './BackgroundCellWrapper';
import { DateLabel } from './DateLabel';
import { EventsRow } from './EventsRow';
import { ExtraEventsRow } from './ExtraEventsRow';
import { AllDayWrapperProps } from './types';

import styles from './AllDayEventsSection.less';

interface AllDayEventsSectionProps {
  dateRange: Date[];
  events: EventData[];
  selectedDate: Date;
  preventShadeOffRange?: boolean;
  isFirstRow?: boolean;
  className?: string;
  defaultMaxLevels?: number;
  wrapperComponent?: React.ComponentType<AllDayWrapperProps>;
  isRenderingSingleDay?: boolean;
}

export const AllDayEventsSection: React.FC<AllDayEventsSectionProps> = ({
  dateRange,
  events,
  selectedDate,
  preventShadeOffRange,
  isFirstRow,
  defaultMaxLevels = 6,
  className,
  wrapperComponent,
  isRenderingSingleDay,
}) => {
  const [maxLevels, updateMaxLevels] = useState(defaultMaxLevels);

  useEffect(() => {
    updateMaxLevels(defaultMaxLevels);
  }, [dateRange, defaultMaxLevels]);

  const handleShowMore = useCallback(() => {
    updateMaxLevels(Infinity);
  }, []);

  const { draggableState } = useContext(DraggableContext),
    { isDragging, originalSlotIsMultiDay } = draggableState;

  const { resizableState } = useContext(ResizableContext),
    { highlightedDateRange, isResizing, resizedEventData } = resizableState,
    { start, end } = highlightedDateRange;

  const dateRangeStart = dateRange[0];

  let resizePreviewSegment: EventSegment | undefined;
  const originalEvent = resizedEventData?.originalEvent as EventData;
  if (
    isResizing &&
    resizedEventData?.originalEvent &&
    start &&
    end &&
    (isInRange({ start, end }, dateRange[0], dateRange[6]) ||
      isInRange(
        {
          start: originalEvent.start,
          end: originalEvent.end,
        },
        dateRange[0],
        dateRange[6],
      ))
  ) {
    resizePreviewSegment = getEventSegments(
      [{ ...originalEvent, start, end }],
      dateRange,
    )[0];
  }

  const [levels, extra] = useMemo(() => {
    return getEventLevels(
      events.sort(sortEvents),
      dateRange,
      maxLevels - 1,
      resizePreviewSegment,
    );
  }, [events, dateRange, maxLevels, resizePreviewSegment]);

  const dateRangeLength = dateRange.length,
    dateRangeStartTime = dateRangeStart.getTime();

  const { hasAddPermission, openPopoverFromMousePosition } = useContext(
    AddPopoverContext,
  );
  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (weekRowRef.current && hasAddPermission) {
        const { clientX, clientY } = e;

        const date = getDateAtMousePosition(
          clientX,
          weekRowRef.current,
          {
            dateRangeLength,
            dateRangeStartTime: dateRangeStartTime,
          },
          true,
        );

        const current = moment();
        const dueTime = moment(date).set({
          hour: current.get('hour'),
          minute: current.get('minute'),
          second: 0,
          millisecond: 0,
        });

        openPopoverFromMousePosition(
          { top: clientY, left: clientX },
          dueTime.valueOf(),
        );
      }
    },
    [
      hasAddPermission,
      dateRangeLength,
      dateRangeStartTime,
      openPopoverFromMousePosition,
    ],
  );

  const weekRowRef = useRef<HTMLDivElement>(null);

  const content = (
    <div
      className={cx(
        className,
        styles.allDaySectionContainer,
        isDragging && !originalSlotIsMultiDay && styles.preventCursor,
      )}
      ref={weekRowRef}
      data-date-range
      data-date-range-start={dateRangeStart.getTime()}
      data-date-range-length={dateRange.length}
      data-date-range-all-day={true}
      onDoubleClick={onDoubleClick}
    >
      <div className={styles.allDaySectionBackgroundCells}>
        {dateRange.map((date, idx) => (
          <BackgroundCellWrapper
            key={idx}
            className={styles.dayBackground}
            date={date}
            selectedDate={selectedDate}
            preventShadeOffRange={preventShadeOffRange}
            preventTodayHighlight={isFirstRow}
            preventShadedBgs={isRenderingSingleDay}
          />
        ))}
      </div>
      <div className={styles.allDaySectionContent}>
        <div
          className={cx(
            styles.dateHeaderContainer,
            isFirstRow && styles.noTopPadding,
          )}
        >
          {dateRange.map((date, index) => (
            <div className={styles.dateHeaderChild} key={index}>
              <DateLabel
                date={date}
                className={cx(isRenderingSingleDay && styles.singleDay)}
                hideMonth={isRenderingSingleDay}
                disableTodayColor={isRenderingSingleDay}
              />
            </div>
          ))}
        </div>
        {levels.map((segments: EventSegment[], idx: number) => (
          <EventsRow
            key={idx}
            segments={segments}
            totalSlots={dateRange.length}
            preventEventEdit={isRenderingSingleDay}
          />
        ))}
        {!!extra.length && (
          <ExtraEventsRow
            segments={extra}
            onShowMore={handleShowMore}
            totalSlots={7}
          />
        )}
      </div>
    </div>
  );

  if (wrapperComponent) {
    const Wrapper = wrapperComponent;

    return (
      <Wrapper
        selectedDate={selectedDate}
        dateRange={dateRange}
        numLevels={levels.length}
      >
        {content}
      </Wrapper>
    );
  }
  return content;
};
