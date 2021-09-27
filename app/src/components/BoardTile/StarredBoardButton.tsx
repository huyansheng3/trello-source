import React, { useCallback } from 'react';
import { StarIcon } from '@trello/nachos/icons/star';
import { BoardButton } from './BoardButton';
import { forTemplate } from '@trello/i18n';
import { useAddBoardStarMutation } from './AddBoardStarMutation.generated';
import { useRemoveBoardStarMutation } from './RemoveBoardStarMutation.generated';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';

const format = forTemplate('board_item');

interface StarredBoardButtonProps {
  readonly idBoard: string;
  readonly memberId: string;
  readonly maxBoardStarPosition: number;
  readonly boardStarId?: string;
  readonly onClick?: () => void;
}

const sendAnalyticsError = (idBoard: string, error: Error) => {
  Analytics.sendOperationalEvent({
    action: 'errored',
    actionSubject: 'viewsSwitcherCalloutCache',
    source: 'boardsMenuInlineDialog',
    containers: formatContainers({ idBoard }),
    attributes: {
      message: error?.message,
      name: error?.name,
    },
  });
};

export const StarredBoardButton: React.FunctionComponent<StarredBoardButtonProps> = ({
  idBoard,
  memberId,
  maxBoardStarPosition,
  boardStarId,
  onClick,
}) => {
  const [removeBoardStar] = useRemoveBoardStarMutation();
  const [addBoardStar] = useAddBoardStarMutation();

  const clickHandler = useCallback(async () => {
    try {
      if (boardStarId) {
        await removeBoardStar({
          variables: {
            memberId,
            boardStarId,
          },
        });
      } else {
        await addBoardStar({
          variables: {
            memberId,
            boardId: idBoard,
            pos: 1 + maxBoardStarPosition,
          },
        });
      }
      if (onClick) {
        onClick();
      }
    } catch (error) {
      sendAnalyticsError(idBoard, error);
    }
  }, [
    boardStarId,
    memberId,
    idBoard,
    removeBoardStar,
    addBoardStar,
    maxBoardStarPosition,
    onClick,
  ]);

  const onClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      clickHandler();
    },
    [clickHandler],
  );
  const onKeyDownHandler = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        clickHandler();
      }
    },
    [clickHandler],
  );

  return (
    <BoardButton
      icon={
        <StarIcon
          size="small"
          label={format('star-icon')}
          color={boardStarId ? 'yellow' : undefined}
        />
      }
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
      tabIndex={0} // for a11y
      title={format(boardStarId ? 'click-to-unstar' : 'click-to-star')}
    />
  );
};
