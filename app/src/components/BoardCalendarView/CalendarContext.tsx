import React, { createContext } from 'react';

interface CalendarContextState {
  colorBlind: boolean;
  expandedLabels: boolean;
}

export const CalendarContext = createContext<CalendarContextState>({
  colorBlind: false,
  expandedLabels: false,
});

interface CalendarContextProviderProps {
  colorBlind: boolean;
  expandedLabels: boolean;
}

export const CalendarContextProvider: React.FC<CalendarContextProviderProps> = ({
  colorBlind,
  expandedLabels,
  children,
}) => {
  return (
    <CalendarContext.Provider
      value={{
        colorBlind,
        expandedLabels,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
