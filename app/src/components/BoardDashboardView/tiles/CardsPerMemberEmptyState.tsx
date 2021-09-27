import React from 'react';
import { forTemplate } from '@trello/i18n';
import styles from './CardsPerMemberEmptyState.less';

const format = forTemplate('board_report');

interface CardsPerMemberEmptyStateProps {
  navigateToBoardView(): void;
}

export const CardsPerMemberEmptyState = ({
  navigateToBoardView,
}: CardsPerMemberEmptyStateProps) => {
  return (
    <div className={styles.cardsPerMemberCardsPerMemberEmptyState}>
      <img
        src={require('resources/images/stickers/taco-confused@2x.png')}
        alt=""
      />
      <p>{format('this-board-doesnt-have-any-cards-assigned-to-members')}</p>
      <a href="#" onClick={navigateToBoardView}>
        {format('add-one-now')}
      </a>
    </div>
  );
};
