import React from 'react';
import { forTemplate } from '@trello/i18n';
import styles from './CardsPerListEmptyState.less';

const format = forTemplate('board_report');

interface CardsPerListEmptyStateProps {
  navigateToBoardView(): void;
}

export const CardsPerListEmptyState = ({
  navigateToBoardView,
}: CardsPerListEmptyStateProps) => {
  return (
    <div className={styles.cardsPerListEmptyState}>
      <img
        src={require('resources/images/stickers/taco-sleeping@2x.png')}
        alt=""
      />
      <p>{format('this-board-doesnt-have-any-lists-yet')}</p>
      <a href="#" onClick={navigateToBoardView}>
        {format('add-one-now')}
      </a>
    </div>
  );
};
