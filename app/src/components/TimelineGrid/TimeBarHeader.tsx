import React from 'react';
import { Column } from './types';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import { currentLocale } from '@trello/locale';

// eslint-disable-next-line @trello/no-module-logic
const getMonth = new Intl.DateTimeFormat(currentLocale, {
  month: 'long',
}).format;

// eslint-disable-next-line @trello/no-module-logic
const getMonthShort = new Intl.DateTimeFormat(currentLocale, {
  month: 'short',
}).format;

// eslint-disable-next-line @trello/no-module-logic
const getDay = new Intl.DateTimeFormat(currentLocale, {
  weekday: 'short',
}).format;

// eslint-disable-next-line @trello/no-module-logic
const getDate = new Intl.DateTimeFormat(currentLocale, {
  day: 'numeric',
}).format;

// eslint-disable-next-line @trello/no-module-logic
const getDateMonth = new Intl.DateTimeFormat(currentLocale, {
  month: 'short',
  day: 'numeric',
}).format;
interface TimeBarHeaderProps {
  styles: CSSModule;
  column: Column;
  zoom: ZoomLevel;
}

export const TimeBarHeader = ({ styles, column, zoom }: TimeBarHeaderProps) => {
  if (zoom === ZoomLevel.QUARTER) {
    return (
      <div>
        <div
          className={styles.timeBarItemText}
          style={{ textTransform: 'uppercase' }}
        >
          {getMonth(column.startTime)}
        </div>
      </div>
    );
  } else if (zoom === ZoomLevel.YEAR) {
    return (
      <div>
        <div
          className={styles.timeBarItemText}
          style={{ textTransform: 'uppercase' }}
        >
          {getMonthShort(column.startTime)}
        </div>
      </div>
    );
  } else {
    let date = getDate(column.startTime);
    if (date === '1') {
      date = getDateMonth(column.startTime).toUpperCase();
    }
    return (
      <div>
        <div
          className={styles.timeBarItemDay}
          style={{ textTransform: 'uppercase' }}
        >
          {getDay(column.startTime)}
        </div>
        <div className={styles.timeBarItemDate}>{date}</div>
      </div>
    );
  }
};
