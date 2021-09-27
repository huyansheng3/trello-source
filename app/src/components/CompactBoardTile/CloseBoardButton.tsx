import { removeRecentBoardByID } from 'app/gamma/src/modules/state/ui/boards-menu';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { CloseIcon } from '@trello/nachos/icons/close';
import styles from './CloseBoardButton.less';
import { BoardButton } from './BoardButton';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_list_item');

interface CloseBoardButtonProps {
  readonly idBoard: string;
}

export const CloseBoardButton = ({ idBoard }: CloseBoardButtonProps) => {
  const dispatch = useDispatch();
  const onClickHandler: React.MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      // The boards menu container registers document-level click handlers, so we
      // need to mute the native event too to make sure this doesn't bubble there.
      e.nativeEvent.stopImmediatePropagation();
      dispatch(removeRecentBoardByID(idBoard));
    },
    [dispatch, idBoard],
  );
  const onKeyDownHandler: React.KeyboardEventHandler = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        dispatch(removeRecentBoardByID(idBoard));
      }
    },
    [dispatch, idBoard],
  );

  return (
    <BoardButton
      className={styles.closeButton}
      icon={<CloseIcon size="small" />}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
      tabIndex={0} // for a11y
      title={format('click-to-remove-this-board-from-your-recent-boards')}
    />
  );
};
