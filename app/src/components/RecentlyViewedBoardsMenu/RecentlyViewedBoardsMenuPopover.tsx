import React, { useEffect, useCallback } from 'react';
import { RecentlyViewedBoardsMenuTestIds } from '@trello/test-ids';
import { LoadingSpinner } from 'app/src/components/LoadingSpinner';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { Analytics } from '@trello/atlassian-analytics';
import { RetryScreen } from 'app/src/components/RetryScreen';
import { forTemplate } from '@trello/i18n';
import { EmptyState } from './EmptyState';
import {
  BoardTile,
  BoardTileDropdownWrapper,
} from 'app/src/components/BoardTile';
import { boardUrlFromShortLink } from '@trello/urls';
import {
  useRecentBoards,
  MissingRecentBoardsSlimDataError,
  MissingRecentBoardsDetailDataError,
} from './useRecentBoards';
import styles from './RecentlyViewedBoardsMenuPopover.less';
import { RecentBoardsDetailQuery } from './RecentBoardsDetailQuery.generated';
import { dateComparator } from './dateComparator';

const format = forTemplate('recently_viewed_boards_menu');

const MAX_RECENT_BOARDS = 8;

interface RecentlyViewedBoardsMenuPopoverProps {
  onBoardClick?: () => void;
}

interface BoardStar {
  id: string;
  idBoard: string;
  pos: number;
}

const sortByDateLastViewedAndLimit = ({
  boardStars,
  boards,
}: {
  boardStars: BoardStar[];
  boards: RecentBoardsDetailQuery['boards'];
}) => {
  const idBoardToBoardStarId = new Map(
    boardStars.map((boardStar) => [boardStar.idBoard, boardStar.id]),
  );

  return boards
    .filter((board) => !board.closed && !!board.dateLastView)
    .sort(dateComparator)
    .slice(0, MAX_RECENT_BOARDS)
    .map((board) => ({
      ...board,
      boardStarId: idBoardToBoardStarId.get(board.id),
    }));
};

const findMaxBoardStarPosition = (boardStars: BoardStar[]) => {
  const posArr = boardStars.map((boardStars) => boardStars.pos);
  if (!posArr.length) return 0;
  return Math.max(...posArr);
};

export const RecentlyViewedBoardsMenuPopover = ({
  onBoardClick,
}: RecentlyViewedBoardsMenuPopoverProps) => {
  const { data, loading, error, refetch } = useRecentBoards();

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'recentlyViewedBoardsMenuInlineDialog',
    });
  }, []);

  useEffect(() => {
    if (error) {
      if (
        error instanceof MissingRecentBoardsSlimDataError ||
        error instanceof MissingRecentBoardsDetailDataError
      ) {
        /*
          This is an instance of the odd, known issue where our Apollo/GraphQL
          implementation returns undefined for data, error, and loading.
          Generally this happens when the user navigates to a different
          page, simply report as non-error operational event.
        */
        Analytics.sendOperationalEvent({
          action: 'attempted',
          actionSubject: 'fetchRecentBoards',
          source: 'recentlyViewedBoardsMenuInlineDialog',
          attributes: {
            name: error.name,
            message: error.message,
          },
        });
      } else {
        sendErrorEvent(error, {
          tags: {
            ownershipArea: 'trello-teamplates',
            feature: Feature.RecentlyViewedBoardsMenu,
          },
        });
      }
    }
  }, [error]);

  const handleStarClick = useCallback(
    (boardId?: string, boardStarId?: string) => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'boardStarButton',
        source: 'recentlyViewedBoardsMenuInlineDialog',
        attributes: {
          starred: !boardStarId,
        },
        containers: {
          board: {
            id: boardId,
          },
        },
      });
    },
    [],
  );

  const handleBoardClick = useCallback(
    (boardId?: string) => {
      if (onBoardClick) {
        onBoardClick();
      }
      Analytics.sendClickedLinkEvent({
        linkName: 'recentBoardsLink',
        source: 'recentlyViewedBoardsMenuInlineDialog',
        containers: {
          board: {
            id: boardId,
          },
        },
      });
    },
    [onBoardClick],
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.boards) {
    return (
      <RetryScreen onRetryClick={refetch} buttonText={format('try-again')}>
        <p>{format('error-loading-recent-boards')}</p>
      </RetryScreen>
    );
  }

  const recentlyViewedBoards = sortByDateLastViewedAndLimit({
    boardStars: data.boardStars,
    boards: data.boards,
  });

  if (!recentlyViewedBoards.length) {
    return <EmptyState />;
  }

  const maxBoardStarPosition = findMaxBoardStarPosition(data.boardStars);

  return (
    <BoardTileDropdownWrapper
      dataTestId={
        RecentlyViewedBoardsMenuTestIds.RecentlyViewedBoardsMenuPopOver
      }
    >
      {recentlyViewedBoards.map(
        ({
          id,
          name,
          prefs, // starred,
          shortLink,
          organization,
          dateLastView,
          dateLastActivity,
          boardStarId,
        }) => (
          <li key={id} className={styles.listItem}>
            <BoardTile
              id={id}
              name={name}
              maxBoardStarPosition={maxBoardStarPosition}
              dateLastView={dateLastView ? new Date(dateLastView) : undefined}
              dateLastActivity={
                dateLastActivity ? new Date(dateLastActivity) : undefined
              }
              background={prefs?.background}
              backgroundTile={prefs?.backgroundTile}
              backgroundImage={prefs?.backgroundImage || undefined}
              backgroundColor={prefs?.backgroundColor || undefined}
              backgroundImageScaled={prefs?.backgroundImageScaled || undefined}
              url={boardUrlFromShortLink(shortLink, name)}
              organizationDisplayName={organization?.displayName}
              isTemplate={prefs?.isTemplate}
              boardStarId={boardStarId}
              // eslint-disable-next-line react/jsx-no-bind
              onStarClick={() => handleStarClick(id, boardStarId)}
              // eslint-disable-next-line react/jsx-no-bind
              onBoardClick={() => handleBoardClick(id)}
            />
          </li>
        ),
      )}
    </BoardTileDropdownWrapper>
  );
};
