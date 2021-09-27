import React, { useMemo } from 'react';
import moment from 'moment';

import { sortEvents } from 'app/src/components/BoardCalendarView/helpers';
import { EditableCalendarEvent } from 'app/src/components/BoardCalendarView/Shared';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import styles from './EventsCluster.less';

interface EventsClusterProps {
  selectedDate: Date;
  events: EventData[];
  hour?: number;
}

export const EventsCluster: React.FC<EventsClusterProps> = ({
  selectedDate,
  events,
  hour,
}) => {
  const sortedEvents = useMemo(() => {
    return events.sort((eventA, eventB) => sortEvents(eventA, eventB, true));
  }, [events]);

  const isHourSlot = !!(hour || hour === 0);

  const dateClone = new Date(selectedDate.getTime());
  // Can't use `isHourSlot` here because typescript :/
  if (hour || hour === 0) {
    dateClone.setHours(hour);
  }

  return (
    <div
      className={styles.hourClusterContainer}
      data-date-range
      data-date-range-start={dateClone.getTime()}
      data-date-range-length={1}
      // `prevent-drop` will allow us to record this date as
      // the original slot, and will prevent users from being
      // able to drop events into these hour clusters
      data-date-prevent-drop
    >
      {isHourSlot && (
        <span className={styles.hourText}>
          {moment({ hours: hour }).format('h:mma').toString()}
        </span>
      )}
      {sortedEvents.map((event) => (
        <EditableCalendarEvent
          key={event.data.id}
          event={event}
          resizable={false}
          useMiniCardDrag={true}
          className={styles.noPadding}
          preventEventEdit={!isHourSlot}
        />
      ))}
    </div>
  );
};
