import React from 'react';
import { forTemplate } from '@trello/i18n';
import styles from './CardsPerDueDateEmptyState.less';

const format = forTemplate('board_report');

interface CardsPerDueDateEmptyStateProps {
  navigateToBoardView(): void;
}

export const CardsPerDueDateEmptyState = ({
  navigateToBoardView,
}: CardsPerDueDateEmptyStateProps) => {
  return (
    <div className={styles.cardsPerDueDateCardsPerDueDateEmptyState}>
      <img
        src={require('resources/images/stickers/taco-embarrassed@2x.png')}
        alt=""
      />
      <p>{format('this-board-doesnt-have-any-cards-with-due-dates-yet')}</p>
      <a href="#" onClick={navigateToBoardView}>
        {format('add-one-now')}
      </a>
    </div>
  );
};
