import React, { useRef, useState, useLayoutEffect } from 'react';
import _ from 'underscore';
import cx from 'classnames';

import styles from './ShortenedList.less';

interface ShortenedListProps {
  itemClassName?: string;
  renderMoreElement?: (number: number) => React.ReactNode;
  hideOverflowingItems?: boolean;
  showAllEvents?: boolean;
  virtualChildren: React.ReactElement[];
  children: React.ReactElement[];
}

export const ShortenedList: React.FC<ShortenedListProps> = ({
  itemClassName,
  renderMoreElement,
  hideOverflowingItems = true,
  showAllEvents,
  virtualChildren,
  children,
}) => {
  const shortenedListContainerRef = useRef<HTMLDivElement>(null);
  const virtualContainerRef = useRef<HTMLDivElement>(null);

  const [numHiddenItems, setNumHiddenItems] = useState(0);

  useLayoutEffect(() => {
    const calculateItems = () => {
      const totalItems = virtualChildren.length;

      if (shortenedListContainerRef.current && virtualContainerRef.current) {
        virtualContainerRef.current.hidden = false;

        const childNodesArray = Array.from(
          virtualContainerRef.current.children,
        ) as HTMLElement[];

        const containerRightPos = shortenedListContainerRef.current.getBoundingClientRect()
          .right;

        for (let i = 0; i < totalItems; i++) {
          const pairIndex = i * 2;
          const itemNode = childNodesArray[pairIndex];
          const showMoreNode = childNodesArray[pairIndex + 1];

          // If this is the last item and it doesn't overflow,
          // just show all the items
          if (
            i === totalItems - 1 &&
            itemNode.getBoundingClientRect().right < containerRightPos
          ) {
            setNumHiddenItems(0);
            break;
          }

          showMoreNode.hidden = false;
          const showMoreNodeRightPos = showMoreNode.getBoundingClientRect()
            .right;
          showMoreNode.hidden = true;

          // If the show more node overflows, this and all
          // following items are hidden
          if (showMoreNodeRightPos >= containerRightPos) {
            setNumHiddenItems(totalItems - i);
            break;
          }
        }

        virtualContainerRef.current.hidden = true;
      }
    };
    calculateItems();

    const debouncedCalculateItems = _.debounce(calculateItems, 500);
    window.addEventListener('resize', debouncedCalculateItems);
    return () => window.removeEventListener('resize', debouncedCalculateItems);
  }, [virtualChildren]);

  const renderMoreSpan = (hidden = true) => (
    <span hidden={hidden}>
      {renderMoreElement && renderMoreElement(numHiddenItems)}
    </span>
  );

  const renderItems = () =>
    React.Children.map(children, (child, index) => (
      <span
        className={itemClassName}
        key={`shortened-list-item-${index}`}
        hidden={
          hideOverflowingItems &&
          index >= children.length - numHiddenItems &&
          !showAllEvents
        }
      >
        {child}
      </span>
    ));

  const renderVirtualChildren = () =>
    React.Children.map(virtualChildren, (child, index) => (
      <React.Fragment key={`virtual-list-item-${index}`}>
        <span className={itemClassName}>{child}</span>
        {renderMoreSpan()}
      </React.Fragment>
    ));

  return (
    <div
      className={styles.shortenedListContainer}
      ref={shortenedListContainerRef}
    >
      {renderItems()}
      {renderMoreSpan(numHiddenItems === 0 || showAllEvents)}
      <div
        className={cx(styles.virtualListItems)}
        ref={virtualContainerRef}
        hidden={true}
      >
        {renderVirtualChildren()}
      </div>
    </div>
  );
};
