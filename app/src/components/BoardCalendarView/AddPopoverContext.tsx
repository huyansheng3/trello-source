import React, { createContext, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';

import { AddCardData } from 'app/src/components/ViewsAddCardPopover/types';
import { AddListData } from 'app/src/components/ViewsAddListPopover/types';
import { AddCardTrigger } from 'app/src/components/ViewsGenerics/types';

import { AnalyticsContainer, List } from './types';

interface Position {
  top?: number;
  left?: number;
}

interface AddPopoverContextState {
  hasAddPermission: boolean;
  showAddCard: boolean;
  setShowAddCard: React.Dispatch<React.SetStateAction<boolean>>;
  showAddList: boolean;
  setShowAddList: React.Dispatch<React.SetStateAction<boolean>>;
  popoverPosition: Position;
  setPopoverPosition: React.Dispatch<React.SetStateAction<Position>>;
  activeLists: List[];
  addCardList?: string;
  onAddCardSubmit: (data: AddCardData) => void;
  onAddListSubmit: (data: AddListData) => void;
  cardToHighlight?: string | undefined;
  addCardTrigger: AddCardTrigger;
  setAddCardTrigger: React.Dispatch<React.SetStateAction<AddCardTrigger>>;
  doNotScroll: boolean;
  setDoNotScroll: React.Dispatch<React.SetStateAction<boolean>>;
  openPopoverFromMousePosition: (position: Position, date: number) => void;
  setPopoverDefaultTime: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  popoverDefaultTime?: number;
}

export const AddPopoverContext = createContext<AddPopoverContextState>({
  hasAddPermission: false,
  showAddCard: false,
  setShowAddCard() {},
  showAddList: false,
  setShowAddList() {},
  popoverPosition: { top: 0, left: 0 },
  setPopoverPosition() {},
  activeLists: [],
  addCardList: undefined,
  onAddCardSubmit() {},
  onAddListSubmit() {},
  cardToHighlight: undefined,
  addCardTrigger: AddCardTrigger.BUTTON,
  setAddCardTrigger() {},
  doNotScroll: false,
  setDoNotScroll() {},
  openPopoverFromMousePosition() {},
  setPopoverDefaultTime() {},
  popoverDefaultTime: undefined,
});

interface AddPopoverContextProviderProps {
  hasAddPermission: boolean;
  activeLists: List[];
  analyticsContainers: AnalyticsContainer;
}

export const AddPopoverContextProvider: React.FC<AddPopoverContextProviderProps> = ({
  hasAddPermission,
  activeLists,
  analyticsContainers,
  children,
}) => {
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [popoverPosition, setPopoverPosition] = useState<Position>({
    top: 0,
    left: 0,
  });
  const [addCardList, setAddCardList] = useState<string | undefined>();
  const [cardToHighlight, setCardToHighlight] = useState<string | undefined>();
  const [addCardTrigger, setAddCardTrigger] = useState<AddCardTrigger>(
    AddCardTrigger.BUTTON,
  );
  const [doNotScroll, setDoNotScroll] = useState<boolean>(false);
  const [popoverDefaultTime, setPopoverDefaultTime] = useState<
    number | undefined
  >(undefined);

  const onAddCardSubmit = (data: AddCardData) => {
    setDoNotScroll(false);
    Analytics.sendTrackEvent({
      action: 'created',
      actionSubject: 'card',
      source: 'calendarViewScreen',
      containers: analyticsContainers,
      attributes: {
        taskId: data.traceId,
        trigger: addCardTrigger,
      },
    });
    setAddCardList(data.idList);
    setCardToHighlight(data.idCard);
    setTimeout(() => {
      setCardToHighlight(undefined);
    }, 1500);
  };

  const onAddListSubmit = (data: AddListData) => {
    Analytics.sendTrackEvent({
      action: 'created',
      actionSubject: 'list',
      source: 'calendarViewScreen',
      containers: analyticsContainers,
      attributes: {
        taskId: data.traceId,
      },
    });
  };

  const openPopoverFromMousePosition = (position: Position, date: number) => {
    setAddCardTrigger(AddCardTrigger.LANE);
    setDoNotScroll(true);
    setPopoverPosition(position);
    setPopoverDefaultTime(date);
    setShowAddCard(true);
  };

  return (
    <AddPopoverContext.Provider
      value={{
        hasAddPermission,
        showAddCard,
        setShowAddCard,
        showAddList,
        setShowAddList,
        popoverPosition,
        setPopoverPosition,
        activeLists,
        addCardList,
        onAddCardSubmit,
        onAddListSubmit,
        cardToHighlight,
        addCardTrigger,
        setAddCardTrigger,
        doNotScroll,
        setDoNotScroll,
        openPopoverFromMousePosition,
        setPopoverDefaultTime,
        popoverDefaultTime,
      }}
    >
      {children}
    </AddPopoverContext.Provider>
  );
};
