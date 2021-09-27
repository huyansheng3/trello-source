import { useMemo } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import {
  useCardsPerMemberQuery,
  CardsPerMemberQuery,
} from './CardsPerMemberQuery.generated';

type Card = NonNullable<CardsPerMemberQuery['board']>['cards'][0];
export type Member = NonNullable<CardsPerMemberQuery['board']>['members'][0];

export interface CardsPerMemberCurrentState {
  assigned: Record<string, { member: Member; count: number }>;
  unassigned: { count: number };
}

function getCardsPerMember(
  cards: Array<Card>,
  members: Array<Member>,
): CardsPerMemberCurrentState {
  const cardsPerMember = members.reduce(
    (acc, curr) => {
      acc.assigned[curr.id] = {
        member: curr,
        count: 0,
      };
      return acc;
    },
    { unassigned: { count: 0 }, assigned: {} } as CardsPerMemberCurrentState,
  );

  for (const card of cards) {
    const { id, idMembers } = card;

    if (idMembers.length === 0) {
      cardsPerMember.unassigned.count++;
    } else {
      for (const idMember of idMembers) {
        if (idMember in cardsPerMember.assigned) {
          cardsPerMember.assigned[idMember].count++;
        } else {
          Analytics.sendOperationalEvent({
            action: 'errored',
            actionSubject: 'cardsPerMember',
            source: 'boardDashboardScreen',
            attributes: {
              errorMessage: `Card ${id} has unknown member ${idMember}`,
            },
          });
        }
      }
    }
  }
  return cardsPerMember;
}

export function useCardsPerMemberCurrentState(idBoard: string) {
  const { data, loading } = useCardsPerMemberQuery({
    variables: {
      boardId: idBoard,
    },
  });

  const cardsPerMember = useMemo(() => {
    if (data?.board) {
      return getCardsPerMember(data.board.cards, data.board.members);
    }
    return null;
  }, [data]);

  return { data: cardsPerMember, loading };
}
