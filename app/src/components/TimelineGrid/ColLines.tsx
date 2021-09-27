import React, { CSSProperties, useContext } from 'react';
import Observer from '@researchgate/react-intersection-observer';
import { TrelloBlue500 } from '@trello/colors';
import { seesVersionedVariation } from '@trello/feature-flag-client';
import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable/DraggableContext';

import { Column, Boundary } from './types';
import cx from 'classnames';

import { isSafari } from '@trello/browser';

interface RowLineProps {
  columns: Array<Column>;
  styles: CSSModule;
  groupHeaderWidth: number;
  colWidth: number;
  todayIndex: number;
  onBoundaryVisible: (boundary: Boundary, isDragging: boolean) => void;
}

export const ColLines = ({
  columns,
  styles,
  groupHeaderWidth,
  colWidth,
  todayIndex,
  onBoundaryVisible,
}: RowLineProps) => {
  const isInfiniteScrollEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );
  const { draggableState } = useContext(DraggableContext);
  return (
    <div className={styles.colLines}>
      <div style={{ flex: `0 0 ${groupHeaderWidth}px` }}></div>
      {columns.map((c, i) => {
        const style: CSSProperties = {
          flex: `0 0 ${colWidth}px`,
        };
        if (i === todayIndex) {
          // the 10 is to the alpha value, to make it transparent so column lines can still be seen
          style.backgroundColor = TrelloBlue500 + '10';
        }

        if (isInfiniteScrollEnabled && (i === 0 || i === columns.length - 1)) {
          const onChange = (e: IntersectionObserverEntry) => {
            if (i === 0 && e.isIntersecting) {
              onBoundaryVisible('beginning', draggableState.isDragging);
            } else if (i === columns.length - 1 && e.isIntersecting) {
              onBoundaryVisible('end', draggableState.isDragging);
            }
          };
          return (
            // eslint-disable-next-line react/jsx-no-bind
            <Observer onChange={onChange} key={`grid-observer-${c.startTime}`}>
              <div
                className={styles.colLine}
                style={style}
                key={`grid-line-${c.startTime}`}
              ></div>
            </Observer>
          );
        }
        return (
          <div
            className={cx(styles.colLine, {
              [styles.isWeekend]: c.isWeekend,
              [styles.isEndOfMonth]: c.isEndOfMonth,
              [styles.safari]: isSafari(),
            })}
            style={style}
            key={`grid-line-${c.startTime}`}
          ></div>
        );
      })}
    </div>
  );
};
