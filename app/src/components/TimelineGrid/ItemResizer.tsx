/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import { Analytics } from '@trello/atlassian-analytics';
import type { ActionSubjectType } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';

import {
  getDaysOffset,
  getNewMeasurements,
  getNewDates,
  getNewDatesForYear,
} from './utils/resizingUtils';
import { TimelineItem, Side, Range } from './types';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable/DraggableContext';
import { useUpdateCardDatesMutation } from 'app/src/components/ViewsGenerics/UpdateCardDatesMutation.generated';
import { ItemSideTitle } from './ItemSideTitle';
import {
  MIN_WIDTH_FOR_RESIZING,
  MAX_WIDTH_FOR_SIDE_TITLE,
  SIDE_TITLE_PADDING,
  RESIZE_NARROW_HANDLE_MAX,
} from './constants';
import moment from 'moment';
import { ItemResizerTooltip } from './ItemResizerTooltip';
import { PermissionsContext } from 'app/src/components/BoardDashboardView/PermissionsContext';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { currentLocale } from '@trello/locale';

const trackResize = (
  side: Side,
  idCard: string,
  idBoard: string,
  idOrg: string,
  idEnterprise?: string,
) => {
  let actionSubject: ActionSubjectType;
  if (side === 'left') {
    actionSubject = 'startDate';
  } else if (side === 'right') {
    actionSubject = 'dueDate';
  } else {
    return;
  }
  Analytics.sendTrackEvent({
    action: 'set',
    actionSubject,
    source: 'timelineViewScreen',
    containers: {
      card: { id: idCard },
      board: { id: idBoard },
      organization: { id: idOrg },
      enterprise: { id: idEnterprise },
    },
    attributes: {
      // add zoom level and grouping to this
      // we can achieve this through React context so we don't have to pass it all the way
      // down from TimelineGrid
    },
  });
};

interface ItemResizerProps {
  item: TimelineItem;
  styles: CSSModule;
  colWidth: number;
  initialLeft: number;
  initialWidth: number;
  isResizing: boolean;
  isResizable?: boolean;
  setZIndex: (val: number) => void;
  setIsResizing: (val: boolean) => void;
  setColumnRangeToHighlight?: (val: Range) => void;
  setItemWidth: (val: number) => void;
  zoom: ZoomLevel;
  // needed for analytics purposes
  idBoard?: string;
  idOrg?: string;
  idEnterprise?: string;
  initialRenderSideTitle: boolean;
}

export const ItemResizer: React.FunctionComponent<ItemResizerProps> = ({
  item,
  styles,
  colWidth,
  initialLeft,
  initialWidth,
  isResizing,
  isResizable = false,
  setZIndex,
  setIsResizing,
  setItemWidth,
  setColumnRangeToHighlight,
  idBoard,
  idOrg,
  idEnterprise,
  children,
  zoom,
  initialRenderSideTitle,
}) => {
  const [updateCardDates] = useUpdateCardDatesMutation();
  const [left, setLeft] = useState(initialLeft);
  const leftRef = useRef(initialLeft);
  const [width, setWidth] = useState(initialWidth);
  const widthRef = useRef(initialWidth);

  const [currentResizeDate, setCurrentResizeDate] = useState(moment());

  const [isHovering, setIsHovering] = useState(false);
  let offset: number;
  let resizeDate: moment.Moment;

  // keep track if we are resizing the left side, the right side, or not at all
  const resizeSide = useRef<Side>(null);

  // the x-coord of the the cursor at the start of a resize
  const resizeCursorStart = useRef(0);

  const { canEdit } = useContext(PermissionsContext);
  const { draggableState } = useContext(DraggableContext);

  useEffect(() => {
    setLeft(initialLeft);
    setWidth(initialWidth);
  }, [setLeft, initialLeft, setWidth, initialWidth]);

  // keeping refs updated allows the listeners to have access to current left and width
  useEffect(() => {
    leftRef.current = left;
    widthRef.current = width;
  }, [leftRef, left, widthRef, width]);

  // force width to be 23px at minimum to for resizing handle placement
  if (width < MIN_WIDTH_FOR_RESIZING) {
    setWidth(MIN_WIDTH_FOR_RESIZING);
  }

  const startResize = (e: React.MouseEvent, side: Side) => {
    e.stopPropagation();
    e.preventDefault();
    // make this item overlap all other items in its row
    setZIndex(2);
    // let parent view know an item is being resized
    setIsResizing(true);
    // set highlighted columns to date range of item
    const columnHighlightStart = leftRef.current / colWidth;
    const columnHighlightEnd =
      columnHighlightStart + widthRef.current / colWidth - 1;
    setColumnRangeToHighlight?.([columnHighlightStart, columnHighlightEnd]);

    resizeSide.current = side;
    resizeCursorStart.current = e.screenX;

    if (side === 'right') {
      resizeDate = moment(item.endTime);
      setCurrentResizeDate(moment(item.endTime));
    } else if (side === 'left') {
      resizeDate = moment(item.startTime);
      setCurrentResizeDate(moment(item.startTime));
    }
    offset = 0;

    document.addEventListener('mouseup', finishResize, {
      once: true,
    });
    document.addEventListener('mousemove', duringResize);
  };

  const duringResize = (e: MouseEvent) => {
    let resizeUnitWidth = colWidth;
    if (zoom === ZoomLevel.QUARTER) {
      resizeUnitWidth = colWidth / resizeDate.daysInMonth();
    } else if (zoom === ZoomLevel.YEAR) {
      resizeUnitWidth = colWidth / 4;
    }

    const currentOffset = getDaysOffset(
      e.screenX,
      resizeCursorStart.current,
      resizeUnitWidth,
    );
    const measurements = getNewMeasurements(
      width,
      left,
      currentOffset,
      resizeUnitWidth,
      resizeSide.current,
    );
    if (!measurements) {
      // this happens if you're trying to shrink a card to less than 1 day long
      return;
    }
    const { newWidth, newLeft } = measurements;

    const { newStart, newDue } =
      zoom === ZoomLevel.YEAR
        ? getNewDatesForYear(
            item.startTime,
            item.endTime,
            currentOffset / 4,
            'months',
            resizeSide.current,
          )
        : getNewDates(
            item.startTime,
            item.endTime,
            currentOffset,
            'day',
            resizeSide.current,
          );

    if (newWidth !== widthRef.current) {
      const columnHighlightStart = newLeft / colWidth;
      const columnHighlightEnd =
        zoom === ZoomLevel.QUARTER || zoom === ZoomLevel.YEAR
          ? columnHighlightStart + newWidth / colWidth
          : columnHighlightStart + newWidth / colWidth - 1;
      // this call is a source of lag when resizing a card on large boards.
      // it's because this changes TimelineGrid's state, which in turn rerenders EVERYTHING,
      // even though it should only rerender the TimeBar. We could maybe experiment with
      // memo() or something to prevent mass rerenders.
      setColumnRangeToHighlight?.([columnHighlightStart, columnHighlightEnd]);
    }

    if (
      (resizeSide.current === 'right' && !resizeDate.isSame(newDue)) ||
      (resizeSide.current === 'left' && !resizeDate.isSame(newStart))
    ) {
      if (resizeSide.current === 'right' && newDue) {
        // checking the offset so the dates shown by year view are consistent
        currentOffset === 0
          ? setCurrentResizeDate(moment(item.endTime))
          : setCurrentResizeDate(newDue);
        resizeDate = newDue;
        offset = currentOffset;
      } else if (resizeSide.current === 'left' && newStart) {
        currentOffset === 0
          ? setCurrentResizeDate(moment(item.startTime))
          : setCurrentResizeDate(newStart);
        resizeDate = newStart;
        offset = currentOffset;
      }
    }
    setWidth(newWidth);
    setLeft(newLeft);
    setItemWidth(newWidth);
  };

  const finishResize = async (e: MouseEvent) => {
    setZIndex(1);
    setIsResizing(false);
    setColumnRangeToHighlight?.(null);
    document.removeEventListener('mousemove', duringResize);
    // something is wrong if we don't have a side or an initial x pos
    if (!resizeSide.current || !resizeCursorStart.current) {
      resizeSide.current = null;
      return;
    }

    let calculatedOffset = offset;
    // Year zoom specifically tries to resize by months instead of days
    // The offset is obtained in quarter month increments so we need to
    // divide it by four to get the number of months to resize by
    if (zoom === ZoomLevel.YEAR) {
      calculatedOffset = offset / 4;
    }

    const { newStart, newDue } =
      zoom === ZoomLevel.YEAR
        ? getNewDatesForYear(
            item.startTime,
            item.endTime,
            calculatedOffset,
            'months',
            resizeSide.current,
          )
        : getNewDates(
            item.startTime,
            item.endTime,
            calculatedOffset,
            'day',
            resizeSide.current,
          );

    if (
      !newStart || // missing start date
      !newDue || // missing end date
      !offset || // user's drag distance not enough to trigger a resize
      newStart.valueOf() > newDue.valueOf() || // order of start and end dates are reversed
      !canEdit() // user does not have editing permissions
    ) {
      resizeSide.current = null;
      return;
    }

    // finally, use the mutation to set the new dates on that card
    try {
      const side = resizeSide.current;
      resizeSide.current = null;
      await updateCardDates({
        variables: {
          idCard: item.id,
          start: newStart.toISOString(),
          due: newDue.toISOString(),
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCardDates: {
            id: item.id,
            start: newStart.toISOString(),
            due: newDue.toISOString(),
            __typename: 'Card',
          },
        },
      });

      if (idBoard && idOrg) {
        trackResize(side, item.id, idBoard, idOrg, idEnterprise);
      }
    } catch (err) {
      // since the mutation failed, set the item back to its original measurements
      setLeft(initialLeft);
      setWidth(initialWidth);

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
  };

  // show the vertical handle line on each end of the item,
  // if we are in the middle of resizing, or we are hovering over the item
  const showHandleLine =
    isResizing || (isHovering && !draggableState.isDragging);

  const showNarrowHandles = width < RESIZE_NARROW_HANDLE_MAX;

  const renderSideTitle = () => {
    if (initialRenderSideTitle && width <= MAX_WIDTH_FOR_SIDE_TITLE) {
      return <ItemSideTitle item={item} left={width + SIDE_TITLE_PADDING} />;
    }
  };

  const isHoverEffectsEnabled = useFeatureFlag(
    'ecosystem.timeline-hover-effects',
    false,
  );

  return (
    <div
      className={styles.itemResizer}
      style={{ left, width }}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseEnter={() => setIsHovering(true)}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseLeave={() => setIsHovering(false)}
    >
      {canEdit() &&
        (isResizing &&
        isHoverEffectsEnabled &&
        resizeSide.current === 'left' ? (
          <>
            <ItemResizerTooltip
              content={currentResizeDate
                .toDate()
                .toLocaleDateString(currentLocale, {
                  month: 'short',
                  day: 'numeric',
                })}
            >
              <div
                className={classNames(
                  showNarrowHandles
                    ? styles.itemHandleLeftNarrow
                    : styles.itemHandleLeft,
                  !isResizable && styles.noPointerEvents,
                  showHandleLine && styles.itemHandleLine,
                )}
                // eslint-disable-next-line react/jsx-no-bind
                onMouseDown={(e) => isResizable && startResize(e, 'left')}
                role="button"
              />
            </ItemResizerTooltip>
          </>
        ) : (
          <div
            className={classNames(
              showNarrowHandles
                ? styles.itemHandleLeftNarrow
                : styles.itemHandleLeft,
              !isResizable && styles.noPointerEvents,
              showHandleLine && styles.itemHandleLine,
            )}
            // eslint-disable-next-line react/jsx-no-bind
            onMouseDown={(e) => isResizable && startResize(e, 'left')}
            role="button"
          />
        ))}
      {children}
      {canEdit() &&
        (isResizing &&
        isHoverEffectsEnabled &&
        resizeSide.current === 'right' ? (
          <>
            <ItemResizerTooltip
              content={currentResizeDate
                .toDate()
                .toLocaleDateString(currentLocale, {
                  month: 'short',
                  day: 'numeric',
                })}
            >
              <div
                className={classNames(
                  showNarrowHandles
                    ? styles.itemHandleRighttNarrow
                    : styles.itemHandleRight,
                  !isResizable && styles.noPointerEvents,
                  showHandleLine && styles.itemHandleLine,
                )}
                // eslint-disable-next-line react/jsx-no-bind
                onMouseDown={(e) => isResizable && startResize(e, 'right')}
                role="button"
              />
            </ItemResizerTooltip>
          </>
        ) : (
          <div
            className={classNames(
              showNarrowHandles
                ? styles.itemHandleRightNarrow
                : styles.itemHandleRight,
              !isResizable && styles.noPointerEvents,
              showHandleLine && styles.itemHandleLine,
            )}
            // eslint-disable-next-line react/jsx-no-bind
            onMouseDown={(e) => isResizable && startResize(e, 'right')}
            role="button"
          />
        ))}
      {renderSideTitle()}
    </div>
  );
};
