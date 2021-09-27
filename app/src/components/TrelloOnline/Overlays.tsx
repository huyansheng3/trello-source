import React, { Suspense } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
  OverlayType,
  OverlayContext,
  removeOverlay,
} from 'app/gamma/src/modules/state/ui/overlay';
import { State } from 'app/gamma/src/modules/types';
import {
  getActiveOverlay,
  getOverlayContext,
} from 'app/gamma/src/selectors/overlays';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ReduxProvider } from 'app/src/components/ReduxProvider';

export const Overlays = () => {
  let component = null;

  const PlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-selection-overlay" */ 'app/src/components/FreeTrial'
      ),
    {
      preload: false,
      namedImport: 'PlanSelectionOverlayConnected',
    },
  );

  const dispatch = useDispatch();
  const overlay = useSelector((state: State) => getActiveOverlay(state));
  const context: OverlayContext = useSelector((state: State) =>
    getOverlayContext(state),
  );

  if (overlay === OverlayType.PlanSelection) {
    component = context?.orgId && (
      <PlanSelectionOverlay
        orgId={context?.orgId}
        // eslint-disable-next-line react/jsx-no-bind
        onClose={() => {
          dispatch(removeOverlay());
        }}
      />
    );
  }

  return <Suspense fallback={null}>{component}</Suspense>;
};

export const WithReduxProvider = () => {
  return (
    <ReduxProvider>
      <Overlays />
    </ReduxProvider>
  );
};
