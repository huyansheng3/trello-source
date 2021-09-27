/* eslint-disable @trello/disallow-filenames */
import React from 'react';
import classNames from 'classnames';
import styles from './CustomLegend.less';

import { LegendProps } from 'recharts';

export const CustomLegend = (props: LegendProps) => {
  const { payload } = props;
  if (!payload) {
    return null;
  }

  return (
    <ul
      className={classNames(
        styles.legend,
        payload.length > 5 ? styles.largeCount : styles.smallCount,
      )}
    >
      {payload.map((p) => {
        return (
          <li key={p.id} className={styles.legendItem}>
            <span
              className={styles.square}
              style={{
                background: p.color,
              }}
            />
            <span>{p.value}</span>
          </li>
        );
      })}
    </ul>
  );
};
