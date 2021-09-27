import React, { useState, useRef, useContext, useEffect } from 'react';
import cx from 'classnames';

import { Analytics } from '@trello/atlassian-analytics';
import {
  useFeatureFlag,
  seesVersionedVariation,
} from '@trello/feature-flag-client';

import {
  useShortcutHandler,
  Scope as ShortcutScope,
} from '@trello/keybindings';

import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';

import { Feature } from 'app/scripts/debug/constants';

import {
  GroupByOption,
  ZoomLevel,
  AddNewType,
  AddCardTrigger,
} from 'app/src/components/ViewsGenerics/types';
import { ViewAddNew } from 'app/src/components/ViewsGenerics/ViewAddNew';
import { LazyViewsAddCardPopover as ViewsAddCardPopover } from 'app/src/components/ViewsAddCardPopover/LazyViewsAddCardPopover';
import { AddCardData } from 'app/src/components/ViewsAddCardPopover/types';
import { LazyViewsAddListPopover as ViewsAddListPopover } from 'app/src/components/ViewsAddListPopover/LazyViewsAddListPopover';
import { AddListData } from 'app/src/components/ViewsAddListPopover/types';

import {
  Members,
  TimelineGroup,
  TimelineItem,
  Position,
  LaneDoubleClickParams,
} from 'app/src/components/TimelineGrid/types';
import { TimelineGrid } from 'app/src/components/TimelineGrid';

import { useTimelineMemberQuery } from './TimelineMemberQuery.generated';
import styles from './TimelineView.less';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { forTemplate } from '@trello/i18n';
import {
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
} from 'app/src/components/WorkspaceNavigation';

import { useSocketSubscription } from 'app/scripts/init/useSocketSubscription';

import { TimelineTestIds } from '@trello/test-ids';
import { PermissionsContext } from 'app/src/components/BoardDashboardView/PermissionsContext';

import {
  BoardViewContext,
  ViewCard,
} from 'app/src/components/BoardViewContext';

interface TimelineViewProps {
  idBoard: string;
}

const format = forTemplate('timeline');
const formatViews = forTemplate('views');

const formatCardItem = (
  card: ViewCard,
  members: Members = [],
  idGroups: string[],
  addCardId: string | undefined,
) => {
  // If only one of the dates is missing,
  // internally set the missing date equal to present date.
  let cardStart = card.start;
  let cardDue = card.due;
  if (cardStart && !cardDue) {
    cardDue = cardStart;
  } else if (!cardStart && cardDue) {
    cardStart = cardDue;
  }

  return {
    id: card.id,
    startTime: new Date(cardStart).getTime(),
    endTime: new Date(cardDue as string).getTime(),
    idGroups: idGroups,
    title: card.name,
    idMembers: card.idMembers,
    members: card.idMembers.reduce((result: Members, idMember: string) => {
      const memberData = members.find((member) => member.id === idMember);
      if (memberData) {
        result.push(memberData);
      }
      return result;
    }, []),
    badges: card.badges,
    labels: card.labels,
    showPulse: !!((card.start || card.due) && card.id === addCardId),
    originalStartTime: card.start,
    originalEndTime: card.due || undefined,
  };
};

export const TimelineView: React.FunctionComponent<TimelineViewProps> = ({
  idBoard,
}) => {
  const { navigateToCard, closeView, cardsData, boardsData } = useContext(
    BoardViewContext,
  );
  const board = boardsData?.boards?.[0];
  // TODO: If we want to make TimelineView work within a multi-board context,
  // we'd need to:
  // * Use all boards from `boardsData.boards`, rather than just `boards[0]`.
  //   For example, instead of using `board.labels` in the UI, we'd need to
  //   concatenate labels across all boards.
  // * Use all board ids from `boardsData.boards`, rather than just `idBoard`.
  // * use `getLinkToCardProps` instead of `navigateToCard`, render the cards
  //   as `<a>` elements, so the multi-board timeline can open card links in
  //   a new tab.

  // prevent board and card level shortcuts from firing
  useShortcutHandler(() => {}, {
    scope: ShortcutScope.BoardView,
  });

  useSocketSubscription('Board', idBoard);

  const isAddCardEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const isAddListEnabled = useFeatureFlag('ecosystem.views-add-list', false);

  const loading = cardsData.isLoading;
  const error = cardsData.error;

  const { data: memberQueryData } = useTimelineMemberQuery();

  const [
    {
      expanded: workspaceNavigationExpanded,
      enabled: workspaceNavigationEnabled,
    },
  ] = useWorkspaceNavigation();
  const [
    { hidden: workspaceNavigationHidden },
  ] = useWorkspaceNavigationHidden();

  const colorBlind = memberQueryData?.member?.prefs?.colorBlind || false;

  const idOrg = board?.idOrganization || '';
  const idEnterprise = board?.idEnterprise || '';
  const [grouping, changeGrouping] = useState<GroupByOption>(
    GroupByOption.LIST,
  );
  const [zoom, changeZoom] = useState<ZoomLevel>(ZoomLevel.WEEK);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [pos, setPos] = useState<Position>({ top: 0, left: 0 });
  const [defaultGroupId, setDefaultGroupId] = useState<string | undefined>(
    undefined,
  );
  const [defaultTime, setDefaultTime] = useState<number | undefined>(undefined);
  const [doNotScroll, setDoNotScroll] = useState<boolean>(false);
  const addCardLaneRef = useRef<HTMLButtonElement>(null);
  const [addCardTrigger, setAddCardTrigger] = useState<AddCardTrigger>(
    AddCardTrigger.BUTTON,
  );
  const [addCardList, setAddCardList] = useState<string | undefined>();
  const [addCardId, setAddCardId] = useState<string | undefined>();
  const [scrollToGroup, setScrollToGroup] = useState<string | undefined>();
  const addCardRef = useRef<HTMLButtonElement>(null);

  const [showAddList, setShowAddList] = useState<boolean>(false);

  const { canEdit } = useContext(PermissionsContext);

  const items: Array<TimelineItem> = [];
  const unscheduledItems: Array<TimelineItem> = [];

  const loaded = useRef<boolean>(false);
  useEffect(() => {
    if (!loading && !loaded.current) {
      Analytics.sendScreenEvent({
        name: 'timelineViewScreen',
        containers: {
          organization: { id: idOrg },
          board: { id: idBoard },
          enterprise: { id: idEnterprise },
        },
        attributes: {
          groupBy: grouping,
          zoomLevel: zoom,
          numberCardsOnTimeline: items.length,
          numberUnscheduledCards: unscheduledItems.length,
        },
      });
      loaded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  let timelineGroups: Array<TimelineGroup>;

  let content;

  const onLaneDoubleClick = ({
    pos,
    dueTime,
    groupId,
  }: LaneDoubleClickParams) => {
    if (!canEdit() || board?.lists?.length === 0) {
      return;
    }
    setAddCardTrigger(AddCardTrigger.LANE);
    setDoNotScroll(true);
    setPos(pos);
    setDefaultTime(dueTime);
    setDefaultGroupId(groupId);
    setShowAddCard(true);
  };

  const getGroupingProps = () => {
    const activeLists = board?.lists
      .filter((list) => !list.closed)
      .sort((list1, list2) => list1.pos - list2.pos) || [{ id: undefined }];
    const groupingOpts: {
      selectedListId: string | undefined;
      selectedLabelId?: string | undefined;
      selectedMemberId?: string | undefined;
    } = {
      selectedListId: addCardList || activeLists[0].id,
    };

    if (grouping === GroupByOption.LABEL) {
      if (defaultGroupId && defaultGroupId !== 'no-grouping') {
        groupingOpts.selectedLabelId = defaultGroupId;
      }
    } else if (grouping === GroupByOption.MEMBER) {
      if (defaultGroupId && defaultGroupId !== 'no-grouping') {
        groupingOpts.selectedMemberId = defaultGroupId;
      }
    } else if (grouping === GroupByOption.LIST) {
      groupingOpts.selectedListId =
        defaultGroupId || addCardList || activeLists[0].id;
    }
    return groupingOpts;
  };

  if (error) {
    // temp error screen
    content = <div>Uh oh, and error occurred!</div>;
  } else if (loading && !board) {
    content = <Spinner centered />;
  } else if (board) {
    const activeLists = board?.lists
      .filter((list) => !list.closed)
      .sort((list1, list2) => list1.pos - list2.pos);

    switch (grouping) {
      case GroupByOption.MEMBER:
        timelineGroups = board?.members.map((member) => ({
          id: member.id,
          title: member.fullName || '',
          element: (
            <MemberAvatar idMember={member.id} className={styles.rowIcon} />
          ),
        }));
        timelineGroups.push({
          // no id for cards without members
          id: 'no-grouping',
          title: format('no-members'),
          element: <MemberAvatar idMember={''} className={styles.rowIcon} />,
        });
        break;
      case GroupByOption.LABEL:
        timelineGroups = board?.labels.map((label) => ({
          id: label.id,
          title: label.name,
          element: (
            <div
              className={
                styles.rowIcon +
                ` card-label mod-square card-label-${label.color}`
              }
            ></div>
          ),
        }));
        timelineGroups.push({
          // internal id for unlabeled cards
          id: 'no-grouping',
          title: format('no-labels'),
          element: (
            <div
              className={styles.rowIcon + ' card-label mod-square card-label-'}
            ></div>
          ),
        });
        break;
      case GroupByOption.LIST:
        timelineGroups = activeLists.map((list) => ({
          id: list.id,
          title: list.name,
        }));
        break;
      case GroupByOption.NONE:
      default:
        timelineGroups = [
          {
            id: board.id,
          },
        ];
    }

    cardsData.cards.forEach((card) => {
      let idGroups: string[] = [];

      switch (grouping) {
        case GroupByOption.MEMBER:
          idGroups = card.idMembers;
          break;
        case GroupByOption.LABEL:
          card.labels.map((label) => {
            idGroups.push(label.id);
          });
          break;
        case GroupByOption.LIST:
          idGroups.push(card.idList);
          break;
        case GroupByOption.NONE:
        default:
          idGroups.push(board?.id || '');
      }

      if (
        !(card.start || card.due) ||
        (card.start && card.due && card.start > card.due)
      ) {
        unscheduledItems.push(
          formatCardItem(card, board.members, idGroups, addCardId),
        );
        return;
      }
      items.push(formatCardItem(card, board.members, idGroups, addCardId));
    });

    const listOptions =
      activeLists.map((list) => ({
        id: list.id,
        name: list.name,
      })) || [];
    const labelOptions = board?.labels?.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    }));

    const activeMembers: string[] =
      board?.memberships?.reduce((acc: string[], member) => {
        if (!member.deactivated) {
          acc.push(member.idMember);
        }
        return acc;
      }, []) || [];
    const memberOptions = board?.members
      ?.filter((member) => activeMembers.includes(member.id))
      .map((member) => ({
        id: member.id,
        name: `${member.fullName} (${member.username})`,
      }));

    const onAddCardSubmit = (data: AddCardData) => {
      setDoNotScroll(false);
      Analytics.sendTrackEvent({
        action: 'created',
        actionSubject: 'card',
        source: 'timelineViewScreen',
        containers: {
          board: { id: idBoard },
          organization: { id: idOrg },
          enterprise: { id: idEnterprise },
        },
        attributes: {
          groupBy: grouping,
          zoomLevel: zoom,
          taskId: data.traceId,
          trigger: addCardTrigger,
        },
      });
      setAddCardList(data.idList);
      if (data.start || data.due) {
        setAddCardId(data.idCard);
        setTimeout(() => {
          setAddCardId(undefined);
        }, 1500);
      }
    };

    const onAddListSubmit = (data: AddListData) => {
      Analytics.sendTrackEvent({
        action: 'created',
        actionSubject: 'list',
        source: 'timelineViewScreen',
        containers: {
          board: { id: idBoard },
          organization: { id: idOrg },
          enterprise: { id: idEnterprise },
        },
        attributes: {
          groupBy: grouping,
          zoomLevel: zoom,
          taskId: data.traceId,
          trigger: addCardTrigger,
        },
      });
      if (grouping !== GroupByOption.LIST) {
        changeGrouping(GroupByOption.LIST);
      }
      setScrollToGroup(data.id);
      setShowAddList(false);
    };

    content = (
      <>
        <TimelineGrid
          isLoading={loading}
          items={items}
          timelineGroups={timelineGroups}
          unscheduledItems={unscheduledItems}
          grouping={grouping}
          changeGrouping={changeGrouping}
          zoom={zoom}
          changeZoom={changeZoom}
          navigateToCard={navigateToCard}
          closeView={closeView}
          // eslint-disable-next-line react/jsx-no-bind
          onLaneDoubleClick={onLaneDoubleClick}
          idBoard={idBoard}
          idOrg={idOrg}
          idEnterprise={idEnterprise}
          {...(scrollToGroup && { scrollToGroup: scrollToGroup })}
          doNotScroll={doNotScroll}
        />
        {activeLists.length > 0 && isAddListEnabled && canEdit() && (
          <div
            className={cx({
              [styles.addNewWrapper]: grouping !== GroupByOption.NONE,
            })}
          >
            <ViewAddNew
              // eslint-disable-next-line react/jsx-no-bind
              onSelect={(type: AddNewType) => {
                if (type === AddNewType.CARD) {
                  setAddCardTrigger(AddCardTrigger.BUTTON);
                  setDefaultTime(undefined);
                  setShowAddCard(true);
                } else if (type === AddNewType.LIST) {
                  setShowAddList(true);
                }
              }}
              overrideStyles={{
                addNewButton: cx(styles.addNew, {
                  [styles.addNewNoGrouping]: grouping === GroupByOption.NONE,
                }),
              }}
              ref={addCardRef}
              grouping={grouping}
              zoom={zoom}
              idOrg={idOrg}
              idBoard={idBoard}
              idEnterprise={idEnterprise}
              feature={Feature.TimelineView}
            />
            <button
              className={styles.addCardPositioner}
              style={pos}
              ref={addCardLaneRef}
              tabIndex={-1}
            ></button>
          </div>
        )}
        {activeLists.length > 0 &&
          isAddCardEnabled &&
          !isAddListEnabled &&
          canEdit() && (
            <div
              className={cx({
                [styles.addNewWrapper]: grouping !== GroupByOption.NONE,
              })}
            >
              <Button
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  setAddCardTrigger(AddCardTrigger.BUTTON);
                  setDefaultTime(undefined);
                  setShowAddCard(!showAddCard);
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'timelineAddCardButton',
                    source: 'timelineViewScreen',
                    containers: {
                      organization: { id: idOrg },
                      board: { id: idBoard },
                      enterprise: { id: idEnterprise },
                    },
                    attributes: {
                      groupBy: grouping,
                      zoomLevel: zoom,
                    },
                  });
                }}
                ref={addCardRef}
                className={cx(styles.addNew, {
                  [styles.addNewNoGrouping]: grouping === GroupByOption.NONE,
                })}
                data-test-id={TimelineTestIds.TimelineAddCard}
              >
                {formatViews('add-card')}
              </Button>
              <button
                className={styles.addCardPositioner}
                style={pos}
                ref={addCardLaneRef}
                tabIndex={-1}
              ></button>
            </div>
          )}
        {showAddCard && (
          <ViewsAddCardPopover
            isVisible={showAddCard}
            // eslint-disable-next-line react/jsx-no-bind
            onHide={() => {
              setDefaultGroupId(undefined);
              setDefaultTime(undefined);
              setDoNotScroll(false);
              setShowAddCard(false);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            addCardSubmit={onAddCardSubmit}
            popoverTargetRef={
              addCardTrigger === AddCardTrigger.BUTTON
                ? addCardRef
                : addCardLaneRef
            }
            lists={listOptions}
            {...(grouping === GroupByOption.LABEL &&
              labelOptions && { labels: labelOptions })}
            {...(grouping === GroupByOption.MEMBER &&
              memberOptions && {
                members: memberOptions,
              })}
            colorBlind={colorBlind}
            feature={Feature.TimelineView}
            dueTime={defaultTime}
            {...getGroupingProps()}
          />
        )}
        {showAddList && (
          <ViewsAddListPopover
            idBoard={idBoard}
            isVisible={showAddList}
            // eslint-disable-next-line react/jsx-no-bind
            onHide={() => setShowAddList(false)}
            feature={Feature.TimelineView}
            popoverTargetRef={addCardRef}
            // eslint-disable-next-line react/jsx-no-bind
            onListCreated={onAddListSubmit}
            lists={activeLists.map((list) => ({
              id: list.id,
              pos: list.pos,
            }))}
          />
        )}
      </>
    );
  }

  return (
    <div
      className={cx(styles.main, {
        [styles.collapsedWorkspaceNavigation]:
          workspaceNavigationEnabled &&
          !workspaceNavigationHidden &&
          !workspaceNavigationExpanded,
      })}
      data-test-id={TimelineTestIds.TimelineWrapper}
    >
      <div className={styles.gridWrapper}>{content}</div>
    </div>
  );
};
