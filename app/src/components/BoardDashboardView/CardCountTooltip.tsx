import React from 'react';
import styles from './CardCountTooltip.less';

interface CardCountTooltipProps {
  label: string;
  count: number;
}

export const CardCountTooltip = ({ label, count }: CardCountTooltipProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <p className={styles.count}>{count} cards</p>
    </div>
  );
};
