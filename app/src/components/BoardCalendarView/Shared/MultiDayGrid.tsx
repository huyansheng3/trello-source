import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import {
  getEventsForRange,
  isInRange,
  isSameDay,
  sortEvents,
} from 'app/src/components/BoardCalendarView/helpers';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import { AllDayEventsSection } from './AllDayEventsSection';
import { HourlyEventsSection } from './HourlyEventsSection';
import { AllDayWrapperProps } from './types';

import styles from './MultiDayGrid.less';

interface MultiDayGridProps {
  dateRange: Date[];
  events: EventData[];
  selectedDate: Date;
  allDaySectionWrapper?: React.ComponentType<AllDayWrapperProps>;
}

export const MultiDayGrid: React.FC<MultiDayGridProps> = ({
  dateRange,
  events,
  selectedDate,
  allDaySectionWrapper,
}) => {
  const [currentTime, updateCurrentTime] = useState(new Date());

  useEffect(() => {
    const currentTimeInterval = window.setInterval(() => {
      updateCurrentTime(new Date());
    }, 60000);

    return () => {
      window.clearInterval(currentTimeInterval);
    };
  }, []);

  const [allDayEvents, eventsByHour] = useMemo(() => {
    const startOfRange = dateRange[0];
    const endOfRange = moment(dateRange[dateRange.length - 1])
      .endOf('day')
      .toDate();

    const eventsForRange = getEventsForRange(events, startOfRange, endOfRange);

    const allDayEvents: EventData[] = [],
      eventsByHour: EventData[][][] = Array.from(Array(24), () =>
        Array.from(Array(dateRange.length), () => []),
      );
    // `eventsByHour` lists all of the events separated by
    // hour and then day
    // [
    //   [     ==> Events are first separated by the hour
    //            when the event ends (ignores day)
    //     [], ==> Events are further separated by the day
    //            when the event ends
    //     [],
    //     ///
    //   ],
    //   [],
    //   ...
    // ]

    eventsForRange.forEach((event) => {
      if (isInRange(event, startOfRange, endOfRange)) {
        const eStart = event.start,
          eEnd = event.end;
        const eventEndHours = eEnd.getHours();

        // We display the event in the "allDay" section if:
        // - The event is a multi day event OR
        // - `allDay` is true
        if (!isSameDay(eStart, eEnd) || event.allDay) {
          allDayEvents.push(event);
        } else {
          const eventEndDayIndex = dateRange.findIndex((date) =>
            isSameDay(date, event.end),
          );
          eventsByHour[eventEndHours][eventEndDayIndex].push(event);
        }
      }
    });

    allDayEvents.sort(sortEvents);

    return [allDayEvents, eventsByHour];
  }, [dateRange, events]);

  const isRenderingSingleDay = dateRange.length === 1;

  return (
    <div className={styles.multiDayGrid}>
      <AllDayEventsSection
        dateRange={dateRange}
        events={allDayEvents}
        selectedDate={selectedDate}
        className={styles.flexGrow}
        preventShadeOffRange={true}
        isFirstRow={true}
        defaultMaxLevels={Infinity}
        wrapperComponent={allDaySectionWrapper}
        isRenderingSingleDay={isRenderingSingleDay}
      />
      <HourlyEventsSection
        dateRange={dateRange}
        eventsByHour={eventsByHour}
        selectedDate={selectedDate}
        currentTime={currentTime}
        isRenderingSingleDay={isRenderingSingleDay}
      />
    </div>
  );
};
