import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export const LazyBoardsMenu = () => {
  const BoardsMenu = useLazyComponent(
    () => import(/* webpackChunkName: "boards-menu" */ './BoardsMenu'),
    { preload: false, namedImport: 'BoardsMenu' },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <BoardsMenu />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
