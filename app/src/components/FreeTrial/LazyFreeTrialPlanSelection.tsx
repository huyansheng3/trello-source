import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { FreeTrialPlanSelectionProps } from './FreeTrialPlanSelection';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyFreeTrialPlanSelection(props: FreeTrialPlanSelectionProps) {
  const FreeTrialPlanSelection = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "free-trial-plan-selection" */ './FreeTrialPlanSelection'
      ),
    {
      preload: false,
      namedImport: 'FreeTrialPlanSelection',
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
          <FreeTrialPlanSelection {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
