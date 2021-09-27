import React, { createContext, useEffect, useRef } from 'react';

import {
  getUpdatedDateRange,
  SelectedEventData,
} from 'app/src/components/BoardCalendarView/Draggable';
import { EventData } from 'app/src/components/BoardCalendarView/types';

import { ResizeDirection } from './types';
import {
  ResizableState,
  initialResizableState,
  useResizableReducer,
} from './useResizableReducer';

interface ResizableContextState {
  resizableState: ResizableState;
  handleBeginResize: (
    eventData: SelectedEventData,
    x: number,
    y: number,
    direction: ResizeDirection,
  ) => void;
  handleResizing: (x: number, y: number) => void;
  handleEndResize: (eventData: SelectedEventData, x: number, y: number) => void;
}

export const ResizableContext = createContext<ResizableContextState>({
  resizableState: initialResizableState,
  handleBeginResize() {},
  handleResizing() {},
  handleEndResize() {},
});

interface ResizableContextProviderProps {
  getDateSlot: (
    x: number,
    y: number,
  ) => {
    date: Date | null;
    isMultiDaySlot?: boolean;
  };
  onEndResize?: ({
    event,
    start,
    end,
  }: {
    event: EventData;
    start: Date;
    end: Date;
  }) => void;
}

export const ResizableContextProvider: React.FC<ResizableContextProviderProps> = ({
  getDateSlot,
  onEndResize,
  children,
}) => {
  const { state, dispatch } = useResizableReducer();

  const originalSlotRef = useRef(state.originalSlot);
  useEffect(() => {
    originalSlotRef.current = state.originalSlot;
  }, [state.originalSlot]);

  const currentSlotRef = useRef(state.currentSlot);
  useEffect(() => {
    currentSlotRef.current = state.currentSlot;
  }, [state.currentSlot]);

  const resizeDirectionRef = useRef(state.resizeDirection);
  useEffect(() => {
    resizeDirectionRef.current = state.resizeDirection;
  }, [state.resizeDirection]);

  const handleBeginResize = (
    eventData: SelectedEventData,
    initialX: number,
    initialY: number,
    resizeDirection: ResizeDirection,
  ) => {
    const { date: originalSlot } = getDateSlot(initialX, initialY);

    dispatch({
      type: 'begin_resize',
      payload: {
        resizeDirection,
        resizedEventData: eventData,
        originalSlot,
      },
    });
  };

  const handleResizing = (x: number, y: number) => {
    const { date: currentSlot } = getDateSlot(x, y);

    dispatch({
      type: 'handle_resizing',
      payload: { currentSlot },
    });
  };

  const handleEndResize = (
    eventData: SelectedEventData,
    x: number,
    y: number,
  ) => {
    let { date: currentSlot } = getDateSlot(x, y);

    if (!currentSlot) {
      currentSlot = currentSlotRef.current;
    }

    if (
      onEndResize &&
      // Only call onEndResize if we ended on a different slot
      currentSlot &&
      originalSlotRef.current &&
      currentSlot.getTime() !== originalSlotRef.current.getTime()
    ) {
      const { start, end } = getUpdatedDateRange(
        currentSlot,
        originalSlotRef.current,
        eventData,
        {
          [resizeDirectionRef.current === ResizeDirection.LEFT
            ? 'addDaysToStart'
            : 'addDaysToEnd']: true,
        },
      ) as { start: Date; end: Date };

      onEndResize({ event: eventData.originalEvent as EventData, start, end });
    }

    dispatch({ type: 'end_resize' });
  };

  return (
    <ResizableContext.Provider
      value={{
        resizableState: state,
        handleBeginResize,
        handleResizing,
        handleEndResize,
      }}
    >
      {children}
    </ResizableContext.Provider>
  );
};
