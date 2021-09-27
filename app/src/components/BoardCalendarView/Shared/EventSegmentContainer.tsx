import React from 'react';
import cx from 'classnames';

import { EventSegment } from 'app/src/components/BoardCalendarView/types';

import { EditableCalendarEvent } from './EditableCalendarEvent';

import styles from './EventSegmentContainer.less';

interface EventSegmentContainerProps {
  segment?: EventSegment;
  totalSlots: number;
  slotsSpanned: number;
  leftSlot: number;
  preventEventEdit?: boolean;
}

export const EventSegmentContainer: React.FC<EventSegmentContainerProps> = ({
  segment,
  totalSlots,
  slotsSpanned,
  leftSlot,
  preventEventEdit,
  children,
}) => {
  let content;
  if (children) {
    content = children;
  } else if (segment) {
    const {
      event,
      previewContinuesAfter,
      previewContinuesBefore,
      previewLeftSlot,
      previewSlotsSpanned,
    } = segment;
    const continuesAfter = previewContinuesAfter ?? segment.continuesAfter,
      continuesBefore = previewContinuesBefore ?? segment.continuesBefore;
    leftSlot = previewLeftSlot ?? leftSlot;
    slotsSpanned = previewSlotsSpanned ?? slotsSpanned;

    content = (
      <EditableCalendarEvent
        event={event}
        className={styles.flexContainer}
        continuesBefore={continuesBefore}
        continuesAfter={continuesAfter}
        preventEventEdit={preventEventEdit}
      />
    );
  }

  return (
    <div
      className={cx(
        styles.eventSegmentContainer,
        segment && segment.previewSlotsSpanned === 0 && styles.hide,
      )}
      style={{
        width: `${Math.abs(slotsSpanned / totalSlots) * 100}%`,
        left: `${Math.abs(leftSlot / totalSlots) * 100}%`,
      }}
    >
      {content}
    </div>
  );
};
