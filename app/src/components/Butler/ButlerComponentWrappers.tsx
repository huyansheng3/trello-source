/* eslint-disable @trello/export-matches-filename */

import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Feature } from 'app/scripts/debug/constants';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import type { ButlerCardButtonsProps } from './Buttons/ButlerCardButtons';
import type { AutomaticReportsViewProps } from './Reports/types';
import type { ButlerListMenuSectionProps } from './ListRule/ButlerListMenuSection';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

// Entry points required for lazily loading Butler components in non-React contexts.

export const ButlerCardButtonsWrapper: React.FunctionComponent<ButlerCardButtonsProps> = (
  props,
) => {
  const ButlerCardButtons = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-card-buttons" */ './Buttons/ButlerCardButtons'
      ),
    { namedImport: 'ButlerCardButtons', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-workflowers',
          feature: Feature.ButlerOnBoards,
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <ButlerCardButtons {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};

export const AutomaticReportsWrapper: React.FunctionComponent<AutomaticReportsViewProps> = (
  props,
) => {
  const AutomaticReportsView = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "automatic-reports-view" */ './Reports/AutomaticReportsView'
      ),
    { namedImport: 'AutomaticReportsView', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <AutomaticReportsView {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};

export const ButlerListMenuSectionWrapper: React.FunctionComponent<ButlerListMenuSectionProps> = (
  props,
) => {
  const ButlerListMenuSection = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-list-menu-section" */ './ListRule/ButlerListMenuSection'
      ),
    { namedImport: 'ButlerListMenuSection', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <ButlerListMenuSection {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
