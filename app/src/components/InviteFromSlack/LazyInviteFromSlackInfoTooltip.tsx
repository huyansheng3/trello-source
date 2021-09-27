import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import type { InviteFromSlackInfoTooltipProps } from './InviteFromSlackInfoTooltip';

export function LazyInviteFromSlackInfoTooltip(
  props: InviteFromSlackInfoTooltipProps,
) {
  const InviteFromSlackInfoTooltip = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "invite-from-slack" */ './InviteFromSlackInfoTooltip'
      ),
    {
      preload: false,
      namedImport: 'InviteFromSlackInfoTooltip',
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
        <InviteFromSlackInfoTooltip {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
