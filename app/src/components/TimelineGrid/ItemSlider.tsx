import React, { CSSProperties, useContext } from 'react';

import { GroupingContext } from './GroupingContext';
import { Side } from './types';
import { GROUP_HEADER_WIDTH } from './constants';

// padding between sticky element and the border it sticks to
const STICKY_PADDING = 8;

interface ItemSliderProps {
  side: NonNullable<Side>;
  oppositePadding: number;
  styles: CSSModule;
}

export const ItemSlider: React.FC<ItemSliderProps> = ({
  side,
  oppositePadding,
  styles,
  children,
}) => {
  const parentStyle: CSSProperties = {};
  const childStyle: CSSProperties = {};

  const grouping = useContext(GroupingContext);

  // if grouping is not 'none', compensate for a 200px wide group header
  const groupHeaderWidth = grouping === 'none' ? 0 : GROUP_HEADER_WIDTH;

  if (side === 'left') {
    parentStyle.paddingRight = `${oppositePadding}px`;
    parentStyle.paddingLeft = `${STICKY_PADDING}px`;
    parentStyle.flexDirection = 'row';
    childStyle.left = `${groupHeaderWidth + STICKY_PADDING}px`;
  } else if (side === 'right') {
    parentStyle.paddingLeft = `${oppositePadding}px`;
    parentStyle.paddingRight = `${STICKY_PADDING}px`;
    parentStyle.flexDirection = 'row-reverse';
    childStyle.right = `${STICKY_PADDING}px`;
  }

  return (
    <div
      className={styles.itemSlider}
      style={parentStyle}
      data-test-id={'itemSliderParent'}
    >
      <div
        className={styles.itemSliderChild}
        style={childStyle}
        data-test-id={'itemSliderChild'}
      >
        {children}
      </div>
    </div>
  );
};
