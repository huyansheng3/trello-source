import { useReducer } from 'react';

import {
  getUpdatedDateRange,
  SelectedEventData,
} from 'app/src/components/BoardCalendarView/Draggable';

import { ResizeDirection } from './types';

type ResizableAction =
  | {
      type: 'begin_resize';
      payload: {
        resizeDirection: ResizeDirection;
        resizedEventData: SelectedEventData;
        originalSlot: Date | null;
      };
    }
  | {
      type: 'handle_resizing';
      payload: {
        currentSlot: Date | null;
      };
    }
  | {
      type: 'end_resize';
    };

export interface ResizableState {
  isResizing: boolean;
  resizeDirection: ResizeDirection | null;
  resizedEventData: SelectedEventData | null;
  // originalSlot is the date cell where the resize action was
  // initiated
  originalSlot: Date | null;
  // currentSlot is the date cell where the mouse is currently
  // hovering
  currentSlot: Date | null;
  // highlightedDateRange is the range of dates where the
  // resize action is currently affecting
  highlightedDateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export const initialResizableState = {
  isResizing: false,
  resizeDirection: null,
  resizedEventData: null,
  originalSlot: null,
  currentSlot: null,
  highlightedDateRange: {
    start: null,
    end: null,
  },
} as ResizableState;

const resizableReducer = (state: ResizableState, action: ResizableAction) => {
  switch (action.type) {
    case 'begin_resize': {
      const {
        resizedEventData,
        originalSlot,
        resizeDirection,
      } = action.payload;

      // TODO This shouldn't happen, so we should track it
      if (!originalSlot) {
        return state;
      }

      return {
        ...state,
        isResizing: true,
        resizeDirection,
        resizedEventData,
        originalSlot,
        currentSlot: originalSlot,
        highlightedDateRange: getUpdatedDateRange(
          originalSlot,
          originalSlot,
          resizedEventData,
        ),
      };
    }
    case 'handle_resizing': {
      const { currentSlot } = action.payload;
      const {
        resizedEventData,
        originalSlot,
        currentSlot: previousSlot,
        resizeDirection,
      } = state;

      if (
        resizedEventData &&
        originalSlot &&
        currentSlot &&
        // Don't update the state if we're hovering within the
        // same time slot
        (!previousSlot || previousSlot.getTime() !== currentSlot.getTime())
      ) {
        return {
          ...state,
          currentSlot,
          highlightedDateRange: getUpdatedDateRange(
            currentSlot,
            originalSlot,
            resizedEventData,
            {
              [resizeDirection === ResizeDirection.LEFT
                ? 'addDaysToStart'
                : 'addDaysToEnd']: true,
            },
          ),
        };
      }
      return state;
    }
    case 'end_resize': {
      return initialResizableState;
    }
    default: {
      return state;
    }
  }
};

export const useResizableReducer = () => {
  const [state, dispatch] = useReducer(resizableReducer, initialResizableState);

  return {
    state,
    dispatch,
  };
};
