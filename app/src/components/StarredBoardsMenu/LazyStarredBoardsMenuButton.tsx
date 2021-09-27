import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Null } from 'app/src/components/Null';

export const LazyStarredBoardsMenuButton: React.FunctionComponent<object> = () => {
  const StarredBoardsMenuButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "starred-boards-menu-button" */ './StarredBoardsMenuButton'
      ),
    { namedImport: 'StarredBoardsMenuButton' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.StarredBoardsMenuButton,
      }}
      errorHandlerComponent={Null}
    >
      <Suspense fallback={null}>
        <StarredBoardsMenuButton />
      </Suspense>
    </ErrorBoundary>
  );
};
