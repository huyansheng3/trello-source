import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { AddCoverProps } from './AddCover';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';

export function LazyAddCover({ cardId, navigateToSelectCover }: AddCoverProps) {
  const AddCover = useLazyComponent(
    () => import(/* webpackChunkName: "add-cover" */ './AddCover'),
    {
      preload: false,
      namedImport: 'AddCover',
    },
  );
  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-nusku',
          feature: 'Card Covers',
        }}
      >
        <AddCover
          cardId={cardId}
          navigateToSelectCover={navigateToSelectCover}
        />
      </ErrorBoundary>
    </Suspense>
  );
}
