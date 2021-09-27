import React, { useCallback } from 'react';

import { JumpToCalendar } from 'app/src/components/ViewsGenerics/JumpToCalendar';
import {
  NavigationDirection,
  ViewType,
} from 'app/src/components/ViewsGenerics/types';
import {
  AnalyticsContainer,
  EventData,
} from 'app/src/components/BoardCalendarView/types';

import styles from './PanelCalendar.less';

interface PanelCalendarProps {
  selectedDate: Date;
  events: EventData[];
  onNavigate: (direction: NavigationDirection | null, newDate?: Date) => void;
  analyticsContainers: AnalyticsContainer;
}

export const PanelCalendar: React.FC<PanelCalendarProps> = ({
  selectedDate,
  events,
  onNavigate,
  analyticsContainers,
}) => {
  const onNavigateToDate = useCallback(
    (newDate: Date) => {
      onNavigate(null, newDate);
    },
    [onNavigate],
  );

  return (
    <div className={styles.panelCalendar}>
      <JumpToCalendar
        events={events}
        onNavigateToDate={onNavigateToDate}
        defaultDate={selectedDate}
        selectedDate={selectedDate}
        viewName={ViewType.CALENDAR}
        analyticsContainers={analyticsContainers}
        includeDateCellData={true}
      />
    </div>
  );
};
