import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ViewsAddListPopoverProps } from './types';

export const LazyViewsAddListPopover: React.FunctionComponent<ViewsAddListPopoverProps> = (
  props,
) => {
  const ViewsAddListPopover = useLazyComponent(
    () =>
      import(/* webpackChunkName: "views-add-card" */ './ViewsAddListPopover'),
    { namedImport: 'ViewsAddListPopover' },
  );
  return (
    <ComponentWrapper key="views-add-card">
      <Suspense fallback={null}>
        <ViewsAddListPopover {...props} />
      </Suspense>
    </ComponentWrapper>
  );
};
