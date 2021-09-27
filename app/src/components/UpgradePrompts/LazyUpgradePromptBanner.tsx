import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { UpgradePromptBannerProps } from './UpgradePromptBanner';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyUpgradePromptBanner(props: UpgradePromptBannerProps) {
  const UpgradePromptBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-prompt-banner" */ './UpgradePromptBanner'
      ),
    {
      preload: false,
      namedImport: 'UpgradePromptBanner',
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
          <UpgradePromptBanner {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
