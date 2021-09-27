import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Null } from 'app/src/components/Null';

export const LazyMimicNavDataRequests: React.FunctionComponent<object> = () => {
  const MimicNavDataRequests = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "mimic-nav-data-requests" */ './MimicNavDataRequests'
      ),
    { namedImport: 'MimicNavDataRequests' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.WorkspaceNavigation,
      }}
      errorHandlerComponent={Null}
    >
      <Suspense fallback={null}>
        <MimicNavDataRequests />
      </Suspense>
    </ErrorBoundary>
  );
};
