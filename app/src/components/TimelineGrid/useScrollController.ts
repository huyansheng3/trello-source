import { useRef, useCallback } from 'react';
import moment from 'moment';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import { GROUP_HEADER_WIDTH } from './constants';

interface UseControllerProps {
  colWidth: number;
  todayIndex: number;
  rootRef: React.RefObject<HTMLDivElement> | undefined;
  zoom: ZoomLevel;
}

export const useScrollController = ({
  colWidth,
  todayIndex,
  rootRef,
  zoom,
}: UseControllerProps) => {
  const groupHeaderWidth = GROUP_HEADER_WIDTH;
  const isDragging = useRef(false);

  const moveStart = () => {
    isDragging.current = true;
  };

  const moveStop = () => {
    isDragging.current = false;
  };

  const doMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (rootRef?.current && isDragging.current) {
      const left = Math.max(0, rootRef.current.scrollLeft - e.movementX);
      const top = Math.max(0, rootRef.current.scrollTop - e.movementY);
      rootRef.current.scrollTo(left, top);
    }
  };

  const scrollVertical = (amount: number) => {
    rootRef?.current?.scrollTo({
      top: rootRef.current.scrollTop + amount,
      left: rootRef.current.scrollLeft,
      behavior: 'smooth',
    });
  };

  // scroll a certain number of days forward (+) or backward (-)
  const scrollDays = (days: number, opts?: ScrollOptions) => {
    if (rootRef?.current) {
      const scrollLeft =
        (Math.floor(rootRef.current.scrollLeft / colWidth) + days) * colWidth;
      rootRef.current.scrollTo({
        top: rootRef.current.scrollTop,
        left: scrollLeft,
        behavior: opts?.behavior || 'smooth',
      });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 37) {
      scrollDays(-1); // left arrow key
    } else if (e.keyCode === 39) {
      scrollDays(1); // right arrow key
    } else if (e.keyCode === 38) {
      scrollVertical(-100); // up arrow key
    } else if (e.keyCode === 40) {
      scrollVertical(100); // down arrow key
    }
  };

  // scroll to today's column
  const scrollToToday = useCallback(
    (opts?: ScrollOptions) => {
      if (rootRef?.current) {
        // get the number of visible columns.
        const visibleColumns =
          rootRef.current.getBoundingClientRect().width / colWidth;

        // scroll to the column that is "half" a screen before today's column,
        // so that today's column appears in the middle.
        const scrollLeft =
          colWidth * Math.ceil(todayIndex - visibleColumns / 3) +
          groupHeaderWidth;

        // finally, scroll to that position
        rootRef.current.scrollTo({
          top: rootRef.current.scrollTop,
          left: scrollLeft,
          behavior: opts?.behavior || 'smooth',
        });
      }
    },
    [colWidth, rootRef, groupHeaderWidth, todayIndex],
  );

  const scrollTo = (index: number, opts?: ScrollOptions) => {
    if (rootRef?.current) {
      // get the number of visible columns.
      const visibleColumns =
        (rootRef.current.getBoundingClientRect().width - groupHeaderWidth) /
        colWidth;

      // todo: how does this affect infinite scroll
      const scrollLeft = colWidth * Math.ceil(index - visibleColumns / 2);

      // finally, scroll to that position
      rootRef.current.scrollTo({
        top: rootRef.current.scrollTop,
        left: scrollLeft,
        behavior: opts?.behavior || 'smooth',
      });
    }
  };
  let isThrottling = false;
  const getDateAtMousePosition = (x: number, y: number) => {
    const elements = document.elementsFromPoint(x, y) as HTMLElement[];
    const currentColumn = elements.find((el) => el.dataset.starttime);
    const isOverUnscheduledPopover = !!elements.find(
      (el) => el.dataset.name === 'unscheduled-popover',
    );

    // Need to add this check as well because of the overflow in the popover
    const isOverUnscheduledItems = !!elements.find(
      (el) => el.dataset.name === 'unscheduled-popover-item',
    );
    if (!currentColumn) {
      return {
        date: null,
      };
    }

    const { dataset } = currentColumn;
    const { starttime, endtime, groupId } = dataset;
    if (!starttime || !endtime) {
      return {
        date: null,
      };
    }
    const rect = currentColumn.getBoundingClientRect();

    let timeAtMouse = +starttime;
    // The delta represents days in Quarter and Year zoom level and hence is required
    // to be added
    if (zoom === ZoomLevel.QUARTER || zoom === ZoomLevel.YEAR) {
      const delta =
        Math.ceil((+endtime - +starttime) / colWidth) * Math.abs(x - rect.left);
      timeAtMouse = +starttime + delta;
    }
    const date = moment(timeAtMouse).startOf('day').toDate();
    if (rootRef?.current) {
      const rootRefRect = rootRef?.current?.getBoundingClientRect();
      /**
       * if the current mouse position is over last visible column
       * in either side, then we scroll right or left by 1 column
       * This allows for scrolling while dragging.
       * The 20 pixels is an additional buffer so that the mouse doesn't
       * have to be right on top of the column line
       */
      if (rootRefRect.left + groupHeaderWidth + 20 > x && !isThrottling) {
        // scroll left
        isThrottling = true;
        setTimeout(() => {
          rootRef?.current?.scrollTo({
            top: rootRef.current.scrollTop,
            left: rootRef.current.scrollLeft - colWidth,
            behavior: 'smooth',
          });
          isThrottling = false;
        }, 300);
      } else if (rootRefRect.right - 20 < x) {
        // scroll right
        isThrottling = true;
        setTimeout(() => {
          rootRef?.current?.scrollTo({
            top: rootRef.current.scrollTop,
            left: rootRef.current.scrollLeft + colWidth,
            behavior: 'smooth',
          });
          isThrottling = false;
        }, 300);
      }
    }
    return {
      date,
      isMultiDaySlot: true,
      groupId,
      isUnscheduled: isOverUnscheduledPopover || isOverUnscheduledItems,
    };
  };
  return {
    moveStart,
    moveStop,
    doMove,
    scrollVertical,
    scrollDays,
    scrollTo,
    onKeyDown,
    scrollToToday,
    getDateAtMousePosition,
  };
};
