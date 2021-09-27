import styles from './EmptyState.less';
import React from 'react';
import { forTemplate } from '@trello/i18n';

const EmptyRecentlyViewedBoardsSVG = require('resources/images/workspace-navigation/recent-boards-empty.svg');

const format = forTemplate('recently_viewed_boards_menu');

interface EmptyStateProps {}

export const EmptyState: React.FC<EmptyStateProps> = () => {
  return (
    <>
      <img
        className={styles.illustration}
        src={EmptyRecentlyViewedBoardsSVG}
        alt={format('empty-recent-boards-alt')}
      />
      <p className={styles.text}>{format('empty-recent-boards')}</p>
    </>
  );
};
