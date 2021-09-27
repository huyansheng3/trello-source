import React, { useMemo } from 'react';
import moment from 'moment';

import { useFeatureFlag } from '@trello/feature-flag-client';

import { getEventsForRange } from 'app/src/components/BoardCalendarView/helpers';
import {
  MultiDayGrid,
  ZoomComponentProps,
} from 'app/src/components/BoardCalendarView/Shared';

import { AgendaView } from './AgendaView';
import { DayAllDayWrapper } from './DayAllDayWrapper';

export const Day: React.FC<ZoomComponentProps> = ({
  selectedDate,
  events,
  trackInitialCalendarLoad,
}) => {
  const isNewDayGridEnabled = useFeatureFlag(
    'ecosystem.views-new-day-grid',
    false,
  );

  const dateRange = useMemo(() => {
    return [moment(selectedDate).startOf('day').toDate()];
  }, [selectedDate]);

  const eventsForDay = useMemo(() => {
    const startOfDay = selectedDate;
    const endOfDay = moment(selectedDate).endOf('day').toDate();

    return getEventsForRange(events, startOfDay, endOfDay);
  }, [events, selectedDate]);

  trackInitialCalendarLoad(eventsForDay.length);

  if (isNewDayGridEnabled) {
    return (
      <AgendaView selectedDate={selectedDate} eventsForDay={eventsForDay} />
    );
  }

  return (
    <MultiDayGrid
      dateRange={dateRange}
      events={events}
      selectedDate={selectedDate}
      allDaySectionWrapper={DayAllDayWrapper}
    />
  );
};
