import React, { useCallback, useContext } from 'react';
import moment from 'moment';
import cx from 'classnames';

import { CalendarViewTestIds } from '@trello/test-ids';

import { AddPopoverContext } from 'app/src/components/BoardCalendarView/AddPopoverContext';

import { sortEvents } from 'app/src/components/BoardCalendarView/helpers';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import { BackgroundCellWrapper } from './BackgroundCellWrapper';
import { EditableCalendarEvent } from './EditableCalendarEvent';

import styles from './HourCell.less';

interface HourCellProps {
  date: Date;
  eventsForTheHour: EventData[];
  selectedDate: Date;
  currentTime: Date;
  isFirstRow?: boolean;
  cellClassName?: string;
  isRenderingSingleDay?: boolean;
}

export const HourCell: React.FC<HourCellProps> = ({
  date,
  eventsForTheHour,
  selectedDate,
  currentTime,
  cellClassName,
  isRenderingSingleDay,
}) => {
  eventsForTheHour.sort((eventA, eventB) => sortEvents(eventA, eventB, true));

  const { hasAddPermission, openPopoverFromMousePosition } = useContext(
    AddPopoverContext,
  );

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasAddPermission) {
        const { clientX, clientY } = e;

        openPopoverFromMousePosition(
          { top: clientY, left: clientX },
          date.getTime(),
        );
      }
    },
    [date, hasAddPermission, openPopoverFromMousePosition],
  );

  return (
    <BackgroundCellWrapper
      className={styles.flexContainer}
      date={date}
      selectedDate={selectedDate}
      isHourSlotCell={true}
      preventShadeOffRange={true}
      preventShadedBgs={isRenderingSingleDay}
    >
      <div
        className={cx(
          styles.flexContainer,
          styles.hourCellContainer,
          cellClassName,
        )}
        data-date-range
        data-date-range-start={date.getTime()}
        data-date-range-length={1}
        onDoubleClick={onDoubleClick}
      >
        {eventsForTheHour.map((event, index) => (
          <EditableCalendarEvent
            key={event.data.id}
            event={event}
            resizable={false}
            useMiniCardDrag={isRenderingSingleDay}
          />
        ))}
      </div>
      {moment(currentTime).isSame(date, 'hour') && (
        <>
          <div
            className={styles.currentTimeLine}
            style={{
              top: `calc(${(currentTime.getMinutes() / 60) * 100}% - 1px)`,
            }}
            data-test-id={CalendarViewTestIds.CurrentTimeLine}
          />
          <div
            className={styles.currentTimeDot}
            style={{
              top: `calc(${(currentTime.getMinutes() / 60) * 100}% - 0.5em)`,
            }}
            data-test-id={CalendarViewTestIds.CurrentTimeDot}
          />
        </>
      )}
    </BackgroundCellWrapper>
  );
};
