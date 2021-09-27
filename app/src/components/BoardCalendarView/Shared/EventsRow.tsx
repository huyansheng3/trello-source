import React from 'react';
import cx from 'classnames';

import { EventSegment } from 'app/src/components/BoardCalendarView/types';

import { EventSegmentContainer } from './EventSegmentContainer';

import styles from './EventsRow.less';

interface EventsRowProps {
  segments: EventSegment[];
  totalSlots: number;
  preventEventEdit?: boolean;
}

export const EventsRow: React.FC<EventsRowProps> = ({
  segments,
  totalSlots,
  preventEventEdit,
}) => {
  return (
    <div className={cx(styles.eventsRowContainer)}>
      {segments.map((segment) => (
        <EventSegmentContainer
          key={segment.event.data.id}
          segment={segment}
          totalSlots={totalSlots}
          slotsSpanned={segment.slotsSpanned}
          leftSlot={segment.leftSlot}
          preventEventEdit={preventEventEdit}
        />
      ))}
    </div>
  );
};
