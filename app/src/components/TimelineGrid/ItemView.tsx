import React, { useState, useRef, useContext, useCallback } from 'react';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { PermissionsContext } from 'app/src/components/BoardDashboardView/PermissionsContext';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import { DraggableItemWrapper } from 'app/src/components/BoardCalendarView/Draggable/DraggableItemWrapper';
import styles from './ItemView.less';
import { ItemResizer } from './ItemResizer';
import { ItemViewDetail } from './ItemViewDetail';
import { TimelineItem, Range, NavigateToCardParams } from './types';

interface ItemViewProps {
  item: TimelineItem;
  isResizable?: boolean;
  colWidth: number;
  onClick?: () => void;
  zoom: ZoomLevel;
  setColumnRangeToHighlight?: (val: Range) => void;
  navigateToCard?: (id: string, params: NavigateToCardParams) => void;
  // needed for analytics purposes
  idBoard?: string;
  idOrg?: string;
  idEnterprise?: string;
  initialWidth: number;
  initialLeft: number;
  initialRenderSideTitle: boolean;
  rootRef: React.RefObject<HTMLDivElement>;
}

export const ItemView: React.FunctionComponent<ItemViewProps> = ({
  item,
  isResizable = false,
  colWidth,
  setColumnRangeToHighlight,
  navigateToCard,
  idBoard,
  idOrg,
  idEnterprise,
  zoom,
  initialLeft = 0,
  initialWidth = 0,
  initialRenderSideTitle,
  rootRef,
}) => {
  // when an item is resizing, we need to set its z-index higher then its siblings.
  // This way it will overlap other items and be visible during the entire resize.
  const [zIndex, setZIndex] = useState(1);

  // later, this probably needs to be pushed up to the scroll area component
  // to let it know that if we are currently resizing an item,
  // we should scroll of the mouse is near the left/right borders of the scroll area
  const [isResizing, setIsResizing] = useState(false);

  const [itemWidth, setItemWidth] = useState<number>(initialWidth);

  const focusRef = useRef<HTMLDivElement>(null);

  const navigateToCardRestoreFocus = () => {
    navigateToCard?.(item.id, {
      onHide: () => {
        focusRef?.current?.focus();
      },
    });
  };
  const isDnDEnabled = useFeatureFlag(
    'ecosystem.timeline-drag-and-drop',
    false,
  );

  const renderDraggableChildren = useCallback(
    (children: React.ReactElement, isBeingDragged: boolean) => {
      return React.cloneElement(children, {
        isSlidable: !isBeingDragged,
      });
    },
    [],
  );

  const { canEdit } = useContext(PermissionsContext);

  let content = (
    <ItemViewDetail
      focusRef={focusRef}
      item={item}
      itemWidth={itemWidth}
      initialWidth={initialWidth}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={navigateToCardRestoreFocus}
      isResizing={isResizing}
      isSlidable={true}
      setItemWidth={setItemWidth}
      initialRenderSideTitle={initialRenderSideTitle}
      draggable={false}
    />
  );
  if (isDnDEnabled && canEdit()) {
    content = (
      <DraggableItemWrapper
        eventData={{
          start: new Date(item.startTime),
          end: new Date(item.endTime),
          id: item.id,
          originalEvent: item,
        }}
        className={styles.draggableWrapper}
        scrollContainer={rootRef.current}
        renderChildren={renderDraggableChildren}
      >
        {content}
      </DraggableItemWrapper>
    );
  }
  return (
    <div className={styles.item} style={{ zIndex }}>
      <ItemResizer
        item={item}
        styles={styles}
        colWidth={colWidth}
        initialLeft={initialLeft}
        initialWidth={initialWidth}
        setItemWidth={setItemWidth}
        isResizing={isResizing}
        isResizable={isResizable}
        setZIndex={setZIndex}
        setIsResizing={setIsResizing}
        setColumnRangeToHighlight={setColumnRangeToHighlight}
        idBoard={idBoard}
        idOrg={idOrg}
        idEnterprise={idEnterprise}
        zoom={zoom}
        initialRenderSideTitle={initialRenderSideTitle}
      >
        {content}
      </ItemResizer>
    </div>
  );
};
