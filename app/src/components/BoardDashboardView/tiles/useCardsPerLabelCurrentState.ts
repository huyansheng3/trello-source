import { useMemo } from 'react';

import {
  useCardsPerLabelQuery,
  CardsPerLabelQuery,
} from './CardsPerLabelQuery.generated';

type Label = NonNullable<CardsPerLabelQuery['board']>['labels'][0];
type Card = NonNullable<CardsPerLabelQuery['board']>['cards'][0];

export type CardsPerLabelCurrentState = Record<
  string,
  { label: Label; count: number }
>;

function removeUnusedNamelessLabels(cardsPerLabel: CardsPerLabelCurrentState) {
  return Object.fromEntries(
    Object.entries(cardsPerLabel).filter(
      ([_, { label, count }]) => label.name !== '' || count > 0,
    ),
  );
}

function getCardsPerLabel(
  cards: Array<Card>,
  labels: Array<Label>,
): CardsPerLabelCurrentState {
  const cardsPerLabel = labels.reduce((acc, curr) => {
    acc[curr.id] = {
      label: curr,
      count: 0,
    };
    return acc;
  }, {} as CardsPerLabelCurrentState);

  for (const card of cards) {
    const { idLabels } = card;

    for (const idLabel of idLabels) {
      if (idLabel in cardsPerLabel) {
        cardsPerLabel[idLabel].count++;
      }
    }
  }
  return cardsPerLabel;
}

export function useCardsPerLabelCurrentState(idBoard: string) {
  const { data, loading } = useCardsPerLabelQuery({
    variables: {
      boardId: idBoard,
    },
  });

  const cardsPerLabel = useMemo(() => {
    if (data?.board) {
      const initialCardsPerLabel = getCardsPerLabel(
        data.board.cards,
        data.board.labels,
      );
      const filteredCardsPerLabel = removeUnusedNamelessLabels(
        initialCardsPerLabel,
      );
      return filteredCardsPerLabel;
    }
    return null;
  }, [data]);

  return { data: cardsPerLabel, loading };
}
