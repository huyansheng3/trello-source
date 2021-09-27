import React, { useState } from 'react';
import cx from 'classnames';

import { isSafari } from '@trello/browser';

import { useMountEffect } from './useMountEffect';
import styles from './ScrollController.less';

interface ScrollControllerProps {
  rootRef: React.RefObject<HTMLDivElement>;
  moveStart: () => void;
  moveStop: () => void;
  doMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollToToday: (opts?: ScrollOptions) => void;
  doNotScroll?: boolean;
}

export const ScrollController: React.FunctionComponent<ScrollControllerProps> = ({
  children,
  rootRef,
  moveStart,
  moveStop,
  doMove,
  onKeyDown,
  onScroll,
  scrollToToday,
  doNotScroll = false,
}) => {
  // use to focus on grid on render, so it will recognize keyDown events
  // the tabIndex prop on the grid is also needed.
  // also, jump to today's date on initial render
  useMountEffect(() => {
    rootRef?.current?.focus();
    scrollToToday({ behavior: 'auto' });
  });

  const onGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e);
  };

  const [isDragging, setIsDragging] = useState(false);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(styles.scrollArea, { [styles.noScroll]: doNotScroll })}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseDown={() => {
        if (!doNotScroll) {
          moveStart();
          setIsDragging(true);
        }
      }}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseUp={() => {
        moveStop();
        setIsDragging(false);
      }}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseLeave={() => {
        moveStop();
        setIsDragging(false);
      }}
      onMouseMove={doMove}
      onKeyDown={onKeyDown}
      // eslint-disable-next-line react/jsx-no-bind
      onScroll={onGridScroll}
      ref={rootRef}
    >
      <div
        className={cx(
          styles.scrollCanvas,
          isSafari() && styles.safari,
          isDragging && styles.isDragging,
        )}
      >
        {children}
      </div>
    </div>
  );
};
