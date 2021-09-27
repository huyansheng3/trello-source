import React, { useRef } from 'react';
import cx from 'classnames';

import { isWeekend } from '@trello/dates';

import { EventData } from 'app/src/components/BoardCalendarView/types';

import { MultiDayHourRow } from './MultiDayHourRow';
import { VerticalScrollContextProvider } from './VerticalScrollContext';

import styles from './HourlyEventsSection.less';

interface HourlyEventsSectionProps {
  dateRange: Date[];
  eventsByHour: EventData[][][];
  selectedDate: Date;
  currentTime: Date;
  isRenderingSingleDay?: boolean;
}

export const HourlyEventsSection: React.FC<HourlyEventsSectionProps> = ({
  dateRange,
  eventsByHour,
  selectedDate,
  currentTime,
  isRenderingSingleDay,
}) => {
  const firstDayIsNotWeekend = !isWeekend(dateRange[0]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className={styles.hourlyEventsSection} ref={scrollContainerRef}>
        <VerticalScrollContextProvider
          scrollContainer={scrollContainerRef.current}
        >
          {eventsByHour.map((eventsForTheRange, index) => {
            return (
              <MultiDayHourRow
                key={index}
                hour={index}
                dateRange={dateRange}
                eventsForTheRange={eventsForTheRange}
                selectedDate={selectedDate}
                currentTime={currentTime}
                isFirstRow={index === 0}
                isRenderingSingleDay={isRenderingSingleDay}
              />
            );
          })}
        </VerticalScrollContextProvider>
      </div>
      <div
        className={cx(
          styles.timeGradient,
          (firstDayIsNotWeekend || isRenderingSingleDay) &&
            styles.firstDayIsNotWeekendGradient,
        )}
      />
    </>
  );
};
