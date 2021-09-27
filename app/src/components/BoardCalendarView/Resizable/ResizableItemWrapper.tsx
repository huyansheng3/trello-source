import React, { useCallback, useContext, useMemo } from 'react';
import cx from 'classnames';

import { BoardViewContext } from 'app/src/components/BoardViewContext/BoardViewContext';

import {
  DraggableContext,
  SelectedEventData,
} from 'app/src/components/BoardCalendarView/Draggable';

import { ResizableContext } from './ResizableContext';
import { ResizeDirection } from './types';

import styles from './ResizableItemWrapper.less';

interface ResizableItemWrapperProps {
  eventData: SelectedEventData;
  hideLeftAnchor?: boolean;
  hideRightAnchor?: boolean;
  className?: string;
  scrollContainer?: HTMLDivElement | null;
}

export const ResizableItemWrapper: React.FC<ResizableItemWrapperProps> = ({
  eventData,
  hideLeftAnchor,
  hideRightAnchor,
  className,
  scrollContainer,
  children,
}) => {
  const {
    resizableState,
    handleBeginResize,
    handleResizing,
    handleEndResize,
  } = useContext(ResizableContext);

  const { draggableState } = useContext(DraggableContext),
    { isDragging } = draggableState;

  const { contextType } = useContext(BoardViewContext);
  const isWorkspaceView = contextType === 'workspace';

  const onAnchorClick = useCallback(
    (mouseDownEvent: React.MouseEvent, direction: ResizeDirection) => {
      const { clientX: initialX, clientY: initialY } = mouseDownEvent;

      // Ignore right clicks
      if (mouseDownEvent.button === 2) {
        return;
      }

      let currentX = initialX,
        currentY = initialY;

      handleBeginResize(eventData, initialX, initialY, direction);

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        const { clientX: x, clientY: y } = mouseMoveEvent;

        handleResizing(x, y);

        currentX = x;
        currentY = y;
      };

      const handleScroll = (_: Event) => {
        handleResizing(currentX, currentY);
      };

      const handleMouseUp = (mouseUpEvent: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        scrollContainer?.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mouseup', handleMouseUp);

        const { clientX: x, clientY: y } = mouseUpEvent;

        handleEndResize(eventData, x, y);
      };

      document.addEventListener('mousemove', handleMouseMove);
      scrollContainer?.addEventListener('scroll', handleScroll);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [
      eventData,
      handleBeginResize,
      handleEndResize,
      handleResizing,
      scrollContainer,
    ],
  );

  const onLeftAnchorClick = useCallback(
    (e) => onAnchorClick(e, ResizeDirection.LEFT),
    [onAnchorClick],
  );

  const onRightAnchorClick = useCallback(
    (e) => onAnchorClick(e, ResizeDirection.RIGHT),
    [onAnchorClick],
  );

  const { isResizing, resizedEventData } = resizableState;

  const classNames = useMemo(() => {
    const classNames = [];
    if (isResizing) {
      if (resizedEventData?.id === eventData.id) {
        classNames.push(styles.isBeingResized);
      } else {
        classNames.push(styles.isResizing);
      }
    }
    return classNames;
  }, [isResizing, resizedEventData?.id, eventData.id]);

  return (
    <div className={cx(styles.resizableItemContainer, classNames, className)}>
      <div
        className={cx(
          styles.leftAnchor,
          (hideLeftAnchor || isResizing || isDragging) && styles.hide,
          isWorkspaceView && styles.shiftOutwards,
        )}
        onMouseDown={onLeftAnchorClick}
        role="button"
      >
        <div className={styles.anchorLine} />
      </div>
      {children}
      <div
        className={cx(
          styles.rightAnchor,
          (hideRightAnchor || isResizing || isDragging) && styles.hide,
          isWorkspaceView && styles.shiftOutwards,
        )}
        onMouseDown={onRightAnchorClick}
        role="button"
      >
        <div className={styles.anchorLine} />
      </div>
    </div>
  );
};
