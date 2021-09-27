import React from 'react';

import { TimelineItem, Column, Range, NavigateToCardParams } from './types';
import { ItemView } from './ItemView';
import moment from 'moment';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import {
  MAX_WIDTH_FOR_SIDE_TITLE,
  MIN_SPACE_BETWEEN_FOR_SIDE_TITLE,
  MONTH_BOUNDARIES,
} from './constants';

import { seesVersionedVariation } from '@trello/feature-flag-client';

interface ItemRowViewProps {
  items: Array<TimelineItem>;
  colWidth: number;
  columns: Array<Column>;
  styles: CSSModule;
  navigateToCard?: (id: string, params: NavigateToCardParams) => void;
  setColumnRangeToHighlight?: (val: Range) => void;
  // needed for analytics purposes
  idBoard?: string;
  idOrg?: string;
  idEnterprise?: string;
  zoom: ZoomLevel;
  rootRef: React.RefObject<HTMLDivElement>;
}

export const ItemRowView: React.FunctionComponent<ItemRowViewProps> = ({
  items,
  colWidth,
  columns,
  styles,
  navigateToCard,
  setColumnRangeToHighlight,
  idBoard,
  idOrg,
  idEnterprise,
  zoom,
  rootRef,
}) => {
  const isResizingEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const isInfiniteScrollEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const findCol = (time: number) => {
    // the timeline currently only renders a fixed date range
    // so if the item goes beyond that range, just snap it to the max or
    // min of the range. This will be fixed later on.
    if (time < columns[0].startTime) {
      return 0;
    } else if (time > columns[columns.length - 1].endTime) {
      return columns.length - 1;
    }

    const col = columns.findIndex(
      (c) => time >= c.startTime && time <= c.endTime,
    );
    if (col === null) {
      return null;
    }

    return col;
  };

  const shouldNotRender = (startTime: number, endTime: number) => {
    return (
      (startTime < columns[0].startTime && endTime < columns[0].endTime) ||
      (startTime > columns[columns.length - 1].startTime &&
        endTime > columns[columns.length - 1].endTime)
    );
  };

  const computeItemPosition = (
    startCol: number,
    endCol: number,
    colSpan: number,
    item: TimelineItem,
  ) => {
    let leftIndent = 0;

    let itemWidth = colSpan * colWidth;

    if (zoom === ZoomLevel.QUARTER) {
      const startMonth = moment(item.startTime);
      const endMonth = moment(columns[endCol].endTime);
      const rightIndent =
        endMonth.diff(item.endTime, 'days') / endMonth.daysInMonth();

      leftIndent =
        startMonth.diff(columns[startCol].startTime, 'days') /
        startMonth.daysInMonth();

      itemWidth =
        (colSpan - 2) * colWidth +
        colWidth * (1 - leftIndent) +
        colWidth * (1 - rightIndent);
    }

    if (zoom === ZoomLevel.YEAR) {
      const startMonth = moment(item.startTime);
      const endMonth = moment(item.endTime);
      let rightIndent = 0;

      leftIndent =
        0.25 *
        MONTH_BOUNDARIES.findIndex(({ end }) => startMonth.date() <= end);

      rightIndent =
        0.25 *
        (3 - MONTH_BOUNDARIES.findIndex(({ end }) => endMonth.date() <= end));

      itemWidth =
        (colSpan - 2) * colWidth +
        colWidth * (1 - leftIndent) +
        colWidth * (1 - rightIndent);
    }

    return {
      initialLeft: leftIndent * colWidth + startCol * colWidth,
      itemWidth: itemWidth,
    };
  };

  const itemViews = items.map((item) => {
    const startCol = findCol(item.startTime);
    const endCol = findCol(item.endTime);

    if (startCol === null || endCol === null) {
      return null;
    }

    const colSpan = 1 + endCol - startCol;
    const { initialLeft, itemWidth } = computeItemPosition(
      startCol,
      endCol,
      colSpan,
      item,
    );

    return { startCol, colSpan, initialLeft, itemWidth };
  });

  return (
    <>
      <div className={styles.row}>
        {items.map((item, index) => {
          if (itemViews[index] === null) {
            return null;
          } else if (
            // if item is totally out of the rendered columns
            // don't render it at all
            isInfiniteScrollEnabled &&
            shouldNotRender(item.startTime, item.endTime)
          ) {
            return null;
          } else {
            let renderSideTitleText = false;
            if (
              itemViews[index]!.itemWidth < MAX_WIDTH_FOR_SIDE_TITLE &&
              index === items.length - 1
            ) {
              renderSideTitleText = true;
            } else if (
              itemViews[index]!.itemWidth < MAX_WIDTH_FOR_SIDE_TITLE &&
              index < items.length - 1
            ) {
              renderSideTitleText =
                itemViews[index + 1]!.initialLeft -
                  itemViews[index]!.initialLeft -
                  itemViews[index]!.itemWidth >
                MIN_SPACE_BETWEEN_FOR_SIDE_TITLE;
            }

            return (
              <ItemView
                key={item.id}
                item={item}
                isResizable={isResizingEnabled}
                colWidth={colWidth}
                setColumnRangeToHighlight={setColumnRangeToHighlight}
                navigateToCard={navigateToCard}
                idBoard={idBoard}
                idOrg={idOrg}
                idEnterprise={idEnterprise}
                zoom={zoom}
                initialLeft={itemViews[index]!.initialLeft}
                initialWidth={itemViews[index]!.itemWidth}
                initialRenderSideTitle={renderSideTitleText}
                rootRef={rootRef}
              />
            );
          }
        })}
      </div>
    </>
  );
};
