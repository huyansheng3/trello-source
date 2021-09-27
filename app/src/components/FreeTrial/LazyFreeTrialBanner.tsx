import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { FreeTrialBannerProps } from './FreeTrialBanner';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyFreeTrialBanner(props: FreeTrialBannerProps) {
  const FreeTrialBanner = useLazyComponent(
    () =>
      import(/* webpackChunkName: "free-trial-banner" */ './FreeTrialBanner'),
    {
      preload: false,
      namedImport: 'FreeTrialBanner',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-bizteam',
          feature: 'Free Trial',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <FreeTrialBanner {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
