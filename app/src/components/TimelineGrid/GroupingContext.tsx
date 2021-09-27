import React, { createContext } from 'react';
import { GroupByOption } from 'app/src/components/ViewsGenerics';

export const GroupingContext = createContext<GroupByOption>(GroupByOption.LIST);

interface GroupingContextProviderProps {
  grouping: GroupByOption;
}

export const GroupingContextProvider: React.FC<GroupingContextProviderProps> = ({
  grouping,
  children,
}) => {
  return (
    <GroupingContext.Provider value={grouping}>
      {children}
    </GroupingContext.Provider>
  );
};
