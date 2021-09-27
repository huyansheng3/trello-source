import { ApolloProvider } from '@trello/graphql';
import React, { Suspense } from 'react';
import type { Props } from './CardProfileCard';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyCardProfileCard: React.FC<Props> = (props) => {
  const CardProfileCard = useLazyComponent(
    () =>
      import(/* webpackChunkName: "card-profile-card" */ './CardProfileCard'),
    { namedImport: 'CardProfileCard' },
  );

  return (
    <Suspense fallback={<ProfileCardSkeleton onClose={props.onClose} />}>
      <ApolloProvider>
        <CardProfileCard {...props} />
      </ApolloProvider>
    </Suspense>
  );
};
