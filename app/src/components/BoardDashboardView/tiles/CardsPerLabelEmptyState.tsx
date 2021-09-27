import React from 'react';
import { forTemplate } from '@trello/i18n';
import styles from './CardsPerLabelEmptyState.less';
const format = forTemplate('board_report');

interface CarsdPerLabelEmptyStateProps {
  navigateToBoardView(): void;
}

export const CardsPerLabelEmptyState = ({
  navigateToBoardView,
}: CarsdPerLabelEmptyStateProps) => {
  return (
    <div className={styles.cardsPerLabelEmptyState}>
      <img
        src={require('resources/images/stickers/taco-alert@2x.png')}
        alt=""
      />
      <p>{format('this-board-doesnt-have-any-cards-with-labels-yet')}</p>
      <a href="#" onClick={navigateToBoardView}>
        {format('add-one-now')}
      </a>
    </div>
  );
};
