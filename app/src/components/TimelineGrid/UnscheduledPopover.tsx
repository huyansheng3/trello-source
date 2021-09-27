import React, { useContext, useCallback } from 'react';
import moment from 'moment';
import cx from 'classnames';
import {
  HideReason,
  Popover,
  PopoverPlacement,
  usePopover,
} from '@trello/nachos/popover';

import { forTemplate } from '@trello/i18n';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { PermissionsContext } from 'app/src/components/BoardDashboardView/PermissionsContext';
import { DraggableItemWrapper } from 'app/src/components/BoardCalendarView/Draggable/DraggableItemWrapper';
import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';

import { NavigateToCardParams, TimelineItem } from './types';
import { ItemViewDetail } from './ItemViewDetail';

import styles from './UnscheduledPopover.less';

const format = forTemplate('timeline');

interface UnscheduledPopoverProps {
  popoverItems: TimelineItem[];
  popoverTargetRef: React.RefObject<HTMLDivElement> | undefined;
  popoverTriggerRef: React.RefObject<HTMLButtonElement> | undefined;
  rootRef: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  onHide: () => void;
  onDrawerItemClick: (id: string, params?: NavigateToCardParams) => void;
  zoom: ZoomLevel;
  currentScrolledDate: moment.Moment;
}

/**
 * The mapping tells the number of days added to the startime
 * when dragging from unscheduled popover to the grid. For e.g.
 * for a ZoomLevel Day, no days are added (the event is just one day long)
 */

const ZOOM_DURATION_MAP = {
  [ZoomLevel.DAY]: 0,
  [ZoomLevel.WEEK]: 1,
  [ZoomLevel.MONTH]: 6,
  [ZoomLevel.QUARTER]: 14,
  [ZoomLevel.YEAR]: 29,
};

function UnscheduledPopover({
  popoverItems,
  onDrawerItemClick,
  onHide,
  popoverTargetRef,
  popoverTriggerRef,
  isVisible,
  rootRef,
  zoom,
  currentScrolledDate = moment(),
}: UnscheduledPopoverProps) {
  const targetElement = popoverTargetRef?.current || null;

  // Unscheduled drawer popover
  const { popoverProps } = usePopover<HTMLDivElement, HTMLDivElement>();

  const onDrawerClose = (hideReason: HideReason) => {
    onHide();
    popoverTriggerRef?.current?.focus({ preventScroll: true });
  };

  const isDnDEnabled = useFeatureFlag(
    'ecosystem.timeline-unscheduled-drag-and-drop',
    false,
  );
  const { canEdit } = useContext(PermissionsContext);

  const { draggableState } = useContext(DraggableContext);
  const canDrag = canEdit() && isDnDEnabled;
  const renderItem = useCallback(
    (item: TimelineItem) => {
      const onDrawerItemClickWithFocus = (idCard: string) => {
        onDrawerItemClick(idCard, {
          onHide: () => {
            popoverTriggerRef?.current?.focus({ preventScroll: true });
          },
        });
      };
      return (
        <ItemViewDetail
          item={item}
          itemWidth={200}
          initialWidth={200}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => onDrawerItemClickWithFocus(item.id)}
          initialRenderSideTitle={false}
          draggable={!canDrag}
          allowHoverEffects={false}
        />
      );
    },
    [onDrawerItemClick, popoverTriggerRef, canDrag],
  );
  return (
    <>
      <Popover
        {...popoverProps}
        title={format('click-and-add-dates')}
        placement={PopoverPlacement.RIGHT_START}
        // eslint-disable-next-line react/jsx-no-bind
        onHide={onDrawerClose}
        noHorizontalPadding
        noVerticalPadding
        dangerous_className={cx(styles.popover, {
          [styles.isDragging]: draggableState.isDragging,
        })}
        targetElement={targetElement}
        isVisible={isVisible}
      >
        {popoverItems.length > 0 && (
          <div
            className={styles.popoverItemsWrapper}
            style={{
              maxHeight: 210,
              padding: '4px 0 8px 0',
            }}
            data-name="unscheduled-popover"
          >
            {popoverItems.map((item: TimelineItem) => (
              <div
                className={styles.popoverItemWrapper}
                key={`item-${item.id}`}
                data-name="unscheduled-popover-item"
              >
                {canDrag && (
                  <DraggableItemWrapper
                    eventData={{
                      start: null,
                      end: null,
                      id: item.id,
                      originalEvent: item,
                      duration: ZOOM_DURATION_MAP[zoom],
                    }}
                    className={styles.draggableWrapper}
                    scrollContainer={rootRef.current}
                    useMiniCardDrag
                  >
                    {renderItem(item)}
                  </DraggableItemWrapper>
                )}
                {!canDrag && renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </Popover>
    </>
  );
}

export { UnscheduledPopover };
