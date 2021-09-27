import React from 'react';
import { forTemplate } from '@trello/i18n';
import styles from './TileErrorState.less';

const format = forTemplate('board_report');

export const TileErrorState = () => {
  return (
    <div className={styles.error}>
      <img
        src={require('resources/images/stickers/taco-proto@2x.png')}
        alt=""
      />
      <p>{format('we-couldnt-load')}</p>
      <p>{format('refresh-the-page')}</p>
    </div>
  );
};
