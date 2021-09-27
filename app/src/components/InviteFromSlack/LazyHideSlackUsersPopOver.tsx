import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { HideSlackUsersProps } from './HideSlackUsersPopOver';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';

export function LazyHideSlackUsersPopOver(props: HideSlackUsersProps) {
  const HideSlackUsersPopOver = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "hide-slack-users-popover" */ './HideSlackUsersPopOver'
      ),
    {
      preload: false,
      namedImport: 'HideSlackUsersPopOver',
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
        <HideSlackUsersPopOver {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
