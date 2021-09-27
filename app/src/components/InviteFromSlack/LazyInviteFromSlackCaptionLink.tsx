import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { InviteFromSlackCaptionLinkProps } from './InviteFromSlackCaptionLink';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';

export function LazyInviteFromSlackCaptionLink(
  props: InviteFromSlackCaptionLinkProps,
) {
  const InviteFromSlackCaptionLink = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "invite-from-slack-caption-linke" */ './InviteFromSlackCaptionLink'
      ),
    {
      preload: false,
      namedImport: 'InviteFromSlackCaptionLink',
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
        <InviteFromSlackCaptionLink {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
