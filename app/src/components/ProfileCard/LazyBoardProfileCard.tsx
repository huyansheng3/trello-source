import { ApolloProvider } from '@trello/graphql';
import React, { Suspense } from 'react';
import type { Props } from './BoardProfileCard';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyBoardProfileCard: React.FC<Props> = (props) => {
  const BoardProfileCard = useLazyComponent(
    () =>
      import(/* webpackChunkName: "board-profile-card" */ './BoardProfileCard'),
    { namedImport: 'BoardProfileCard' },
  );

  return (
    <Suspense fallback={<ProfileCardSkeleton onClose={props.onClose} />}>
      <ApolloProvider>
        <BoardProfileCard {...props} />
      </ApolloProvider>
    </Suspense>
  );
};
