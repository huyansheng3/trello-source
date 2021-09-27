import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { PlanSelectionOverlayProps } from './PlanSelectionOverlay';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyPlanSelectionOverlay(props: PlanSelectionOverlayProps) {
  const PlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-selection-overlay" */ './PlanSelectionOverlay'
      ),
    {
      preload: false,
      namedImport: 'PlanSelectionOverlay',
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
          <PlanSelectionOverlay {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}

export function LazyPlanSelectionOverlayConnected(
  props: PlanSelectionOverlayProps,
) {
  const PlanSelectionOverlayConnected = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-selection-overlay" */ './PlanSelectionOverlay'
      ),
    {
      preload: false,
      namedImport: 'PlanSelectionOverlayConnected',
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
          <PlanSelectionOverlayConnected {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
