import React, { useMemo } from 'react';
import _ from 'underscore';
import cx from 'classnames';

import { forTemplate } from '@trello/i18n';
import { CalendarViewTestIds } from '@trello/test-ids';

import { EventSegment } from 'app/src/components/BoardCalendarView/types';

import { EventSegmentContainer } from './EventSegmentContainer';

import styles from './ExtraEventsRow.less';

const format = forTemplate('calendar-view');

interface ExtraEventsRowProps {
  segments: EventSegment[];
  onShowMore: () => void;
  totalSlots: number;
}

export const ExtraEventsRow: React.FC<ExtraEventsRowProps> = ({
  segments,
  onShowMore,
  totalSlots,
}) => {
  const [segmentsToRender, containsEvent] = useMemo(() => {
    const segmentIsInSlot = (seg: EventSegment, slotIdx: number) => {
      return seg.leftSlot <= slotIdx && seg.rightSlot >= slotIdx;
    };

    const findFirstSegmentInSlot = (slotIdx: number) => {
      return segments.find((seg) => segmentIsInSlot(seg, slotIdx));
    };

    const totalEventsInSlot = (slotIdx: number) => {
      return segments.filter((seg) => segmentIsInSlot(seg, slotIdx)).length;
    };

    const isOnlySegmentInSlots = (seg: EventSegment) => {
      const { leftSlot, slotsSpanned } = seg;

      return _.range(leftSlot, leftSlot + slotsSpanned).every(
        (slotIdx) => totalEventsInSlot(slotIdx) === 1,
      );
    };

    const segmentsToRender: JSX.Element[] = [];

    let currentSlotIdx = 0,
      containsEvent = false;

    while (currentSlotIdx <= totalSlots) {
      const segment = findFirstSegmentInSlot(currentSlotIdx);

      if (segment) {
        if (isOnlySegmentInSlots(segment)) {
          if (!containsEvent) {
            containsEvent = true;
          }

          segmentsToRender.push(
            <EventSegmentContainer
              key={segment.event.data.id}
              segment={segment}
              totalSlots={totalSlots}
              slotsSpanned={segment.slotsSpanned}
              leftSlot={segment.leftSlot}
            />,
          );
          currentSlotIdx += segment.slotsSpanned;
        } else {
          segmentsToRender.push(
            <EventSegmentContainer
              key={currentSlotIdx}
              totalSlots={totalSlots}
              slotsSpanned={1}
              leftSlot={currentSlotIdx}
            >
              <div
                className={styles.showMoreLink}
                role="button"
                onClick={onShowMore}
                data-test-id={CalendarViewTestIds.ShowMoreButton}
              >
                {format('show-all', {
                  count: totalEventsInSlot(currentSlotIdx),
                })}
              </div>
            </EventSegmentContainer>,
          );
          currentSlotIdx++;
        }
      } else {
        currentSlotIdx++;
      }
    }

    return [segmentsToRender, containsEvent];
  }, [segments, onShowMore, totalSlots]);

  return (
    <div
      className={cx(
        styles.eventsRowContainer,
        containsEvent && styles.setMinHeight,
      )}
    >
      {segmentsToRender}
    </div>
  );
};
