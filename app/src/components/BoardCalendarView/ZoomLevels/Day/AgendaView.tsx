import React, { useCallback, useContext, useMemo } from 'react';
import moment from 'moment';

import { forTemplate } from '@trello/i18n';

import { AddPopoverContext } from 'app/src/components/BoardCalendarView/AddPopoverContext';
import { isSameDay } from 'app/src/components/BoardCalendarView/helpers';
import { EventData } from 'app/src/components/BoardCalendarView/types';
import {
  BackgroundCellWrapper,
  DateLabel,
} from 'app/src/components/BoardCalendarView/Shared';
import { BoardViewContext } from 'app/src/components/BoardViewContext/BoardViewContext';

import { ChecklistEvents } from './ChecklistEvents';
import { EventsCluster } from './EventsCluster';

import styles from './AgendaView.less';

const cardsPlaceHolder = require('resources/images/empty-states/views-empty-state-card-placeholder.svg');

const format = forTemplate('calendar-view', {
  returnBlankForMissingStrings: true,
});

interface AgendaViewProps {
  selectedDate: Date;
  eventsForDay: EventData[];
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  selectedDate,
  eventsForDay,
}) => {
  const { contextType } = useContext(BoardViewContext);
  const isInBoardView = contextType === 'board';

  const { hasAddPermission, openPopoverFromMousePosition } = useContext(
    AddPopoverContext,
  );

  const openAddCardPopover = useCallback(
    (e: React.MouseEvent) => {
      if (hasAddPermission) {
        const { clientX, clientY } = e;

        const current = moment();
        const defaultDate = moment(selectedDate).set({
          hour: current.get('hour'),
          minute: current.get('minute'),
          second: 0,
          millisecond: 0,
        });

        openPopoverFromMousePosition(
          { top: clientY, left: clientX },
          defaultDate.valueOf(),
        );
      }
    },
    [hasAddPermission, openPopoverFromMousePosition, selectedDate],
  );

  const [allDayEvents, eventsByHour, checklistItems] = useMemo(() => {
    const allDayEvents: EventData[] = [],
      eventsByHour: EventData[][] = Array.from(Array(24), () => []),
      checklistItems: EventData[] = [];
    // `eventsByHour` lists all of the events separated by
    // hour
    // [
    //   [...],  ==> e.g. Events that end between 12AM-1AM
    //   [...],  ==> e.g. Events that end between 1AM-2AM
    //   ...
    // ]

    eventsForDay.forEach((event) => {
      const eStart = event.start,
        eEnd = event.end;

      if (event.isChecklistItem) {
        checklistItems.push(event);
        // We display the event in the "allDay" section if
        // the event is NOT a checkitem and either:
        // - The event is a multi day event
        // - `allDay` is true
      } else if (!isSameDay(eStart, eEnd) || event.allDay) {
        allDayEvents.push(event);
      } else {
        eventsByHour[eEnd.getHours()].push(event);
      }
    });

    return [allDayEvents, eventsByHour, checklistItems];
  }, [eventsForDay]);

  return (
    <div
      className={styles.agendaViewContainer}
      onDoubleClick={openAddCardPopover}
    >
      <BackgroundCellWrapper
        date={selectedDate}
        selectedDate={selectedDate}
        preventShadeOffRange={true}
        preventTodayHighlight={true}
        preventShadedBgs={true}
        className={styles.eventsContainer}
      >
        <div className={styles.dayOfWeekLabel}>
          {moment(selectedDate).format('dddd')}
        </div>
        <DateLabel
          date={selectedDate}
          className={styles.dateLabel}
          hideMonth={true}
          disableTodayColor={true}
        />
        {eventsForDay.length === 0 ? (
          <div className={styles.emptyDayContainer}>
            <img
              src={cardsPlaceHolder}
              className={styles.emptyCardsImage}
              alt="No Cards"
            />
            <div className={styles.emptyText}>
              <div className={styles.title}>{format('nothing-scheduled')}</div>
              <div className={styles.subTitle}>
                {format('nothing-scheduled-description')}{' '}
                {isInBoardView && hasAddPermission && (
                  <span
                    className={styles.addCardLink}
                    role="button"
                    onClick={openAddCardPopover}
                  >
                    {format('inline-add-card-link')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {allDayEvents.length > 0 && (
              <EventsCluster
                selectedDate={selectedDate}
                events={allDayEvents}
              />
            )}
            {eventsByHour.map((events, index) => {
              if (events.length > 0) {
                return (
                  <EventsCluster
                    key={index}
                    selectedDate={selectedDate}
                    hour={index}
                    events={events}
                  />
                );
              }
              return null;
            })}
            {checklistItems.length > 0 && (
              <ChecklistEvents checklistItems={checklistItems} />
            )}
          </>
        )}
      </BackgroundCellWrapper>
    </div>
  );
};
