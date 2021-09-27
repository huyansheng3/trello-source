/* eslint-disable @typescript-eslint/no-use-before-define */
import { useMemo } from 'react';
import {
  useCardsPerListQuery,
  CardsPerListQuery,
} from './CardsPerListQuery.generated';

type Card = NonNullable<CardsPerListQuery['board']>['cards'][0];
type List = NonNullable<CardsPerListQuery['board']>['lists'][0];

export type CardsPerListCurrentState = Record<
  string,
  { list: List; count: number }
>;

export function useCardsPerListCurrentState(idBoard: string) {
  const { data, loading } = useCardsPerListQuery({
    variables: {
      boardId: idBoard,
    },
  });

  const cardsPerList = useMemo(() => {
    if (data?.board) {
      return getCardsPerList(data.board.cards, data.board.lists);
    }
    return null;
  }, [data]);
  return { data: cardsPerList, loading };
}

function getCardsPerList(
  cards: Array<Card>,
  lists: Array<List>,
): CardsPerListCurrentState {
  const cardsPerList = lists.reduce((acc, curr) => {
    acc[curr.id] = {
      list: curr,
      count: 0,
    };
    return acc;
  }, {} as CardsPerListCurrentState);

  for (const card of cards) {
    const { idList } = card;

    if (idList in cardsPerList) {
      cardsPerList[idList].count++;
    }
  }
  return cardsPerList;
}
