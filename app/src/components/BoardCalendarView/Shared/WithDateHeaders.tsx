import React, { useCallback, useContext, useRef, useState } from 'react';
import cx from 'classnames';

import { AddPopoverContext } from 'app/src/components/BoardCalendarView/AddPopoverContext';

import { DayOfWeekHeaders } from './DayOfWeekHeaders';
import { VerticalScrollContextProvider } from './VerticalScrollContext';

import styles from './WithDateHeaders.less';

interface WithDateHeadersProps {
  selectedDate: Date;
  dates: Date[];
  preventShadeOffRange?: boolean;
  renderHeaderGutter?: boolean;
  renderFixedHeaderDate?: boolean;
  className?: string;
  containerClassName?: string;
}

export const WithDateHeaders: React.FC<WithDateHeadersProps> = ({
  selectedDate,
  dates,
  preventShadeOffRange,
  renderHeaderGutter,
  renderFixedHeaderDate,
  className,
  containerClassName,
  children,
}) => {
  const { doNotScroll } = useContext(AddPopoverContext);

  const [isFixedHeaderShown, updateFixedHeaderShown] = useState(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (doNotScroll) {
        e.preventDefault();
        return;
      }

      const target = e.target as HTMLDivElement;
      const scrollPosition = target.scrollTop;
      const scrollThreshold = 20;

      if (isFixedHeaderShown && scrollPosition < scrollThreshold) {
        updateFixedHeaderShown(false);
      } else if (!isFixedHeaderShown && scrollPosition > scrollThreshold) {
        updateFixedHeaderShown(true);
      }
    },
    [doNotScroll, isFixedHeaderShown],
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cx(styles.zoomContainer, className)}>
      <DayOfWeekHeaders
        dates={dates}
        selectedDate={selectedDate}
        fixed={true}
        show={isFixedHeaderShown}
        renderGutter={renderHeaderGutter}
        renderDate={renderFixedHeaderDate}
        scrollBarWidth={
          (scrollContainerRef.current &&
            scrollContainerRef.current.offsetWidth -
              scrollContainerRef.current.clientWidth) ||
          0
        }
      />
      <div
        className={cx(
          styles.zoomScrollableContainer,
          doNotScroll && styles.preventScroll,
          containerClassName,
        )}
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        <DayOfWeekHeaders
          dates={dates}
          selectedDate={selectedDate}
          preventShadeOffRange={preventShadeOffRange}
          renderGutter={renderHeaderGutter}
        />
        <VerticalScrollContextProvider
          scrollContainer={scrollContainerRef.current}
        >
          {children}
        </VerticalScrollContextProvider>
      </div>
    </div>
  );
};
