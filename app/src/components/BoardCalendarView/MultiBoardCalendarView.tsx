import React, { useCallback, Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

import { Feature } from 'app/scripts/debug/constants';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ViewsErrorMessage } from 'app/src/components/ViewsErrorMessage';

interface MultiBoardCalendarViewProps {
  idOrg: string;
}

export const MultiBoardCalendarView: React.FunctionComponent<MultiBoardCalendarViewProps> = ({
  idOrg,
}) => {
  const CalendarView = useLazyComponent(
    () => import(/* webpackChunkName: "calendar-view" */ './CalendarView'),
    { namedImport: 'CalendarView' },
  );

  const handleError = useCallback(() => {
    return (
      <>
        <ViewsErrorMessage
          screenEventName="multiBoardTableViewErrorScreen"
          analyticsContainers={{ organization: { id: idOrg } }}
        />
      </>
    );
  }, [idOrg]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-panorama',
        feature: Feature.CalendarView,
      }}
      errorHandlerComponent={handleError}
    >
      <Suspense fallback={null}>
        <CalendarView shouldRenderBoardEmptyState={true} />
      </Suspense>
    </ErrorBoundary>
  );
};
