import React, { CSSProperties, useRef, useContext, useCallback } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';

import {
  ItemGroup,
  TimelineGroup,
  Column,
  Range,
  NavigateToCardParams,
  LaneDoubleClickParams,
  TimelineItem,
} from './types';
import { ItemRowView } from './ItemRowView';
import { AddIcon } from '@trello/nachos/icons/add';
import { Button } from '@trello/nachos/button';
import { seesVersionedVariation } from '@trello/feature-flag-client';

import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';

const format = forTemplate('timeline');

interface ItemGroupViewProps {
  colWidth: number;
  totalWidth: number;
  columns: Array<Column>;
  timelineGroup: TimelineGroup;
  itemGroup: ItemGroup;
  unscheduledItemsCount: number;
  onUnscheduledClick: (params: {
    popoverTriggerRef: React.RefObject<HTMLButtonElement>;
    popoverTargetRef: React.RefObject<HTMLDivElement>;
  }) => void;
  unscheduledActive?: boolean;
  showGroupHeader: boolean;
  styles: CSSModule;
  isLastGroup?: boolean;
  style?: CSSProperties;
  zoom: ZoomLevel;
  navigateToCard?: (id: string, params: NavigateToCardParams) => void;
  setColumnRangeToHighlight?: (val: Range) => void;
  groupRef?: React.RefObject<HTMLDivElement>;
  onLaneDoubleClick: (args: LaneDoubleClickParams) => void;
  // needed for analytics purposes
  idBoard?: string;
  idOrg?: string;
  idEnterprise?: string;
  rootRef: React.RefObject<HTMLDivElement>;
}

export const TimelineCell = ({
  column,
  colWidth,
  onLaneDoubleClick,
  groupId,
  styles,
  shouldHighlightColumn,
}: {
  column: Column;
  colWidth: number;
  onLaneDoubleClick: (args: LaneDoubleClickParams) => void;
  groupId: string;
  styles: CSSModule;
  shouldHighlightColumn: (column: Column) => boolean;
}) => {
  const isAddFromLaneEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const onDoubleClick = useCallback(
    (e) => {
      if (!isAddFromLaneEnabled) {
        return;
      }
      const offsetX = e.nativeEvent.offsetX;
      const timeOffset = offsetX % colWidth;
      const current = moment();
      const clickTime =
        column.startTime +
        Math.floor(
          timeOffset * ((column.endTime - column.startTime) / colWidth),
        );
      const dueTime = moment(clickTime).set({
        hour: current.get('hour'),
        minute: current.get('minute'),
        second: 0,
        millisecond: 0,
      });
      onLaneDoubleClick({
        pos: { top: e.clientY, left: e.clientX },
        dueTime: dueTime.valueOf(),
        groupId: groupId,
      });
    },
    [
      colWidth,
      column.endTime,
      column.startTime,
      groupId,
      isAddFromLaneEnabled,
      onLaneDoubleClick,
    ],
  );
  return (
    <div
      style={{ width: colWidth }}
      key={`row-column-${column.startTime}`}
      className={classnames({
        [styles.groupColumnLine]: true,
        [styles.highlightedColumn]: shouldHighlightColumn(column),
      })}
      onDoubleClick={onDoubleClick}
      data-starttime={column.startTime}
      data-endtime={column.endTime}
      data-group-id={groupId}
    ></div>
  );
};

export const ItemGroupView: React.FunctionComponent<ItemGroupViewProps> = ({
  colWidth,
  columns,
  timelineGroup,
  itemGroup,
  unscheduledItemsCount,
  onUnscheduledClick,
  unscheduledActive = false,
  showGroupHeader,
  totalWidth,
  styles,
  isLastGroup = false,
  navigateToCard,
  setColumnRangeToHighlight,
  idBoard,
  idOrg,
  idEnterprise,
  groupRef,
  zoom,
  onLaneDoubleClick,
  rootRef,
}) => {
  const popoverTargetRef = useRef<HTMLDivElement>(null);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  const isUnscheduledCardsEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  const { draggableState } = useContext(DraggableContext);
  const {
    highlightedDateRange,
    groupId,
    isUnscheduled,
    isDragging,
  } = draggableState;
  const startTime = moment(highlightedDateRange.start || undefined);
  const endTime = moment(highlightedDateRange.end || undefined);
  const shouldHighlightColumn = useCallback(
    (column: Column): boolean => {
      if (!isDragging) {
        return false;
      }
      if (!highlightedDateRange.start) {
        return false;
      }
      if (isUnscheduled) {
        return false;
      }
      const highlightColumn =
        groupId === timelineGroup.id &&
        groupId ===
          (draggableState.draggedEventData?.originalEvent as TimelineItem)
            .activeGroupId;
      if (!highlightColumn) {
        return false;
      }
      const columnStartTime = moment(column.startTime);
      const columnEndTime = moment(column.endTime);

      return (
        startTime.isBetween(columnStartTime, columnEndTime, 'day', '[]') ||
        endTime.isBetween(columnStartTime, columnEndTime, 'day', '[]') ||
        (startTime.valueOf() >= column.startTime &&
          endTime.valueOf() <= column.endTime) ||
        (column.startTime >= startTime.valueOf() &&
          column.endTime <= endTime.valueOf())
      );
    },
    [
      draggableState.draggedEventData?.originalEvent,
      endTime,
      groupId,
      highlightedDateRange.start,
      startTime,
      timelineGroup.id,
      isUnscheduled,
      isDragging,
    ],
  );

  return (
    <>
      <div
        className={styles.unscheduledPositioner}
        style={{ width: totalWidth }}
      >
        <div
          className={styles.unscheduledPositionerInner}
          ref={popoverTargetRef}
        ></div>
      </div>
      <div
        className={classnames(styles.group, isLastGroup && styles.lastGroup)}
        style={{ width: totalWidth }}
        ref={groupRef}
      >
        <div
          className={classnames({
            [styles.groupHeader]: showGroupHeader,
            [styles.groupHeaderHidden]: !showGroupHeader,
            [styles.lastGroupHeader]: isLastGroup,
          })}
        >
          <div className={styles.groupHeaderInternal}>
            {timelineGroup.element}
            <div className={styles.groupHeaderTitle}>{timelineGroup.title}</div>
          </div>
          {showGroupHeader &&
            isUnscheduledCardsEnabled &&
            unscheduledItemsCount > 0 && (
              <Button
                appearance="link"
                ref={popoverTriggerRef}
                className={classnames(styles.groupHeaderSubtitle, {
                  [styles.active]: unscheduledActive,
                })}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  onUnscheduledClick({ popoverTriggerRef, popoverTargetRef });
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'timelineUnscheduledCardsButton',
                    source: 'timelineViewScreen',
                    containers: {
                      organization: { id: idOrg },
                      board: { id: idBoard },
                      enterprise: { id: idEnterprise },
                    },
                    attributes: {
                      // add zoom level and grouping to this
                      // we can achieve this through React context so we don't have to pass it all the way
                      // down from TimelineGrid
                    },
                  });
                }}
              >
                {format('not-scheduled-count', {
                  count: unscheduledItemsCount,
                })}
                <span className={styles.addIcon}>
                  <AddIcon size="small" />
                </span>
              </Button>
            )}
        </div>
        <div className={styles.rows}>
          {itemGroup.rows.map((items, index) => (
            <ItemRowView
              key={`row-${timelineGroup.id}-row-${index}`}
              items={items}
              colWidth={colWidth}
              columns={columns}
              styles={styles}
              navigateToCard={navigateToCard}
              setColumnRangeToHighlight={setColumnRangeToHighlight}
              idBoard={idBoard}
              idOrg={idOrg}
              zoom={zoom}
              rootRef={rootRef}
            />
          ))}
        </div>
        <div className={styles.groupColumnLines}>
          {columns.map((c) => (
            <TimelineCell
              column={c}
              colWidth={colWidth}
              onLaneDoubleClick={onLaneDoubleClick}
              groupId={timelineGroup.id}
              styles={styles}
              shouldHighlightColumn={shouldHighlightColumn}
              key={c.startTime}
            />
          ))}
        </div>
      </div>
    </>
  );
};
