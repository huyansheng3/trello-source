import React, { createContext } from 'react';

interface PaginationContextState {
  fetchCardsInNewRange: (newDate: Date) => void;
}

export const PaginationContext = createContext<PaginationContextState>({
  fetchCardsInNewRange() {},
});

interface PaginationContextProviderProps {
  fetchCardsInNewRange: (newDate: Date) => void;
}

export const PaginationContextProvider: React.FC<PaginationContextProviderProps> = ({
  fetchCardsInNewRange,
  children,
}) => {
  return (
    <PaginationContext.Provider value={{ fetchCardsInNewRange }}>
      {children}
    </PaginationContext.Provider>
  );
};
