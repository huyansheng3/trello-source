import React from 'react';
const StarredBoardSvg = require('resources/images/starred-boards-menu/starred-board.svg');
import { forTemplate } from '@trello/i18n';
import styles from './EmptyState.less';

const format = forTemplate('starred_boards_menu');

interface EmptyStateProps {}

export const EmptyState: React.FC<EmptyStateProps> = () => {
  return (
    <div>
      <img
        src={StarredBoardSvg}
        alt={format('starred-board-alt')}
        className={styles.illustration}
      />
      <p className={styles.text}>{format('star-important-boards')}</p>
    </div>
  );
};
