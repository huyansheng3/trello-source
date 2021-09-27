import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { ExpiredTrialPlanSelectionProps } from './ExpiredTrialPlanSelection';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyExpiredTrialPlanSelection(
  props: ExpiredTrialPlanSelectionProps,
) {
  const ExpiredTrialPlanSelection = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "expired-trial-plan-selection" */ './ExpiredTrialPlanSelection'
      ),
    {
      preload: false,
      namedImport: 'ExpiredTrialPlanSelection',
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
          <ExpiredTrialPlanSelection {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
