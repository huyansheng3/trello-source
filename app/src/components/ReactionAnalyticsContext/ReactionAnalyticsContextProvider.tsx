import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { getReactionAnalyticsContextByActionId } from 'app/gamma/src/selectors/reactions';
import { ReactionAnalyticsContext } from './ReactionAnalyticsContext';

interface ReactionAnalyticsContextProviderProps {
  idAction?: string;
  children: React.ReactNode;
}

export const ReactionAnalyticsContextProvider = ({
  idAction,
  children,
}: ReactionAnalyticsContextProviderProps) => {
  const analyticsContext = useSelector((state: State) =>
    getReactionAnalyticsContextByActionId(state, idAction),
  );

  return (
    <ReactionAnalyticsContext.Provider value={analyticsContext}>
      {children}
    </ReactionAnalyticsContext.Provider>
  );
};
