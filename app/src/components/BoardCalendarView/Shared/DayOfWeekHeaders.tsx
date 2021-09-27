import React, { useContext } from 'react';
import cx from 'classnames';

import { isWeekend } from '@trello/dates';

import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';

import { BackgroundCellWrapper } from './BackgroundCellWrapper';
import { DateLabel } from './DateLabel';
import { DayOfWeekLabel } from './DayOfWeekLabel';

import styles from './DayOfWeekHeaders.less';

interface DayOfWeekHeadersProps {
  dates: Date[];
  selectedDate: Date;
  fixed?: boolean;
  show?: boolean;
  preventShadeOffRange?: boolean;
  renderGutter?: boolean;
  renderDate?: boolean;
  scrollBarWidth?: number;
}

export const DayOfWeekHeaders: React.FC<DayOfWeekHeadersProps> = ({
  dates,
  selectedDate,
  fixed,
  show,
  preventShadeOffRange,
  renderGutter,
  renderDate,
  scrollBarWidth = 0,
}) => {
  const { draggableState } = useContext(DraggableContext);

  const gutterClassNames = [];
  if (!fixed) {
    gutterClassNames.push(styles.weekendBgColor);
    if (!isWeekend(dates[0])) {
      gutterClassNames.push(styles.normalBgColor);
    } else if (draggableState.isDragging) {
      gutterClassNames.push(styles.normalBgColorWithTransition);
    }
  }

  return (
    <div
      className={cx(
        styles.dayOfWeekHeadersContainer,
        fixed && styles.fixedHeader,
        fixed && show && styles.showHeader,
      )}
      style={{ width: `calc(100% - ${scrollBarWidth}px)` }}
    >
      {renderGutter && (
        <div className={cx(styles.gutter, gutterClassNames)}></div>
      )}
      {dates.map((date, index) => (
        <BackgroundCellWrapper
          key={index}
          className={cx(styles.dayOfWeek, fixed && styles.fixedHeaderCell)}
          date={date}
          selectedDate={selectedDate}
          preventShadeOffRange={preventShadeOffRange}
          preventTodayHighlight={fixed}
        >
          <DayOfWeekLabel date={date} fixed={!!fixed} />
          {renderDate && <DateLabel date={date} disableTodayColor={!!fixed} />}
        </BackgroundCellWrapper>
      ))}
    </div>
  );
};
