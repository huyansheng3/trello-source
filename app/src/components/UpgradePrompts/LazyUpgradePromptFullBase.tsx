import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { UpgradePromptFullBaseProps } from './UpgradePromptFullBase';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyUpgradePromptFullBase(props: UpgradePromptFullBaseProps) {
  const UpgradePromptFullBase = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-prompt-full-base" */ './UpgradePromptFullBase'
      ),
    {
      preload: false,
      namedImport: 'UpgradePromptFullBase',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-bizteam',
          feature: 'Upgrade Prompts',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <UpgradePromptFullBase {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
