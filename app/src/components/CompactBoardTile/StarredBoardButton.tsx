import React, { useCallback } from 'react';
import { StarIcon } from '@trello/nachos/icons/star';
import { useDispatch, useSelector } from 'react-redux';

import { toggleBoardStar } from 'app/gamma/src/modules/state/models/board-stars';
import { State } from 'app/gamma/src/modules/types';
import { isBoardStarred } from 'app/gamma/src/selectors/boards';

import { BoardButton } from './BoardButton';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_list_item');

interface StarredBoardButtonProps {
  readonly idBoard: string;
}

export const StarredBoardButton = ({ idBoard }: StarredBoardButtonProps) => {
  const dispatch = useDispatch();
  const isStarred = useSelector((state: State) => {
    return isBoardStarred(state, idBoard);
  });

  const onClickHandler: React.MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      // The boards menu container registers document-level click handlers, so we
      // need to mute the native event too to make sure this doesn't bubble there.
      e.nativeEvent.stopImmediatePropagation();
      dispatch(toggleBoardStar({ idBoard }));
    },
    [dispatch, idBoard],
  );

  const onKeyDownHandler: React.KeyboardEventHandler = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleBoardStar({ idBoard }));
      }
    },
    [dispatch, idBoard],
  );

  return (
    <BoardButton
      icon={<StarIcon size="small" color={isStarred ? 'yellow' : undefined} />}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
      tabIndex={0} // for a11y
      title={format(
        'click-to-star-this-board-it-will-show-up-at-top-of-your-boards-list',
      )}
    />
  );
};
