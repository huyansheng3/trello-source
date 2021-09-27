import { EventContext } from '@trello/analytics';
import React from 'react';

export interface ReactionAnalyticsContextType extends EventContext {
  actionId: string;
  boardId: string;
  cardId: string;
  listId: string;
}

export const ReactionAnalyticsContext: React.Context<ReactionAnalyticsContextType> = React.createContext(
  {
    actionId: '',
    boardId: '',
    cardId: '',
    listId: '',
  },
);
