import React from 'react';
import { Tooltip } from '@trello/nachos/tooltip';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('timeline');

interface DragAndDropTimelineEventProps {
  canDrag: boolean;
}
/*
This component currently only behaves like a tooltip wrapper around an item.
Hovering and dragging the component will render the tooltip message,
while drag and drop will be implemented later.
*/
export const DragAndDropTimelineEvent: React.FunctionComponent<DragAndDropTimelineEventProps> = ({
  canDrag,
  children,
}) => {
  return canDrag ? (
    <Tooltip
      content={format('drag-and-drop-coming-soon')}
      delay={300}
      position="right"
    >
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );
};
