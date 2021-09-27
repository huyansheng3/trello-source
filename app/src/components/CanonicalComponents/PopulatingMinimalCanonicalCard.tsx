import { getMilliseconds, decayingInterval } from '@trello/time';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import { loadCanonicalCard } from 'app/gamma/src/modules/loaders/load-card';
import { State } from 'app/gamma/src/modules/types';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBoardById } from 'app/gamma/src/selectors/boards';
import { getCardById } from 'app/gamma/src/selectors/cards';
import { getListById } from 'app/gamma/src/selectors/lists';
import {
  BoardBackgroundModel,
  BoardModel,
  CardModel,
  ListModel,
} from 'app/gamma/src/types/models';
import { MinimalCanonicalCard } from './MinimalCanonicalCard';

interface Props {
  background?: BoardBackgroundModel;
  boardName: string;
  boardUrl: string;
  cardName: string;
  cardUrl: string;
  className?: string;
  idBoard: string;
  idCard: string;
  isPolling?: boolean;
  isWide?: boolean;
  listName: string;
  onClickCardLink?: () => void;
  onClickBoardName?: () => void;
}

export const PopulatingMinimalCanonicalCard = ({
  idCard,
  isPolling,
  background,
  boardName,
  boardUrl,
  cardName,
  cardUrl,
  isWide,
  listName,
  className,
  onClickCardLink,
  onClickBoardName,
}: Props) => {
  const cancelInterval = useRef<() => void>();
  const dispatch = useDispatch();
  const loadCardByID = (id: string) => dispatch(loadCanonicalCard(id));
  const { card, board, list } = useSelector((state: State) => {
    const card = getCardById(state, idCard);
    let board;
    let list;

    if (card && card.idBoard) {
      board = getBoardById(state, card.idBoard);
    }

    if (card && card.idList) {
      list = getListById(state, card.idList);
    }

    return { card, board, list };
  });

  useEffect(() => {
    if (!card || !board) {
      loadCardByID(idCard);
    }

    if (isPolling) {
      cancelInterval.current = decayingInterval(() => loadCardByID(idCard), {
        resetAfterMouseMove: true,
        intervals: [
          {
            iterations: 2,
            timeout: getMilliseconds({ seconds: 10 }),
          },
        ],
      });
    }

    return () => {
      if (cancelInterval.current) {
        cancelInterval.current();
      }
    };
    // Should only run on mount and unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBoardBackgroundData = (background?: BoardBackgroundModel) => {
    let boardBgColor;
    let boardBgBottomColor;
    let boardBgBrightness;
    let boardBgImage;

    if (background) {
      const preview = smallestPreviewBiggerThan(
        background && background.scaled,
        250,
        130,
      );

      boardBgColor = background.color || undefined;
      boardBgBottomColor = background.bottomColor || undefined;
      boardBgBrightness = background.brightness || undefined;
      boardBgImage = preview ? preview.url : background.url || undefined;
    }

    return {
      boardBgColor,
      boardBgBottomColor,
      boardBgBrightness,
      boardBgImage,
    };
  };

  const extractMinimalProps = ({
    board,
    card,
    list,
  }: {
    board?: BoardModel;
    card?: CardModel;
    list?: ListModel;
  }) => {
    const badges = card ? card.badges : null;

    return {
      ...getBoardBackgroundData((board && board.background) || background),
      boardName: (board && board.name) || boardName,
      boardUrl: (board && board.url) || boardUrl,
      cardDue: (badges && badges.due) || (card && card.due),
      cardStart: (badges && badges.start) || (card && card.start),
      cardDueComplete:
        (badges && badges.dueComplete) || (card && card.dueComplete),
      cardIsTemplate: card && card.isTemplate,
      cardRole: card?.cardRole,
      cardName: (card && card.name) || cardName,
      cardUrl: (card && card.url) || cardUrl,
      isWide: isWide,
      listName: (card && list && list.name) || listName,
    };
  };

  return (
    <MinimalCanonicalCard
      {...extractMinimalProps({ board, card, list })}
      className={className}
      onClickCardLink={onClickCardLink}
      onClickBoardName={onClickBoardName}
    />
  );
};
