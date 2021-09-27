import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { UpgradeSmartComponentProps } from './UpgradeSmartComponent';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export function LazyUpgradeSmartComponentConnected(
  props: UpgradeSmartComponentProps,
) {
  const UpgradeSmartComponent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-smart-component" */ './UpgradeSmartComponent'
      ),
    {
      preload: false,
      namedImport: 'UpgradeSmartComponentConnected',
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
          <UpgradeSmartComponent {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}

export function LazyUpgradeSmartComponent(props: UpgradeSmartComponentProps) {
  const UpgradeSmartComponent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-smart-component" */ './UpgradeSmartComponent'
      ),
    {
      preload: false,
      namedImport: 'UpgradeSmartComponent',
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
          <UpgradeSmartComponent {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
