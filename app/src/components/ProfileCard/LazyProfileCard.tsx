import { ApolloProvider } from '@trello/graphql';
import React, { Suspense } from 'react';
import type { Props } from './ProfileCard';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyProfileCard: React.FC<Props> = (props) => {
  const ProfileCard = useLazyComponent(
    () => import(/* webpackChunkName: "profile-card" */ './ProfileCard'),
    { namedImport: 'ProfileCard' },
  );

  return (
    <Suspense fallback={<ProfileCardSkeleton onClose={props.onClose} />}>
      <ApolloProvider>
        <ProfileCard {...props} />
      </ApolloProvider>
    </Suspense>
  );
};
