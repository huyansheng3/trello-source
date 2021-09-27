import React, { useCallback, useContext, useMemo } from 'react';
import cx from 'classnames';

import { forTemplate } from '@trello/i18n';
import { Tooltip } from '@trello/nachos/tooltip';

import { BoardViewContext } from 'app/src/components/BoardViewContext/BoardViewContext';

import { DraggableItemWrapper } from 'app/src/components/BoardCalendarView/Draggable';
import { ResizableItemWrapper } from 'app/src/components/BoardCalendarView/Resizable';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import { CalendarEvent } from './CalendarEvent';
import { VerticalScrollContext } from './VerticalScrollContext';

import styles from './EditableCalendarEvent.less';

const format = forTemplate('calendar-view', {
  returnBlankForMissingStrings: true,
});

interface EditableCalendarEventProps {
  event: EventData;
  className?: string;
  continuesBefore?: boolean;
  continuesAfter?: boolean;
  resizable?: boolean;
  preventEventEdit?: boolean;
  useMiniCardDrag?: boolean;
}

export const EditableCalendarEvent: React.FC<EditableCalendarEventProps> = ({
  event,
  className,
  continuesBefore,
  continuesAfter,
  resizable = true,
  preventEventEdit,
  useMiniCardDrag,
}) => {
  const { canEditBoard } = useContext(BoardViewContext);

  const { scrollContainer } = useContext(VerticalScrollContext);

  const eventData = useMemo(() => {
    return {
      id: event.data.id,
      start: event.start,
      end: event.end,
      originalEvent: event,
    };
  }, [event]);

  const borderRadiusClassName = cx(
    continuesBefore && styles.continuesBefore,
    continuesAfter && styles.continuesAfter,
  );

  const onEventDoubleClick = useCallback(() => {
    (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
    };
  }, []);

  const calendarEventContent = (
    <CalendarEvent
      event={event}
      itemClassName={event.isChecklistItem ? undefined : borderRadiusClassName}
    />
  );

  let content = calendarEventContent;

  if (!event.isChecklistItem && !preventEventEdit) {
    if (canEditBoard(event.data.idBoard)) {
      content = (
        <ResizableItemWrapper
          eventData={eventData}
          className={className}
          hideLeftAnchor={continuesBefore || !resizable}
          hideRightAnchor={continuesAfter || !resizable}
          scrollContainer={scrollContainer}
        >
          <DraggableItemWrapper
            eventData={eventData}
            className={cx(className, borderRadiusClassName)}
            scrollContainer={scrollContainer}
            useMiniCardDrag={useMiniCardDrag}
          >
            {calendarEventContent}
          </DraggableItemWrapper>
        </ResizableItemWrapper>
      );
    } else {
      content = (
        <Tooltip content={format('no-permissions')} position="top" delay={500}>
          {calendarEventContent}
        </Tooltip>
      );
    }
  }

  return (
    <div
      className={cx(
        styles.eventContent,
        continuesBefore && styles.eventContinuesBefore,
        continuesAfter && styles.eventContinuesAfter,
        className,
      )}
      onDoubleClick={onEventDoubleClick}
    >
      {content}
    </div>
  );
};
