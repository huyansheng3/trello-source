import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { UpsellOverlayProps } from './UpsellOverlay';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyUpsellOverlay(props: UpsellOverlayProps) {
  const UpsellOverlay = useLazyComponent(
    () => import(/* webpackChunkName: "upsell-overlay" */ './UpsellOverlay'),
    {
      preload: false,
      namedImport: 'UpsellOverlay',
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
          <UpsellOverlay {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
