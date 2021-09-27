import React, { useMemo } from 'react';
import moment from 'moment';

import { useFeatureFlag } from '@trello/feature-flag-client';

import {
  getDaysToRenderForWeek,
  getEventsForRange,
} from 'app/src/components/BoardCalendarView/helpers';
import {
  AllDayEventsSection,
  MultiDayGrid,
  WithDateHeaders,
  ZoomComponentProps,
} from 'app/src/components/BoardCalendarView/Shared';

import { WeekAllDayWrapper } from './WeekAllDayWrapper';

import styles from './Week.less';

export const Week: React.FC<ZoomComponentProps> = ({
  selectedDate,
  events,
  trackInitialCalendarLoad,
}) => {
  const isNewDayGridEnabled = useFeatureFlag(
    'ecosystem.views-new-day-grid',
    false,
  );

  const weekToRender = useMemo(() => {
    return getDaysToRenderForWeek(selectedDate);
  }, [selectedDate]);

  const eventsForWeek = useMemo(() => {
    const startOfRange = weekToRender[0];
    const endOfRange = moment(weekToRender[weekToRender.length - 1])
      .endOf('day')
      .toDate();

    return getEventsForRange(events, startOfRange, endOfRange);
  }, [events, weekToRender]);

  trackInitialCalendarLoad(eventsForWeek.length);

  if (isNewDayGridEnabled) {
    return (
      <WithDateHeaders
        selectedDate={selectedDate}
        dates={weekToRender}
        containerClassName={styles.flexParent}
      >
        <AllDayEventsSection
          className={styles.flexChild}
          dateRange={weekToRender}
          events={eventsForWeek}
          selectedDate={selectedDate}
          defaultMaxLevels={Infinity}
          isFirstRow={true}
        />
      </WithDateHeaders>
    );
  }

  return (
    <MultiDayGrid
      dateRange={weekToRender}
      events={events}
      selectedDate={selectedDate}
      allDaySectionWrapper={WeekAllDayWrapper}
    />
  );
};
