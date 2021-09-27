import React, { Suspense } from 'react';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { useLazyComponent } from '@trello/use-lazy-component';
import type { WorkspaceChooserProps } from './WorkspaceChooser';

export function LazyWorkspaceChooser(props: WorkspaceChooserProps) {
  const WorkspaceChooser = useLazyComponent(
    () =>
      import(/* webpackChunkName: "workspace-chooser" */ './WorkspaceChooser'),
    {
      preload: false,
      namedImport: 'WorkspaceChooser',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-bizteam',
          feature: 'WorkspaceChooser',
        }}
      >
        <WorkspaceChooser {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
