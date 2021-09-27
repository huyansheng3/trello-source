import { useMemo } from 'react';
import {
  useCardsPerDueDateQuery,
  CardsPerDueDateQuery,
} from './CardsPerDueDateQuery.generated';

type Card = NonNullable<CardsPerDueDateQuery['board']>['cards'][0];

export interface CardsPerDueDateCurrentState {
  overdue: number;
  dueSoon: number;
  dueLater: number;
  done: number;
  na: number;
}

const hoursApart = (date1: Date, date2: Date) => {
  const msInHour = 60 * 60 * 1000;
  return Math.abs(date1.getTime() - date2.getTime()) / msInHour;
};

function getCardsPerDueDate(cards: Array<Card>): CardsPerDueDateCurrentState {
  const cardsPerDueDate = {
    overdue: 0,
    dueSoon: 0,
    dueLater: 0,
    done: 0,
    na: 0,
  };

  for (const card of cards) {
    const { due, dueComplete } = card;
    if (due) {
      const now = new Date();
      const dueDate = new Date(due);
      if (dueComplete) {
        cardsPerDueDate.done++;
      } else if (now > dueDate) {
        cardsPerDueDate.overdue++;
      } else if (hoursApart(now, dueDate) <= 24) {
        cardsPerDueDate.dueSoon++;
      } else {
        cardsPerDueDate.dueLater++;
      }
    } else {
      cardsPerDueDate.na++;
    }
  }

  return cardsPerDueDate;
}

export function useCardsPerDueDateCurrentState(idBoard: string) {
  const { data, loading } = useCardsPerDueDateQuery({
    variables: {
      boardId: idBoard,
    },
  });

  const cardsPerDueDate = useMemo(() => {
    if (data?.board) {
      return getCardsPerDueDate(data.board.cards);
    }
    return null;
  }, [data]);

  return { data: cardsPerDueDate, loading };
}
