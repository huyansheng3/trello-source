import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import { CustomFieldBadgesListProps } from './types';

export const LazyCustomFieldBadgesList: React.FunctionComponent<CustomFieldBadgesListProps> = (
  props,
) => {
  const CustomFieldBadgesList = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "custom-fields-badges-list" */ './CustomFieldBadgesList'
      ),
    { namedImport: 'CustomFieldBadgesList' },
  );
  return (
    <ComponentWrapper key="custom-fields-badges-list">
      <Suspense fallback={null}>
        <CustomFieldBadgesList {...props} />
      </Suspense>
    </ComponentWrapper>
  );
};
