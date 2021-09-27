import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { MoreMenuProps } from './MoreMenu';

export const LazyMoreMenu: React.FunctionComponent<MoreMenuProps> = ({
  menuItems,
}) => {
  const MoreMenu = useLazyComponent(
    () => import(/* webpackChunkName: "more-menu" */ './MoreMenu'),
    { namedImport: 'MoreMenu' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.NavigationMoreMenu,
      }}
    >
      <Suspense fallback={null}>
        <MoreMenu menuItems={menuItems} />
      </Suspense>
    </ErrorBoundary>
  );
};
