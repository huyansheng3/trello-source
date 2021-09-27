import React from 'react';
import styles from './MaxDataPointsTooltip.less';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('board_report');

interface MaxDataPointsTooltipProps {
  count: number;
  total: number;
  text: string;
}
export const MaxDataPointsTooltip = ({
  count,
  total,
  text,
}: MaxDataPointsTooltipProps) => {
  return (
    <>
      <p className={styles.label}>
        {format('displaying-out-of', {
          count: <strong key="count">{count}</strong>,
          total: <strong key="total">{total}</strong>,
        })}
      </p>
      <p className={styles.count}>{text}</p>
    </>
  );
};
