import { forNamespace } from '@trello/i18n';
import React from 'react';
import { RelativeDateEntity } from './types';
import { getDateDeltaString } from '@trello/dates';
const format = forNamespace('notificationsGrouped');

interface RelativeDateProps extends Pick<RelativeDateEntity, 'date'> {
  now?: Date;
}

// TODO: Date refreshing ?

const getCurrentDateString = (dateString: string, now: Date) => {
  const date = new Date(dateString);
  const period = getDateDeltaString(date, now);
  const relativeDateKey =
    date > now ? 'notification_is_due' : 'notification_was_due';

  return <span>{format(relativeDateKey, { period })}</span>;
};

export const RelativeDate: React.FunctionComponent<RelativeDateProps> = ({
  date,
  now = new Date(),
}) => {
  const currentDateString = getCurrentDateString(date, now);

  return <span>{currentDateString}</span>;
};
