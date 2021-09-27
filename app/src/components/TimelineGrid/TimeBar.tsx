import React, { CSSProperties } from 'react';
import cx from 'classnames';
import { Column, Range } from './types';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import { TimeBarHeader } from './TimeBarHeader';

interface TimeBarProps {
  columns: Array<Column>;
  styles: CSSModule;
  groupHeaderWidth: number;
  colWidth: number;
  totalWidth: number;
  todayIndex?: number;
  columnRangeToHighlight?: Range;
  zoom: ZoomLevel;
}

export const TimeBar: React.FC<TimeBarProps> = ({
  columns,
  styles,
  groupHeaderWidth,
  colWidth,
  totalWidth,
  todayIndex,
  columnRangeToHighlight,
  zoom,
}) => {
  return (
    <div className={cx(styles.timeBar)} style={{ width: totalWidth }}>
      <div
        className={styles.timeBarGradient}
        style={{ flexBasis: groupHeaderWidth }}
      ></div>
      {columns.map((c, i) => {
        const style: CSSProperties = {
          flexBasis: colWidth,
        };

        // highlight today's date, and the dates of a card being resized
        let isHighlighted = false;
        if (i === todayIndex) {
          isHighlighted = true;
        } else if (
          columnRangeToHighlight &&
          i >= columnRangeToHighlight[0] &&
          i <= columnRangeToHighlight[1]
        ) {
          isHighlighted = true;
        }
        return (
          <div
            className={cx(
              styles.timeBarItem,
              isHighlighted && styles.highlighted,
              c.isEndOfMonth && styles.isEndOfMonth,
              i === 0 && styles.firstTimeBarItem,
            )}
            style={style}
            key={`header-${c.startTime}`}
          >
            <TimeBarHeader styles={styles} zoom={zoom} column={c} />
          </div>
        );
      })}
    </div>
  );
};
