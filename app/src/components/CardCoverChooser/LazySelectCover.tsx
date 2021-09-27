import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { SelectCoverProps } from './SelectCover';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';

export function LazySelectCover({
  boardId,
  cardId,
  navigateToAddCover,
}: SelectCoverProps) {
  const SelectCover = useLazyComponent(
    () => import(/* webpackChunkName: "select-cover" */ './SelectCover'),
    {
      preload: false,
      namedImport: 'SelectCover',
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
        <SelectCover
          boardId={boardId}
          cardId={cardId}
          navigateToAddCover={navigateToAddCover}
        />
      </ErrorBoundary>
    </Suspense>
  );
}
