import React from 'react';
import { TimelineItem } from './types';
import styles from './ItemSideTitle.less';

interface ItemSideTitleProps {
  item: TimelineItem;
  left: number;
}

export const ItemSideTitle: React.FunctionComponent<ItemSideTitleProps> = ({
  item,
  left,
}) => {
  return (
    <div className={styles.itemSideTitle} style={{ left: left }}>
      {item.title}
    </div>
  );
};
