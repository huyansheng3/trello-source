import { useReducer, useRef } from 'react';
import moment from 'moment';

import { ZoomLevel } from 'app/src/components/ViewsGenerics/types';

import {
  TimelineGridAction,
  Column,
  TimelineItem,
  TimelineGridState,
  Boundary,
} from './types';
import { GROUP_HEADER_WIDTH } from './constants';

const oneMonth = 1 * 30 * 24 * 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;

const zoomBoundaries = {
  [ZoomLevel.DAY]: oneMonth,
  [ZoomLevel.WEEK]: oneMonth * 2,
  [ZoomLevel.MONTH]: oneMonth * 4,
  [ZoomLevel.QUARTER]: oneMonth * 24,
  [ZoomLevel.YEAR]: oneMonth * 60,
};

interface GetDateProps {
  zoom: ZoomLevel;
  type: Boundary;
  currentDate: number;
}

const getDateFromZoom = ({ zoom, type, currentDate }: GetDateProps) => {
  const zoomDateMap = {
    [ZoomLevel.DAY]: oneDay,
    [ZoomLevel.WEEK]: oneDay,
    [ZoomLevel.MONTH]: oneDay * 3,
    [ZoomLevel.QUARTER]: 0,
    [ZoomLevel.YEAR]: oneDay,
  };
  if (type === 'end') {
    return currentDate + zoomDateMap[zoom];
  } else {
    return currentDate - zoomDateMap[zoom];
  }
};

// gets the date of the column closest to the center of the visible columns
export const getDateFromScroll = (
  scroll: number,
  columns: Array<Column>,
  groupHeaderWidth: number,
  colWidth: number,
  rootRef: React.RefObject<HTMLDivElement>,
) => {
  if (rootRef.current) {
    // first, get the approx index of the left most visible column
    const leftColumnIndex = Math.floor(scroll / colWidth);

    // then, calculate the number columns visible
    const visibleColumns =
      (rootRef.current.clientWidth - groupHeaderWidth) / colWidth;

    // finally, get the index of the column in the center of visible columns
    const centerVisibleColumnIndex =
      leftColumnIndex + Math.floor(visibleColumns / 2);

    // return that column's date
    return columns[centerVisibleColumnIndex]?.startTime;
  }
};

export const getFirstVisibleColumnStarttime = (
  scroll: number,
  columns: Array<Column>,
  groupHeaderWidth: number,
  colWidth: number,
  rootRef: React.RefObject<HTMLDivElement>,
) => {
  if (rootRef.current) {
    // first, get the approx index of the left most visible column
    const leftColumnIndex = Math.floor(scroll / colWidth);

    // return that column's date
    return columns[leftColumnIndex]?.startTime;
  }
};

export const getGridColumnsAlpha = (
  earliestTime: number,
  latestTime: number,
  zoom: ZoomLevel,
) => {
  // now take our results, round to the start/end of the day, then pad 1 extra week
  const startTime = moment(new Date(earliestTime)).startOf('day');
  const endTime = moment(new Date(latestTime)).endOf('day');
  const totalDays = endTime.diff(startTime, 'days');

  const startMonth = moment(new Date(earliestTime)).startOf('month');
  const endMonth = moment(new Date(latestTime)).startOf('month');
  const totalMonths = endMonth.diff(startMonth, 'months');

  if (zoom === ZoomLevel.QUARTER || zoom === ZoomLevel.YEAR) {
    return new Array(totalMonths).fill({}).map((_, i) => {
      return {
        startTime: startMonth
          .clone()
          .add(i, 'months')
          .startOf('month')
          .valueOf(),
        endTime: startMonth.clone().add(i, 'months').endOf('month').valueOf(),
        isWeekend: false,
      };
    });
  }
  // TODO: This sometimes causes error in month view
  if (totalDays < 1) {
    return [];
  }
  // finally, use our date range to create the columns
  return new Array(totalDays).fill({}).map((_, i) => {
    const day = startTime.clone().add(i, 'days');
    const weekday = day.isoWeekday();
    return {
      startTime: day.startOf('day').valueOf(),
      endTime: day.endOf('day').valueOf(),
      isWeekend: [6, 7].includes(weekday),
      isEndOfMonth: day.date() === day.endOf('month').date(),
    };
  });
};

export const getGridColumns = (items: TimelineItem[], zoom: ZoomLevel) => {
  // find the earliest start date and the latest end date among all cards.
  // But set a max range to not overload the view.
  // When we implement infinite scrolling, we'll need to change this to accomodate
  // so that really far items are still reachable.
  let earliestTime = new Date().getTime();
  let latestTime = earliestTime;

  const minEarliestTime = new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000; // -6 months
  const maxLatestTime = new Date().getTime() + 6 * 30 * 24 * 60 * 60 * 1000; // +6 months

  items.forEach((item) => {
    if (item.startTime < earliestTime) {
      earliestTime = item.startTime;
    }
    if (item.endTime > latestTime) {
      latestTime = item.endTime;
    }
  });

  if (earliestTime < minEarliestTime) {
    earliestTime = minEarliestTime;
  }
  if (latestTime > maxLatestTime) {
    latestTime = maxLatestTime;
  }

  // now take our results, round to the start/end of the day, then pad 1 extra week
  const startTime = moment(new Date(earliestTime))
    .subtract(7, 'days')
    .startOf('day');
  const endTime = moment(new Date(latestTime)).add(7, 'days').endOf('day');
  const totalDays = endTime.diff(startTime, 'days');

  const startMonth = moment(new Date(earliestTime))
    .subtract(6, 'months')
    .startOf('month');
  const endMonth = moment(new Date(latestTime))
    .add(6, 'months')
    .startOf('month');
  const totalMonths = endMonth.diff(startMonth, 'months');

  if (zoom === ZoomLevel.QUARTER || zoom === ZoomLevel.YEAR) {
    return new Array(totalMonths).fill({}).map((_, i) => {
      return {
        startTime: startMonth
          .clone()
          .add(i, 'months')
          .startOf('month')
          .valueOf(),
        endTime: startMonth.clone().add(i, 'months').endOf('month').valueOf(),
        isWeekend: false,
      };
    });
  }

  // finally, use our date range to create the columns
  return new Array(totalDays).fill({}).map((_, i) => {
    const day = startTime.clone().add(i, 'days');
    const weekday = day.isoWeekday();
    return {
      startTime: day.startOf('day').valueOf(),
      endTime: day.endOf('day').valueOf(),
      isWeekend: [6, 7].includes(weekday),
      isEndOfMonth: day.date() === day.endOf('month').date(),
    };
  });
};

export const timelineReducer = (
  state: TimelineGridState,
  action: TimelineGridAction,
) => {
  switch (action.type) {
    case 'drawer_open':
      if (
        state.popoverGroup === action.payload.groupId &&
        state.isPopoverVisible
      ) {
        return {
          ...state,
          popoverGroup: undefined,
          isPopoverVisible: false,
          popoverTriggerRef: undefined,
          popoverTargetRef: undefined,
        };
      }
      return {
        ...state,
        popoverGroup: action.payload.groupId,
        isPopoverVisible: true,
        popoverTriggerRef: action.payload.popoverTriggerRef,
        popoverTargetRef: action.payload.popoverTargetRef,
      };
    case 'drawer_close':
      return {
        ...state,
        popoverGroup: undefined,
        isPopoverVisible: false,
        popoverTriggerRef: undefined,
        popoverTargetRef: undefined,
      };
    case 'scroll':
      return {
        ...state,
        scrollX: action.payload.scrollX,
      };
    /**
     * When an item is being dragged, the grid just grows on the side
     * it is being dragged. This is because, `Draggable` uses the
     * initial position to translate the item. If the grid is reset,
     * the initial position is lost and the item can't be placed
     * correctly at mouse position anymore.
     */
    case 'beginning_visible':
      return {
        ...state,
        maxEarliestTime:
          state.maxEarliestTime - zoomBoundaries[action.payload.zoom],
        minLatestTime: action.payload.isDragging
          ? state.minLatestTime
          : state.maxEarliestTime + zoomBoundaries[action.payload.zoom],
        dateToScroll: getDateFromZoom({
          currentDate: action.payload.currentDate,
          zoom: action.payload.zoom,
          type: 'beginning',
        }),
        loadingMoreDates: false,
      };
    case 'end_visible':
      return {
        ...state,
        maxEarliestTime: action.payload.isDragging
          ? state.maxEarliestTime
          : state.minLatestTime - zoomBoundaries[action.payload.zoom],
        minLatestTime:
          state.minLatestTime + zoomBoundaries[action.payload.zoom],
        dateToScroll: getDateFromZoom({
          currentDate: action.payload.currentDate,
          zoom: action.payload.zoom,
          type: 'end',
        }),
        loadingMoreDates: false,
      };
    case 'set_date_loading':
      return {
        ...state,
        loadingMoreDates: action.payload.loadingMoreDates,
      };
    case 'reset_dates': {
      return {
        ...state,
        maxEarliestTime:
          (action.payload.date || new Date().getTime()) -
          zoomBoundaries[action.payload.zoom],
        minLatestTime:
          (action.payload.date || new Date().getTime()) +
          zoomBoundaries[action.payload.zoom],
        dateToScroll: action.payload.date || new Date().getTime(),
      };
    }
    case 'change_zoom':
      return {
        ...state,
        maxEarliestTime:
          action.payload.currentDate - zoomBoundaries[action.payload.zoom],
        minLatestTime:
          action.payload.currentDate + zoomBoundaries[action.payload.zoom],
        dateToScroll: action.payload.currentDate,
      };
    default:
      return state;
  }
};

const initialState = {
  isPopoverVisible: false,
  popoverGroup: undefined,
  scrollX: 0,
  dateToScroll: undefined,
  loadingMoreDates: false,
} as TimelineGridState;

interface UseTimelineGridProps {
  colWidth: number;
  items: Array<TimelineItem>;
  isInfiniteScrollEnabled: boolean;
  zoom: ZoomLevel;
}

export const useTimelineGrid = ({
  colWidth,
  items,
  isInfiniteScrollEnabled,
  zoom,
}: UseTimelineGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().getTime();

  const [timelineGridState, timelineGridDispatch] = useReducer(
    timelineReducer,
    {
      ...initialState,
      maxEarliestTime: currentDate - zoomBoundaries[zoom],
      minLatestTime: currentDate + zoomBoundaries[zoom],
    },
  );

  let columns: Array<Column>;
  if (isInfiniteScrollEnabled) {
    columns = getGridColumnsAlpha(
      timelineGridState.maxEarliestTime,
      timelineGridState.minLatestTime,
      zoom,
    );
  } else {
    columns = getGridColumns(items, zoom);
  }

  const currentScrolledDate = moment(
    getDateFromScroll(
      timelineGridState.scrollX,
      columns,
      GROUP_HEADER_WIDTH,
      colWidth,
      rootRef,
    ),
  );

  const firstVisibleDate = moment(
    getFirstVisibleColumnStarttime(
      timelineGridState.scrollX,
      columns,
      GROUP_HEADER_WIDTH,
      colWidth,
      rootRef,
    ),
  );
  const getIndexByDate = (time: number) => {
    return columns.findIndex(
      (col) => col.startTime <= time && col.endTime >= time,
    );
  };

  return {
    timelineGridState,
    timelineGridDispatch,
    rootRef,
    currentScrolledDate,
    firstVisibleDate,
    columns,
    getIndexByDate,
  };
};
