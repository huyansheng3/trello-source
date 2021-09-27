// Package imports
import React, { useCallback, useContext, useEffect, useState } from 'react';
import moment from 'moment';

// @atlassian and @trello imports
import { Analytics } from '@trello/atlassian-analytics';
// @ts-expect-error
import { Events } from '@trello/backbone';
// eslint-disable-next-line no-restricted-imports
import { CheckItem_State } from '@trello/graphql/generated';
import { CalendarViewTestIds } from '@trello/test-ids';

// Nested directory imports
import { LabelColor } from 'app/gamma/src/types/models';
import { LabelState } from 'app/scripts/view-models/label-state';
import {
  ViewBoard,
  BoardViewContext,
} from 'app/src/components/BoardViewContext/BoardViewContext';
import { useUpdateCardDatesMutation } from 'app/src/components/ViewsGenerics/UpdateCardDatesMutation.generated';

// Sibling file imports
import { AddPopoverContextProvider } from './AddPopoverContext';
import { Calendar } from './Calendar';
import { CalendarContextProvider } from './CalendarContext';
import { useCalendarViewMemberQuery } from './CalendarViewMemberQuery.generated';
import { CalendarSettings } from './CalendarSettings';
import { DraggableContextProvider } from './Draggable';
import { getCurrentDateSlot, getCurrentDateSlotBeginning } from './helpers';
import { ResizableContextProvider } from './Resizable';
import {
  AnalyticsContainer,
  EventData,
  List,
  Members,
  UpdateEventDatesParams,
} from './types';

import styles from './CalendarView.less';

interface CalendarViewProps {
  shouldRenderBoardEmptyState?: boolean;
}

export const CalendarView: React.FunctionComponent<CalendarViewProps> = ({
  shouldRenderBoardEmptyState,
}) => {
  const [updateCardDates] = useUpdateCardDatesMutation();

  const {
    boardsData,
    canEditBoard,
    cardsData,
    contextType,
    checklistItemData,
    idBoard,
    idOrg,
  } = useContext(BoardViewContext);
  const isInBoardView = contextType === 'board';

  const {
    data: memberQueryData,
    error: memberQueryError,
    loading: memberQueryLoading,
  } = useCalendarViewMemberQuery();

  const [expandedLabels, setExpandedLabelsState] = useState(
    LabelState.getShowText(),
  );

  useEffect(() => {
    const handleChangeLabelsExpand = (labelState: {
      getShowText: () => boolean;
    }) => {
      setExpandedLabelsState(labelState.getShowText());
    };

    Events.listenTo(LabelState, 'change:showText', handleChangeLabelsExpand);

    return () => {
      Events.stopListening(
        LabelState,
        'change:showText',
        handleChangeLabelsExpand,
      );
    };
  }, []);

  const updateEventDates = useCallback(
    async (
      { event, start, end }: UpdateEventDatesParams,
      isResizeAction = false,
    ) => {
      if (!canEditBoard(event.data.idBoard)) {
        return;
      }
      const { data, isChecklistItem } = event,
        {
          currentDue,
          currentStart,
          id,
          idBoard,
          idEnterprise,
          idOrganization,
        } = data;

      // If we are resizing, we will set a start/due date
      // if the card has an empty start/due date.
      // If we are dragging and dropping, we will persist any
      // empty start/due dates.
      const initialStart = isResizeAction ? event.start : currentStart;
      const initialEnd = isResizeAction ? event.end : currentDue;
      const startDateChanged =
        initialStart && !moment(initialStart).isSame(start);
      const dueDateChanged = initialEnd && !moment(initialEnd).isSame(end);

      // Check to see if the event was moved to a new date
      if (startDateChanged || dueDateChanged) {
        const startDate = (initialStart &&
          moment(start).toISOString()) as string;

        const dueDate = (initialEnd && moment(end).toISOString()) as string;

        if (!isChecklistItem) {
          const ui_action = isResizeAction ? 'stretch' : 'drag';

          const analyticsInfo = {
            attributes: { ui_action, contextType },
            containers: {
              board: { id: idBoard || null },
              organization: { id: idOrganization || null },
              enterprise: { id: idEnterprise || null },
            },
          };

          if (startDateChanged) {
            Analytics.sendTrackEvent({
              action: 'set',
              actionSubject: 'startDate',
              source: 'calendarViewScreen',
              ...analyticsInfo,
            });
          }

          if (dueDateChanged) {
            Analytics.sendTrackEvent({
              action: 'set',
              actionSubject: 'dueDate',
              source: 'calendarViewScreen',
              ...analyticsInfo,
            });
          }

          await updateCardDates({
            variables: {
              idCard: id,
              start: startDate,
              due: dueDate,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateCardDates: {
                id: id,
                start: startDate,
                due: dueDate,
                __typename: 'Card',
              },
            },
          });
        }
      }
    },
    [canEditBoard, updateCardDates, contextType],
  );

  const handleResizeEvent = useCallback(
    async (args: UpdateEventDatesParams) => {
      await updateEventDates(args, true);
    },
    [updateEventDates],
  );

  const getListPosition = useCallback((board: ViewBoard, idList: string) => {
    return board.lists?.find((list: List) => list.id === idList)?.pos as number;
  }, []);

  const showErrorState = !!(
    boardsData.error ||
    memberQueryError ||
    cardsData.error
  );
  const showLoadingState =
    memberQueryLoading || boardsData.isLoading || cardsData.isLoadingInitial;
  const showEmptyState = !boardsData.boards || !boardsData.boards.length;

  let settingsComponent;
  let activeLists: List[] = [];
  const analyticsContainers: AnalyticsContainer = {
    organization: { id: idOrg || null },
  };
  const events: EventData[] = [];

  if (
    !showErrorState &&
    !showLoadingState &&
    !showEmptyState &&
    boardsData.boards
  ) {
    cardsData.cards
      .filter((card) => card.due || card.start)
      .forEach((card) => {
        const {
          due,
          dueComplete,
          id: idCard,
          idBoard,
          idList,
          idMembers,
          labels,
          name,
          pos: cardPosition,
          start,
          url: cardUrl,
        } = card;

        const matchingBoard = boardsData.boards?.find(
          (board) => board.id === idBoard,
        ) as ViewBoard;

        const { idEnterprise, idOrganization } = matchingBoard;

        const membersAssigned = idMembers.map((idMember) =>
          matchingBoard.members.find(
            (boardMember) => boardMember.id === idMember,
          ),
        ) as Members;

        let eventStart = start && new Date(start);
        let eventEnd = due && new Date(due);
        if (eventStart && !eventEnd) {
          eventEnd = eventStart;
        } else if (!eventStart && eventEnd) {
          eventStart = eventEnd;
        }

        events.push({
          title: name,
          start: eventStart as Date,
          end: eventEnd as Date,
          isChecklistItem: false,
          allDay: !due,
          data: {
            id: idCard,
            idBoard: idBoard,
            idOrganization: idOrganization,
            idEnterprise: idEnterprise,
            complete: dueComplete,
            membersAssigned: membersAssigned,
            labels: labels.map((label) => ({
              color: label.color as LabelColor,
              id: label.id,
              idBoard: idBoard,
              name: label.name,
            })),
            currentStart: start,
            currentDue: due,
            listPosition: getListPosition(matchingBoard, idList),
            cardPosition: cardPosition,
            cardUrl,
            boardInfo: {
              name: matchingBoard.name,
              url: matchingBoard.url,
              backgroundColor: matchingBoard.prefs?.backgroundColor,
              backgroundImage: matchingBoard.prefs?.backgroundImage,
              backgroundImageScaled: matchingBoard.prefs?.backgroundImageScaled,
              backgroundTile: matchingBoard.prefs?.backgroundTile,
            },
          },
        });
      });

    if (isInBoardView) {
      const currentBoard =
        boardsData.boards.find((board) => board.id === idBoard) ||
        boardsData.boards[0];

      const { id: currentBoardId, idEnterprise } = currentBoard;

      settingsComponent = (
        <CalendarSettings
          idBoard={currentBoardId}
          calendarFeedEnabled={!!currentBoard.prefs?.calendarFeedEnabled}
          calendarKey={currentBoard.myPrefs?.calendarKey || ''}
        />
      );

      activeLists =
        currentBoard.lists
          ?.filter((list) => !list.closed)
          .sort((list1, list2) => list1.pos - list2.pos) || [];

      analyticsContainers.board = { id: currentBoardId || null };
      analyticsContainers.enterprise = { id: idEnterprise || null };

      if (checklistItemData?.checklistItems) {
        checklistItemData?.checklistItems.forEach(
          ({ item, checklist, card }) => {
            const {
              id: idCard,
              idBoard,
              idList,
              name: cardName,
              pos: cardPosition,
              url: cardUrl,
            } = card;

            const matchingBoard = boardsData.boards?.find(
              (board) => board.id === idBoard,
            ) as ViewBoard;

            const { idEnterprise, idOrganization } = matchingBoard;

            const {
              id: idChecklist,
              name: checklistName,
              pos: checklistPosition,
            } = checklist;

            const { due, id, idMember, name, pos, state } = item;

            const matchingMember = matchingBoard.members.find(
              (boardMember) => boardMember.id === idMember,
            );

            const membersAssigned =
              idMember && matchingMember ? ([matchingMember] as Members) : [];

            const end = new Date(due as string);

            events.push({
              title: name,
              start: end,
              end,
              isChecklistItem: true,
              // TODO remove this if we remove the old day/week grid
              allDay: !!due,
              data: {
                id: id,
                idChecklist,
                idCard,
                idBoard: idBoard,
                idOrganization,
                idEnterprise,
                complete: state !== CheckItem_State.Incomplete,
                currentDue: due,
                membersAssigned,
                listPosition: getListPosition(matchingBoard, idList),
                cardPosition,
                checklistPosition,
                checklistItemPosition: pos,
                checklistInfo: {
                  cardName,
                  checklistName,
                },
                cardUrl,
              },
            });
          },
        );
      }
    }
  }

  return (
    <div
      className={styles.main}
      data-test-id={CalendarViewTestIds.CalendarWrapper}
    >
      <CalendarContextProvider
        colorBlind={!!memberQueryData?.member?.prefs?.colorBlind}
        expandedLabels={expandedLabels}
      >
        <ResizableContextProvider
          getDateSlot={getCurrentDateSlotBeginning}
          onEndResize={handleResizeEvent}
        >
          <DraggableContextProvider
            getDateSlot={getCurrentDateSlot}
            onEndDrag={updateEventDates}
          >
            <AddPopoverContextProvider
              hasAddPermission={
                !!(
                  activeLists &&
                  activeLists.length > 0 &&
                  idBoard &&
                  canEditBoard(idBoard)
                )
              }
              activeLists={activeLists}
              analyticsContainers={analyticsContainers}
            >
              <Calendar
                events={events}
                analyticsContainers={analyticsContainers}
                settingsComponent={settingsComponent}
                showErrorState={showErrorState}
                showLoadingState={showLoadingState}
                isLoadingMore={cardsData?.isLoadingMore}
                showEmptyState={showEmptyState}
                shouldRenderBoardEmptyState={shouldRenderBoardEmptyState}
              />
            </AddPopoverContextProvider>
          </DraggableContextProvider>
        </ResizableContextProvider>
      </CalendarContextProvider>
    </div>
  );
};
