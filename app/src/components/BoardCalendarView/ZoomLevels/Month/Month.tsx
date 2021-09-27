import React, { useMemo } from 'react';
import _ from 'underscore';

import {
  AllDayEventsSection,
  WithDateHeaders,
  ZoomComponentProps,
} from 'app/src/components/BoardCalendarView/Shared';
import {
  getDaysToRenderForMonth,
  getEventsForRange,
} from 'app/src/components/BoardCalendarView/helpers';

import styles from './Month.less';

export const Month: React.FC<ZoomComponentProps> = ({
  selectedDate,
  events,
  trackInitialCalendarLoad,
}) => {
  const [weeksToRender, eventsForMonth] = useMemo(() => {
    const daysToRender = getDaysToRenderForMonth(selectedDate),
      weeksToRender = _.chunk(daysToRender, 7) as Date[][],
      eventsForMonth = getEventsForRange(
        events,
        daysToRender[0],
        daysToRender[daysToRender.length - 1],
      );
    return [weeksToRender, eventsForMonth];
  }, [selectedDate, events]);

  trackInitialCalendarLoad(eventsForMonth.length);

  const weekComponents = useMemo(() => {
    return weeksToRender.map((week: Date[], weekIdx: number) => {
      const eventsForWeek = getEventsForRange(eventsForMonth, week[0], week[6]);

      return (
        <AllDayEventsSection
          className={styles.minHeight}
          key={week[0].getTime() + weekIdx}
          dateRange={week}
          events={eventsForWeek}
          selectedDate={selectedDate}
          isFirstRow={weekIdx === 0}
        />
      );
    });
  }, [eventsForMonth, selectedDate, weeksToRender]);

  return (
    <WithDateHeaders selectedDate={selectedDate} dates={weeksToRender[0]}>
      {weekComponents}
    </WithDateHeaders>
  );
};
