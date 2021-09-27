import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import _ from 'underscore';
import moment from 'moment';
import cx from 'classnames';

import { Analytics } from '@trello/atlassian-analytics';
import {
  getDateWithAddedDays,
  getDateWithAddedMonths,
  getDateWithAddedWeeks,
} from '@trello/dates';
import { featureFlagClient } from '@trello/feature-flag-client';
import { Spinner } from '@trello/nachos/spinner';

import { Feature } from 'app/scripts/debug/constants';
import { Dates } from 'app/scripts/lib/dates';

import { EmptyBoardTableView } from 'app/src/components/BoardTableView/EmptyBoardTableView';
import { BoardViewContext } from 'app/src/components/BoardViewContext/BoardViewContext';
import { LazyViewsAddCardPopover as ViewsAddCardPopover } from 'app/src/components/ViewsAddCardPopover/LazyViewsAddCardPopover';
import { LazyViewsAddListPopover as ViewsAddListPopover } from 'app/src/components/ViewsAddListPopover/LazyViewsAddListPopover';
import {
  AddCardTrigger,
  AddNewType,
  NavigationDirection,
  ViewType,
  ZoomLevel,
} from 'app/src/components/ViewsGenerics/types';
import { ViewHeader } from 'app/src/components/ViewsGenerics/ViewHeader';
import { ViewAddNew } from 'app/src/components/ViewsGenerics/ViewAddNew';

import { AddPopoverContext } from './AddPopoverContext';
import { CalendarContext } from './CalendarContext';
import { DraggableContext } from './Draggable';
import { getFirstVisibleDate, getLastVisibleDate } from './helpers';
import { PaginationContextProvider } from './PaginationContext';
import { ResizableContext } from './Resizable';
import { AnalyticsContainer, EventData } from './types';
import { Day, Month, PanelCalendar, Week } from './ZoomLevels';

import styles from './Calendar.less';

const getNewDateFx = (zoomLevel: ZoomLevel) => {
  switch (zoomLevel) {
    case ZoomLevel.DAY:
      return getDateWithAddedDays;
    case ZoomLevel.WEEK:
      return getDateWithAddedWeeks;
    case ZoomLevel.MONTH:
    default:
      return getDateWithAddedMonths;
  }
};

interface CalendarProps {
  events: EventData[];
  analyticsContainers: AnalyticsContainer;
  settingsComponent?: React.ReactElement;
  showErrorState?: boolean;
  showLoadingState?: boolean;
  isLoadingMore?: boolean;
  showEmptyState?: boolean;
  shouldRenderBoardEmptyState?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  analyticsContainers,
  settingsComponent,
  showErrorState,
  showLoadingState,
  isLoadingMore,
  showEmptyState,
  shouldRenderBoardEmptyState,
}) => {
  const { colorBlind } = useContext(CalendarContext);

  const { draggableState } = useContext(DraggableContext),
    { isDragging } = draggableState;
  const { resizableState } = useContext(ResizableContext),
    { isResizing } = resizableState;

  const { cardsData, closeView, contextType, idBoard, idOrg } = useContext(
    BoardViewContext,
  );
  const isWorkspaceView = contextType === 'workspace';

  const {
    hasAddPermission,
    showAddCard,
    setShowAddCard,
    showAddList,
    setShowAddList,
    popoverPosition,
    activeLists,
    addCardList,
    onAddCardSubmit,
    onAddListSubmit,
    addCardTrigger,
    setAddCardTrigger,
    setDoNotScroll,
    popoverDefaultTime,
    setPopoverDefaultTime,
  } = useContext(AddPopoverContext);

  const loadedCalendar = useRef<boolean>(false);

  const trackInitialCalendarLoad = useCallback(
    (numEvents: number) => {
      if (!loadedCalendar.current) {
        loadedCalendar.current = true;

        Analytics.sendScreenEvent({
          name: 'calendarViewScreen',
          attributes: {
            numberCardsOnCalendar: numEvents,
            contextType,
          },
          containers: analyticsContainers,
        });
      }
    },
    [analyticsContainers, contextType],
  );

  const addCardRef = useRef<HTMLButtonElement>(null);
  const addCardLaneRef = useRef<HTMLButtonElement>(null);
  const [cardListOptions, listOptions] = useMemo(() => {
    const cardListOptions =
      activeLists.map((list) => ({
        id: list.id,
        name: list.name,
      })) || [];
    const listOptions = activeLists.map((list) => ({
      id: list.id,
      pos: list.pos,
    }));
    return [cardListOptions, listOptions];
  }, [activeLists]);

  const [selectedDate, updateSelectedDate] = useState<Date>(
    moment().startOf('day').toDate(),
  );

  const isDayZoomEnabled = featureFlagClient.get(
    'ecosystem.calendar-day-zoom',
    false,
  );

  const views = isDayZoomEnabled
    ? [ZoomLevel.DAY, ZoomLevel.WEEK, ZoomLevel.MONTH]
    : [ZoomLevel.WEEK, ZoomLevel.MONTH];

  const [currentZoomLevel, updateCurrentZoomLevel] = useState<ZoomLevel>(
    ZoomLevel.MONTH,
  );

  const slideRight = useRef(true);

  const calendarRef = createRef<HTMLDivElement>();

  const [loadedDateRange, updateLoadedDateRange] = useState(
    cardsData.initialLoadedDateRange || null,
  );

  const fetchCardsInNewRange = useCallback(
    (newDate) => {
      // For some months, we'll have already rendered
      // days that belong to a previous/next month
      // (e.g. the Sept month may show the last couple
      // days of August or the beginning couple days of
      // October). To determine whether we fetch the next
      // range, we'll see whether we've fetched the 2nd
      // or 2nd to last week of a month.
      const lowerDate = getDateWithAddedWeeks(
        Dates.getLastOfMonth(newDate),
        -1,
      );
      const upperDate = getDateWithAddedWeeks(
        Dates.getFirstOfMonth(newDate),
        1,
      );

      if (
        isWorkspaceView &&
        loadedDateRange &&
        cardsData?.loadMoreByDate &&
        (lowerDate < loadedDateRange[0] || upperDate > loadedDateRange[1])
      ) {
        let newDateRange;
        if (lowerDate < loadedDateRange[0]) {
          const startingMonth = getDateWithAddedMonths(newDate, -2);
          const startOfRange = getFirstVisibleDate(startingMonth);
          const endOfRange = getLastVisibleDate(newDate);

          newDateRange = `${moment(startOfRange).format()}...${moment(
            endOfRange,
          ).format()}`;

          updateLoadedDateRange([startOfRange, loadedDateRange[1]]);
        } else {
          const startOfRange = getFirstVisibleDate(newDate);
          const endingMonth = getDateWithAddedMonths(newDate, 2);
          const endOfRange = getLastVisibleDate(endingMonth);

          newDateRange = `${moment(startOfRange).format()}...${moment(
            endOfRange,
          ).format()}`;

          updateLoadedDateRange([loadedDateRange[0], endOfRange]);
        }
        cardsData.loadMoreByDate(newDateRange);
      }
    },
    [cardsData, isWorkspaceView, loadedDateRange],
  );

  useEffect(() => {
    fetchCardsInNewRange(selectedDate);
  }, [fetchCardsInNewRange, selectedDate]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl && !isDragging && !isResizing) {
      const handleHorizontalScroll = _.debounce(
        (scrollingRight: boolean) => {
          slideRight.current = scrollingRight;

          const updateDateFx = getNewDateFx(currentZoomLevel);

          updateSelectedDate((currentSelectedDate) =>
            updateDateFx(currentSelectedDate, scrollingRight ? 1 : -1),
          );
        },
        250,
        true,
      );

      const _horizontalScrollListener = (event: WheelEvent) => {
        event.stopPropagation();

        if (event.deltaX) {
          event.preventDefault();

          if (
            Math.abs(event.deltaX) > 10 &&
            // Prevent horizontal scroll action if the
            // primary scrolling is vertical
            Math.abs(event.deltaY) <= Math.abs(event.deltaX)
          ) {
            handleHorizontalScroll(event.deltaX > 0);
          }
        }
      };

      calendarEl.addEventListener('wheel', _horizontalScrollListener);

      return () => {
        calendarEl.removeEventListener('wheel', _horizontalScrollListener);
      };
    }
    // Don't add `calendarEl` to the dependencies because
    // it'll cause the the horizontal scroll to occur many
    // times
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentZoomLevel, isDragging, isResizing]);

  // Need this ref to currentZoomLevel because the
  // throttle fx expects the same fx passed in order to
  // recognize that it's being called again. If we use
  // `currentZoomLevel` as the dependency, useCallback will
  // create a new fx everytime `currentZoomLevel` changes and
  // won't throttle correctly (will there be a timing issue?)
  const currentZoomLevelRef = useRef(currentZoomLevel);
  useEffect(() => {
    currentZoomLevelRef.current = currentZoomLevel;
  }, [currentZoomLevel]);
  const navigateOneDateUnit = useRef(
    _.throttle(
      useCallback((isNavigatingBack: boolean = false) => {
        slideRight.current = !isNavigatingBack;

        const updateDateFx = getNewDateFx(currentZoomLevelRef.current);

        updateSelectedDate((currentSelectedDate) =>
          updateDateFx(currentSelectedDate, isNavigatingBack ? -1 : 1),
        );
      }, []),
      1000,
      { trailing: false },
    ),
  );

  const handleHeaderNavigate = useCallback(
    (direction: NavigationDirection | null, newDate?: Date) => {
      if (isLoadingMore) {
        return;
      }

      if (newDate) {
        slideRight.current = newDate > selectedDate;
        updateSelectedDate(newDate);
        return;
      }

      switch (direction) {
        case NavigationDirection.TODAY: {
          const newDate = moment().startOf('day').toDate();
          if (!moment(newDate).isSame(selectedDate, currentZoomLevel)) {
            slideRight.current = newDate > selectedDate;
            updateSelectedDate(newDate);
          }
          break;
        }
        case NavigationDirection.PREV: {
          navigateOneDateUnit.current(true);
          break;
        }
        case NavigationDirection.NEXT: {
          navigateOneDateUnit.current(false);
          break;
        }
        default: {
          break;
        }
      }
    },
    [currentZoomLevel, isLoadingMore, selectedDate],
  );

  let ZoomComponent = Month;
  switch (currentZoomLevel) {
    case ZoomLevel.DAY:
      ZoomComponent = Day;
      break;
    case ZoomLevel.WEEK:
      ZoomComponent = Week;
      break;
    case ZoomLevel.MONTH:
    default:
      ZoomComponent = Month;
      break;
  }

  const shouldNotNavigate = useCallback(
    (day: Date) => {
      switch (currentZoomLevel) {
        case ZoomLevel.DAY:
          return moment(selectedDate).isSame(day, 'day');
        case ZoomLevel.WEEK:
          return moment(selectedDate).isSame(day, 'week');
        case ZoomLevel.MONTH:
        default:
          return moment(selectedDate).isSame(day, 'month');
      }
    },
    [currentZoomLevel, selectedDate],
  );

  const onSelectPopover = useCallback(
    (type) => {
      if (type === AddNewType.CARD) {
        setAddCardTrigger(AddCardTrigger.BUTTON);
        setPopoverDefaultTime(undefined);
        setShowAddCard(true);
      } else if (type === AddNewType.LIST) {
        setShowAddList(true);
      }
    },
    [setAddCardTrigger, setPopoverDefaultTime, setShowAddCard, setShowAddList],
  );

  const onHideAddCardPopover = useCallback(() => {
    setPopoverDefaultTime(undefined);
    setDoNotScroll(false);
    setShowAddCard(false);
  }, [setDoNotScroll, setPopoverDefaultTime, setShowAddCard]);

  const onHideAddListPopover = useCallback(() => {
    setShowAddList(false);
  }, [setShowAddList]);

  const isInDayZoom = currentZoomLevel === ZoomLevel.DAY;

  if (showErrorState) {
    // TODO need to change this error screen
    return <div>Uh oh! Something went wrong!</div>;
  }

  if (showLoadingState) {
    return <Spinner centered={true} />;
  }

  if (showEmptyState) {
    if (shouldRenderBoardEmptyState) {
      return (
        <EmptyBoardTableView
          headingString="add-boards-to-create-calendar"
          subHeadingString="your-team-calendar-can-help"
        />
      );
    }
    return <Spinner centered={true} />;
  }

  return (
    <div
      className={cx(
        styles.calendarContainer,
        isDragging && styles.isDragging,
        isResizing && styles.isResizing,
      )}
      ref={calendarRef}
    >
      <PaginationContextProvider fetchCardsInNewRange={fetchCardsInNewRange}>
        <ViewHeader
          viewName={ViewType.CALENDAR}
          dateText={moment(selectedDate).format('MMM YYYY')}
          closeView={isWorkspaceView ? undefined : closeView}
          onNavigate={handleHeaderNavigate}
          isZoomLevelEnabled={true}
          currentZoom={currentZoomLevel}
          zoomOptions={views}
          changeZoom={updateCurrentZoomLevel}
          analyticsContainers={analyticsContainers}
          feedbackLink={'https://trello.typeform.com/to/LFfEXF89'}
          orgId={idOrg}
          settingsComponent={settingsComponent}
          events={events}
          defaultDate={selectedDate}
          shouldNotNavigate={shouldNotNavigate}
          disableCalPopoverOnLarge={currentZoomLevel === ZoomLevel.DAY}
          isLoading={isLoadingMore}
        />
        <div
          className={cx(
            styles.calendarBody,
            isInDayZoom && styles.showBorderTop,
          )}
        >
          {isInDayZoom && (
            <div className={cx(styles.miniCalendarSection)}>
              <PanelCalendar
                selectedDate={selectedDate}
                events={events}
                onNavigate={handleHeaderNavigate}
                analyticsContainers={analyticsContainers}
              />
            </div>
          )}
          <TransitionGroup
            className={cx(
              styles.zoomComponentContainer,
              slideRight.current ? styles.slidingRight : styles.slidingLeft,
            )}
          >
            <CSSTransition
              key={`${currentZoomLevel}-${selectedDate.getTime()}`}
              timeout={400}
              classNames={{
                enter: styles.slideInStart,
                enterActive: styles.slideInEnd,
                exit: styles.slideOutStart,
                exitActive: styles.slideOutEnd,
              }}
            >
              <ZoomComponent
                selectedDate={selectedDate}
                events={events}
                trackInitialCalendarLoad={trackInitialCalendarLoad}
              />
            </CSSTransition>
          </TransitionGroup>
        </div>
        {hasAddPermission && idBoard && !isWorkspaceView && (
          <ViewAddNew
            onSelect={onSelectPopover}
            overrideStyles={{
              addNewButton: styles.addCardButton,
            }}
            ref={addCardRef}
            idBoard={idBoard}
            idOrg={analyticsContainers.organization?.id || null}
            idEnterprise={analyticsContainers.enterprise?.id || null}
            feature={Feature.CalendarView}
          />
        )}
        {activeLists.length > 0 && (
          <button
            className={styles.addCardPositioner}
            style={popoverPosition}
            ref={addCardLaneRef}
            tabIndex={-1}
          ></button>
        )}
        {showAddCard && !showAddList && (
          <ViewsAddCardPopover
            isVisible={showAddCard}
            onHide={onHideAddCardPopover}
            addCardSubmit={onAddCardSubmit}
            popoverTargetRef={
              addCardTrigger === AddCardTrigger.BUTTON
                ? addCardRef
                : addCardLaneRef
            }
            lists={cardListOptions}
            selectedListId={addCardList || activeLists[0]?.id}
            colorBlind={colorBlind}
            feature={Feature.CalendarView}
            dueTime={popoverDefaultTime}
          />
        )}
        {showAddList && !showAddCard && idBoard && !isWorkspaceView && (
          <ViewsAddListPopover
            idBoard={idBoard}
            isVisible={showAddList}
            onHide={onHideAddListPopover}
            feature={Feature.CalendarView}
            popoverTargetRef={addCardRef}
            onListCreated={onAddListSubmit}
            lists={listOptions}
          />
        )}
      </PaginationContextProvider>
    </div>
  );
};
