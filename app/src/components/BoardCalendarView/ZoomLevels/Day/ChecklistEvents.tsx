import React, { useMemo } from 'react';
import _ from 'underscore';

import { sortByPosition } from 'app/src/components/BoardCalendarView/helpers';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import { ChecklistCluster } from './ChecklistCluster';

interface ChecklistEventsProps {
  checklistItems: EventData[];
}

export const ChecklistEvents: React.FC<ChecklistEventsProps> = ({
  checklistItems,
}) => {
  const checklistsToRender = useMemo(() => {
    const checkItemsGrouped = _.groupBy(
      checklistItems,
      (item: EventData) => item.data.idChecklist,
    );

    return Object.keys(checkItemsGrouped)
      .map((idChecklist) => checkItemsGrouped[idChecklist])
      .sort((checklistItemsA, checklistItemsB) =>
        sortByPosition(checklistItemsA[0], checklistItemsB[0]),
      )
      .map((checkItems) => {
        const firstCheckItem = checkItems[0],
          { data } = firstCheckItem,
          {
            checklistInfo = { cardName: '', checklistName: '' },
            idCard,
            idBoard,
            idOrganization,
            idEnterprise,
          } = data,
          { cardName, checklistName } = checklistInfo;

        return {
          cardName,
          checklistName,
          checkItems,
          idCard: idCard!,
          idBoard,
          idOrganization,
          idEnterprise,
        };
      });
  }, [checklistItems]);

  return (
    <div>
      {checklistsToRender.map((checklistData, index) => (
        <ChecklistCluster key={index} {...checklistData} />
      ))}
    </div>
  );
};
