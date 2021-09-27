import React, { useCallback, useContext, useMemo } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';

import { BoardViewContext } from 'app/src/components/BoardViewContext/BoardViewContext';

import { sortByPosition } from 'app/src/components/BoardCalendarView/helpers';
import { CalendarEvent } from 'app/src/components/BoardCalendarView/Shared';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import styles from './ChecklistCluster.less';

const format = forTemplate('calendar-view', {
  returnBlankForMissingStrings: true,
});

interface ChecklistClusterProps {
  cardName: string;
  checklistName: string;
  checkItems: EventData[];
  idCard: string;
  idBoard: string;
  idOrganization?: string | null;
  idEnterprise?: string | null;
}

export const ChecklistCluster: React.FC<ChecklistClusterProps> = ({
  cardName,
  checklistName,
  checkItems,
  idCard,
  idBoard,
  idOrganization,
  idEnterprise,
}) => {
  const { contextType, navigateToCard } = useContext(BoardViewContext);

  const handleOpenCard = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'calendarCheckItemButton',
      source: 'calendarViewScreen',
      containers: {
        board: { id: idBoard },
        organization: { id: idOrganization || null },
        enterprise: { id: idEnterprise || null },
      },
      attributes: { contextType },
    });

    navigateToCard(idCard);
  }, [
    idBoard,
    idCard,
    idEnterprise,
    idOrganization,
    navigateToCard,
    contextType,
  ]);

  const sortedChecklistItems = useMemo(() => {
    return checkItems.sort(sortByPosition);
  }, [checkItems]);

  if (sortedChecklistItems.length > 0) {
    return (
      <div className={styles.checklistItemCluster}>
        <div className={styles.description}>
          <span
            className={styles.checklistDescription}
            role="link"
            onClick={handleOpenCard}
          >
            {checklistName}
          </span>
          ,{' '}
          <span className={styles.cardDescription}>
            {format('from')}{' '}
            <span
              className={styles.cardName}
              role="link"
              onClick={handleOpenCard}
            >
              {cardName}
            </span>
          </span>
        </div>
        {sortedChecklistItems.map((item) => (
          <CalendarEvent
            key={item.data.id}
            event={item}
            preventChecklistInfo={true}
          />
        ))}
      </div>
    );
  }

  return null;
};
