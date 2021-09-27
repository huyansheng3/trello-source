import React, {
  useMemo,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import moment from 'moment';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { seesVersionedVariation } from '@trello/feature-flag-client';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';

import {
  GroupByOption,
  NavigationDirection,
  ViewHeader,
  ViewType,
  ZoomLevel,
  BetaPhase,
} from 'app/src/components/ViewsGenerics';

import { DraggableContextProvider } from 'app/src/components/BoardCalendarView/Draggable/DraggableContext';
import { useUpdateCardDatesMutation } from 'app/src/components/ViewsGenerics/UpdateCardDatesMutation.generated';

import { TimeBar } from './TimeBar';
import { ColLines } from './ColLines';
import { computeRowLayout, groupItems } from './computeRowLayout';
import { ItemGroupView } from './ItemGroupView';
import { UnscheduledPopover } from './UnscheduledPopover';

import { useScrollController } from './useScrollController';
import { ScrollController } from './ScrollController';
import { GroupingContextProvider } from './GroupingContext';

import {
  TimelineItem,
  TimelineGroup,
  Range,
  Boundary,
  NavigateToCardParams,
  LaneDoubleClickParams,
} from './types';
import { GROUP_HEADER_WIDTH, COL_WIDTH_BY_ZOOM } from './constants';

import { useTimelineGrid } from './useTimelineGrid';
import gridStyles from './TimelineGrid.less';

interface GridProps {
  isLoading: boolean;
  items: Array<TimelineItem>;
  unscheduledItems: Array<TimelineItem>;
  timelineGroups: Array<TimelineGroup>;
  zoom: ZoomLevel;
  changeZoom: (zoom: ZoomLevel) => void;
  grouping: GroupByOption;
  changeGrouping: (group: GroupByOption) => void;
  navigateToCard: (id: string, params: NavigateToCardParams) => void;
  closeView?: () => void;
  scrollToDate?: number;
  scrollToGroup?: string;
  onLaneDoubleClick: (args: LaneDoubleClickParams) => void;
  doNotScroll?: boolean;
  // needed for analytics purposes
  idBoard?: string;
  idOrg?: string;
  idEnterprise?: string;
}

function TimelineGrid({
  isLoading,
  items,
  unscheduledItems,
  timelineGroups,
  grouping,
  changeGrouping,
  zoom,
  changeZoom,
  navigateToCard,
  closeView,
  idBoard,
  idOrg,
  idEnterprise,
  scrollToDate,
  scrollToGroup,
  onLaneDoubleClick,
  doNotScroll = false,
}: GridProps) {
  const groupHeaderWidth = GROUP_HEADER_WIDTH;
  const colWidth = COL_WIDTH_BY_ZOOM[zoom];
  const isInfiniteScrollEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const isGroupByEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const isZoomLevelEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  const {
    timelineGridState,
    timelineGridDispatch,
    rootRef,
    currentScrolledDate,
    columns,
    getIndexByDate,
    firstVisibleDate,
  } = useTimelineGrid({ colWidth, items, isInfiniteScrollEnabled, zoom });
  const [updateCardDates] = useUpdateCardDatesMutation();
  // keep track of which column is "today"
  const todayIndex =
    zoom === ZoomLevel.QUARTER || zoom === ZoomLevel.YEAR
      ? moment().diff(columns[0].startTime, 'months')
      : moment().diff(columns[0].startTime, 'days');

  const itemGroups = useMemo(
    () => computeRowLayout(timelineGroups, items, zoom),
    [timelineGroups, items, zoom],
  );

  const unscheduledItemsGroups = useMemo(() => groupItems(unscheduledItems), [
    unscheduledItems,
  ]);

  const {
    scrollDays,
    scrollToToday,
    scrollTo,
    getDateAtMousePosition,
    ...scrollProps
  } = useScrollController({
    colWidth,
    todayIndex,
    rootRef,
    zoom,
  });
  // days on the time bar will be highlighted blue as you are
  // resizing a card.
  const [columnRangeToHighlight, setColumnRangeToHighlight] = useState<Range>(
    null,
  );
  const month = currentScrolledDate.format('MMM');
  const year = currentScrolledDate.format('YYYY');

  const totalWidth = colWidth * columns.length + groupHeaderWidth;
  const headerTitle = () => {
    if (zoom === ZoomLevel.QUARTER || zoom === ZoomLevel.YEAR) {
      return `${year}`;
    } else return `${month} ${year}`;
  };

  const { popoverGroup } = timelineGridState;

  const popoverItems = useMemo(() => {
    if (!popoverGroup) {
      return [];
    } else {
      return unscheduledItemsGroups.get(popoverGroup);
    }
  }, [popoverGroup, unscheduledItemsGroups]);

  const onDrawerOpen = (
    groupId: string,
    params: {
      popoverTriggerRef: React.RefObject<HTMLButtonElement>;
      popoverTargetRef: React.RefObject<HTMLDivElement>;
    },
  ) => {
    timelineGridDispatch({
      type: 'drawer_open',
      payload: { groupId, ...params },
    });
  };

  const onNavigateToCard = (
    idCard: string,
    params: NavigateToCardParams,
    source: SourceType = 'timelineViewScreen',
  ) => {
    timelineGridDispatch({
      type: 'drawer_close',
    });
    navigateToCard(idCard, params);
    Analytics.sendClickedButtonEvent({
      buttonName: 'timelineItemButton',
      source,
      containers: {
        organization: { id: idOrg },
        board: { id: idBoard },
        card: { id: idCard },
        enterprise: { id: idEnterprise },
      },
      attributes: {
        grouping,
        zoom,
      },
    });
  };

  const showGroupHeader = grouping !== 'none';

  const onRecenter = () => {
    const currentDate = new Date().getTime();
    if (
      isInfiniteScrollEnabled &&
      (columns[0].startTime > currentDate ||
        columns[columns.length - 1].startTime < currentDate)
    ) {
      timelineGridDispatch({ type: 'reset_dates', payload: { zoom } });
    } else {
      scrollToToday({ behavior: 'auto' });
    }
  };

  const onHeaderNavigation = (
    direction: NavigationDirection | null,
    newDate?: Date,
  ) => {
    if (newDate) {
      timelineGridDispatch({
        type: 'reset_dates',
        payload: {
          zoom,
          date: newDate.getTime(),
        },
      });
      return;
    }

    if (direction === NavigationDirection.TODAY) {
      onRecenter();
    } else {
      let columns;
      switch (zoom) {
        case ZoomLevel.DAY:
          columns = 1;
          break;
        case ZoomLevel.MONTH:
          columns = moment(currentScrolledDate).daysInMonth();
          break;
        case ZoomLevel.QUARTER:
          columns = 3;
          break;
        case ZoomLevel.YEAR:
          columns = 12;
          break;
        case ZoomLevel.WEEK:
        default:
          columns = 7;
          break;
      }
      let multiplier = 1;
      if (direction === NavigationDirection.PREV) {
        multiplier *= -1;
      }

      scrollDays(multiplier * columns);
    }
  };

  let isThrottling = false;
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (timelineGridState.loadingMoreDates || doNotScroll) {
      e.preventDefault();
      return;
    }
    if (!isThrottling) {
      setTimeout(() => {
        if (rootRef.current) {
          timelineGridDispatch({
            type: 'scroll',
            payload: { scrollX: rootRef.current.scrollLeft },
          });
          isThrottling = false;
        }
      }, 300);
      isThrottling = true;
    }
  };

  const dateToScrollRef = useRef<number>(0);
  const currentZoomRef = useRef<string>(zoom);
  const onBoundaryVisible = (boundary: Boundary, isDragging: boolean) => {
    timelineGridDispatch({
      type: 'set_date_loading',
      payload: { loadingMoreDates: true },
    });

    if (boundary === 'beginning') {
      timelineGridDispatch({
        type: 'beginning_visible',
        payload: {
          currentDate: currentScrolledDate.valueOf(),
          zoom,
          isDragging,
        },
      });
    } else if (boundary === 'end') {
      timelineGridDispatch({
        type: 'end_visible',
        payload: {
          currentDate: currentScrolledDate.valueOf(),
          zoom,
          isDragging,
        },
      });
    }
  };

  const changeZoomLevel = (zoom: ZoomLevel) => {
    timelineGridDispatch({
      type: 'change_zoom',
      payload: { currentDate: currentScrolledDate.valueOf(), zoom },
    });
    changeZoom(zoom);
  };

  useLayoutEffect(() => {
    if (!timelineGridState.dateToScroll) {
      return;
    }
    if (
      timelineGridState.dateToScroll !== dateToScrollRef.current ||
      currentZoomRef.current !== zoom
    ) {
      const index = getIndexByDate(timelineGridState.dateToScroll);
      if (index > -1) {
        scrollTo(index, { behavior: 'auto' });
      }
      dateToScrollRef.current = timelineGridState.dateToScroll;
      currentZoomRef.current = zoom;
    }
  });
  /**
   * These two refs keep track of the `scrollToDate` and
   * `scrollToGroup` props. When they change, they are used to
   * scroll horizontally to a date, and vertically to a group.
   * This is useful when during a re-render, if the parent wants
   * the timelinegrid to be positioned at a certain date and/or group.
   */
  const scrollToDateRef = useRef<number>(0);
  const scrollToGroupRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<string | undefined>();
  useLayoutEffect(() => {
    if (!scrollToDate && !scrollToGroupRef) {
      return;
    }
    if (scrollToDate && scrollToDate !== scrollToDateRef.current) {
      timelineGridDispatch({
        type: 'reset_dates',
        payload: { zoom, date: scrollToDate },
      });
      scrollToDateRef.current = scrollToDate;
    }
    if (
      scrollToGroupRef &&
      scrollToGroupRef.current &&
      groupRef.current !== scrollToGroup
    ) {
      rootRef.current?.scrollTo(
        rootRef.current.scrollLeft,
        // 32 being th height of the timebar
        scrollToGroupRef.current.offsetTop - 32,
      );
      groupRef.current = scrollToGroup;
    }
  });

  const onEndDrag = useCallback(
    async (e: {
      event: TimelineItem;
      start: Date;
      end: Date;
      groupId?: string;
      isUnscheduled?: boolean;
    }) => {
      // if the card was dropped into another lane
      // don't do anything
      if (e.event.activeGroupId !== e.groupId) {
        return;
      }
      // if this flag is true, it means it was dragged over the unscheduled drawer
      // and should not be scheduled
      if (e.isUnscheduled) {
        return;
      }
      const eventWasUnscheduled =
        !e.event.originalStartTime && !e.event.originalEndTime;
      let startDate = moment(e.event.startTime);
      let endDate = moment(e.event.endTime);
      const newStartDate = moment(e.start);
      const newEndDate = moment(e.end);
      if (eventWasUnscheduled) {
        startDate = moment();
        endDate = moment();
      }
      newStartDate.hour(startDate.hour()).minute(startDate.minute());
      newEndDate.hour(endDate.hour()).minute(endDate.minute());
      try {
        await updateCardDates({
          variables: {
            idCard: e.event.id,
            ...((e.event.originalStartTime || eventWasUnscheduled) && {
              start: newStartDate.toISOString(),
            }),
            ...((e.event.originalEndTime || eventWasUnscheduled) && {
              due: newEndDate.toISOString(),
            }),
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCardDates: {
              id: e.event.id,
              start:
                e.event.originalStartTime || eventWasUnscheduled
                  ? newStartDate.toISOString()
                  : '',
              due:
                e.event.originalEndTime || eventWasUnscheduled
                  ? newEndDate.toISOString()
                  : '',
              __typename: 'Card',
            },
          },
        });
        Analytics.sendTrackEvent({
          action: 'set',
          actionSubject: 'dueDate',
          source: 'timelineViewScreen',
          containers: {
            card: { id: e.event.id },
            board: { id: idBoard },
            organization: { id: idOrg },
            enterprise: { id: idEnterprise },
          },
          attributes: {
            grouping,
            zoom,
            ui_action: 'drag',
          },
        });
      } catch (err) {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-ecosystem',
            feature: Feature.TimelineView,
          },
          extraData: {
            component: 'ItemResizer',
          },
        });
      }
    },
    [grouping, idBoard, idEnterprise, idOrg, updateCardDates, zoom],
  );

  const onCancelDrag = useCallback(
    (e: { event: TimelineItem }) => {
      const scrollToDate = e.event.startTime;
      if (scrollToDate) {
        timelineGridDispatch({
          type: 'reset_dates',
          payload: { zoom, date: scrollToDate },
        });
      }
    },
    [zoom, timelineGridDispatch],
  );

  return (
    <GroupingContextProvider grouping={grouping}>
      <DraggableContextProvider
        getDateSlot={getDateAtMousePosition}
        onEndDrag={onEndDrag}
        onCancelDrag={onCancelDrag}
      >
        <ViewHeader
          viewName={ViewType.TIMELINE}
          dateText={headerTitle()}
          closeView={closeView}
          // eslint-disable-next-line react/jsx-no-bind
          onNavigate={onHeaderNavigation}
          isLoading={isLoading}
          isZoomLevelEnabled={isZoomLevelEnabled}
          currentZoom={zoom}
          zoomOptions={[
            ZoomLevel.DAY,
            ZoomLevel.WEEK,
            ZoomLevel.MONTH,
            ZoomLevel.QUARTER,
            ZoomLevel.YEAR,
          ]}
          // eslint-disable-next-line react/jsx-no-bind
          changeZoom={changeZoomLevel}
          isGroupByEnabled={isGroupByEnabled}
          currentGroupBy={grouping}
          groupByOptions={[
            GroupByOption.LIST,
            GroupByOption.MEMBER,
            GroupByOption.LABEL,
            GroupByOption.NONE,
          ]}
          changeGrouping={changeGrouping}
          // eslint-disable-next-line react/jsx-no-bind
          hideUnscheduledPopover={() =>
            timelineGridDispatch({ type: 'drawer_close' })
          }
          analyticsContainers={{
            board: { id: idBoard || null },
            organization: { id: idOrg || null },
            enterprise: { id: idEnterprise || null },
          }}
          orgId={idOrg}
          betaPhase={BetaPhase.OUT}
          events={items.map(({ startTime, endTime }) => ({
            start: new Date(startTime),
            end: new Date(endTime),
          }))}
          defaultDate={currentScrolledDate.toDate()}
        />
        <ScrollController
          rootRef={rootRef}
          scrollToToday={scrollToToday}
          // eslint-disable-next-line react/jsx-no-bind
          onScroll={onScroll}
          doNotScroll={doNotScroll}
          {...scrollProps}
        >
          <TimeBar
            columns={columns}
            styles={gridStyles}
            groupHeaderWidth={groupHeaderWidth}
            colWidth={colWidth}
            totalWidth={totalWidth}
            todayIndex={todayIndex}
            columnRangeToHighlight={columnRangeToHighlight}
            zoom={zoom}
          />
          {timelineGroups.map((group, i) => {
            const itemGroup = itemGroups.get(group.id);
            // the last group has slightly different styling
            // so that it can take up the rest of the container space
            let isLastGroup = false;
            if (i === timelineGroups.length - 1) {
              isLastGroup = true;
            }
            return (
              <ItemGroupView
                key={`row-${group.id}`}
                colWidth={colWidth}
                columns={columns}
                timelineGroup={group}
                showGroupHeader={showGroupHeader}
                itemGroup={itemGroup}
                totalWidth={totalWidth}
                styles={gridStyles}
                isLastGroup={isLastGroup}
                // eslint-disable-next-line react/jsx-no-bind
                navigateToCard={(
                  idCard: string,
                  params: NavigateToCardParams,
                ) => onNavigateToCard(idCard, params, 'timelineViewScreen')}
                unscheduledItemsCount={
                  (unscheduledItemsGroups.get(group.id) || []).length
                }
                unscheduledActive={group.id === timelineGridState.popoverGroup}
                // eslint-disable-next-line react/jsx-no-bind
                onUnscheduledClick={(params) => onDrawerOpen(group.id, params)}
                setColumnRangeToHighlight={setColumnRangeToHighlight}
                idBoard={idBoard}
                idOrg={idOrg}
                idEnterprise={idEnterprise}
                {...(group.id === scrollToGroup
                  ? { groupRef: scrollToGroupRef }
                  : {})}
                zoom={zoom}
                onLaneDoubleClick={onLaneDoubleClick}
                rootRef={rootRef}
              />
            );
          })}
          <ColLines
            columns={columns}
            styles={gridStyles}
            groupHeaderWidth={groupHeaderWidth}
            colWidth={colWidth}
            todayIndex={todayIndex}
            // eslint-disable-next-line react/jsx-no-bind
            onBoundaryVisible={onBoundaryVisible}
          />
        </ScrollController>
        <UnscheduledPopover
          popoverItems={popoverItems || []}
          popoverTargetRef={timelineGridState.popoverTargetRef}
          popoverTriggerRef={timelineGridState.popoverTriggerRef}
          // eslint-disable-next-line react/jsx-no-bind
          onDrawerItemClick={(idCard: string, params: NavigateToCardParams) =>
            onNavigateToCard(
              idCard,
              params,
              'timelineUnscheduledCardsInlineDialog',
            )
          }
          isVisible={timelineGridState.isPopoverVisible}
          // eslint-disable-next-line react/jsx-no-bind
          onHide={() => timelineGridDispatch({ type: 'drawer_close' })}
          rootRef={rootRef}
          zoom={zoom}
          currentScrolledDate={firstVisibleDate}
        />
      </DraggableContextProvider>
    </GroupingContextProvider>
  );
}

export { TimelineGrid };
