import React from 'react';

import { PopulatingMinimalCanonicalCard } from 'app/src/components/CanonicalComponents';
import { ActionDataModel } from 'app/gamma/src/types/models';

import styles from './NotificationGroupCard.less';
import { Analytics } from '@trello/atlassian-analytics';

interface NotificationGroupCardProps extends ActionDataModel {}

export const NotificationGroupCard: React.FunctionComponent<NotificationGroupCardProps> = ({
  board,
  card,
}) => {
  const boardName = (board && board.name) || '';
  const boardURL = (board && board.url) || '';
  const idBoard = (board && board.id) || '';

  const cardName = (card && card.name) || '';
  const cardURL = (card && card.url) || '';
  const idCard = (card && card.id) || '';
  const idBoardFromCard = (card && card.idBoard) || '';
  const idListFromCard = (card && card.idList) || '';

  const listName = (card && card.list && card.list.name) || '';

  const onClickCardLink = () =>
    Analytics.sendClickedLinkEvent({
      linkName: 'notificationCardLink',
      source: 'notificationsInlineDialog',
      containers: {
        card: {
          id: idCard,
        },
        board: {
          id: idBoardFromCard,
        },
        list: {
          id: idListFromCard,
        },
      },
    });

  const onClickBoardName = () =>
    Analytics.sendClickedLinkEvent({
      linkName: 'notificationBoardLink',
      source: 'notificationsInlineDialog',
      containers: {
        card: {
          id: idCard,
        },
        board: {
          id: idBoardFromCard,
        },
        list: {
          id: idListFromCard,
        },
      },
    });

  return (
    <PopulatingMinimalCanonicalCard
      className={styles.canonicalCard}
      background={board && board.background}
      boardName={boardName}
      boardUrl={boardURL}
      cardName={cardName}
      cardUrl={cardURL}
      idBoard={idBoard}
      idCard={idCard}
      isPolling
      isWide
      listName={listName}
      // eslint-disable-next-line react/jsx-no-bind
      onClickCardLink={onClickCardLink}
      // eslint-disable-next-line react/jsx-no-bind
      onClickBoardName={onClickBoardName}
    />
  );
};
