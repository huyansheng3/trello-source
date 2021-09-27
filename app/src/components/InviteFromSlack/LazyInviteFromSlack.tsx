import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { InviteFromSlackProps } from './InviteFromSlack';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';

export function LazyInviteFromSlack(props: InviteFromSlackProps) {
  const InviteFromSlack = useLazyComponent(
    () =>
      import(/* webpackChunkName: "invite-from-slack" */ './InviteFromSlack'),
    {
      preload: false,
      namedImport: 'InviteFromSlack',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-bizteam',
          feature: 'Invite From Slack',
        }}
      >
        <InviteFromSlack {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
