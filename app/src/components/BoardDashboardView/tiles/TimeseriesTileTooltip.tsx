import React from 'react';
import moment from 'moment';
import { forTemplate } from '@trello/i18n';
import { TooltipPayload } from '../charts/TimeseriesChart';
import styles from './TimeseriesTileTooltip.less';

const format = forTemplate('board_report');

export const TimeseriesTileTooltip = ({
  payload,
}: {
  payload: TooltipPayload;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.date}>
        {moment(payload.date).utc().format('MMMM Do, YYYY')}
      </div>
      {payload.dataPoints.map((dp) => {
        return (
          <div key={dp.series.key} className={styles.item}>
            <span className={styles.label}>{dp.name}</span>
            <span className={styles.count}>
              {format('num-cards', {
                numCards: dp.value,
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
};
