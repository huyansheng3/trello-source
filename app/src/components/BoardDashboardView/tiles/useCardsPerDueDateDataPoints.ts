import { useMemo } from 'react';
import { DueDateColorMap } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';
import { CardsPerDueDateCurrentState } from './useCardsPerDueDateCurrentState';
const format = forTemplate('board_report');

export function useCardsPerDueDateDataPoints(
  data?: CardsPerDueDateCurrentState | null,
) {
  return useMemo(() => {
    if (!data) {
      return [];
    }
    return [
      {
        name: format('complete'),
        value: data.done,
        color: DueDateColorMap.done,
      },
      {
        name: format('due-soon'),
        value: data.dueSoon,
        color: DueDateColorMap.dueSoon,
      },
      {
        name: format('due-later'),
        value: data.dueLater,
        color: DueDateColorMap.dueLater,
      },
      {
        name: format('overdue'),
        value: data.overdue,
        color: DueDateColorMap.overdue,
      },
      {
        name: format('no-due-date'),
        value: data.na,
        color: DueDateColorMap.na,
      },
    ];
  }, [data]);
}
