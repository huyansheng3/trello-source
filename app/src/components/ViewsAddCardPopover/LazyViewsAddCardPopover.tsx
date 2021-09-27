import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import { ViewsAddCardPopoverProps } from './types';

export const LazyViewsAddCardPopover: React.FunctionComponent<ViewsAddCardPopoverProps> = (
  props,
) => {
  const ViewsAddCardPopover = useLazyComponent(
    () =>
      import(/* webpackChunkName: "views-add-card" */ './ViewsAddCardPopover'),
    { namedImport: 'ViewsAddCardPopover' },
  );
  return (
    <ComponentWrapper key="views-add-card">
      <Suspense fallback={null}>
        <ViewsAddCardPopover {...props} />
      </Suspense>
    </ComponentWrapper>
  );
};
