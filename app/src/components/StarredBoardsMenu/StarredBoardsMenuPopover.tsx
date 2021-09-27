import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';
import React, { useEffect } from 'react';
import { LoadingSpinner } from 'app/src/components/LoadingSpinner';
import { EmptyState } from './EmptyState';
import { Analytics } from '@trello/atlassian-analytics';
import { boardUrlFromShortLink } from '@trello/urls';
import { DragAndDropStarredBoardsList } from './DragAndDropStarredBoardsList';
import { RetryScreen } from 'app/src/components/RetryScreen';
import { forTemplate } from '@trello/i18n';
import {
  useStarredBoards,
  MissingBoardStarsDataError,
  MissingStarredBoardsDataError,
} from './useStarredBoards';

const format = forTemplate('starred_boards_menu');

interface StarredBoardsMenuPopoverProps {}

export const StarredBoardsMenuPopover: React.FC<StarredBoardsMenuPopoverProps> = () => {
  const { error, boards, loading, refetch } = useStarredBoards();

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'starredBoardsMenuInlineDialog',
    });
  }, []);

  useEffect(() => {
    if (error) {
      if (
        error instanceof MissingBoardStarsDataError ||
        error instanceof MissingStarredBoardsDataError
      ) {
        /*
          This is an instance of the odd, known issue where our Apollo/GraphQL
          implementation returns undefined for data, error, and loading.
          Generally this happens when the user navigates to a different
          page, simply report as non-error operational event.
        */
        Analytics.sendOperationalEvent({
          action: 'attempted',
          actionSubject: 'fetchStarredBoards',
          source: 'starredBoardsMenuInlineDialog',
          attributes: {
            name: error.name,
            message: error.message,
          },
        });
      } else {
        sendErrorEvent(error, {
          tags: {
            feature: Feature.StarredBoardsMenuButton,
            ownershipArea: 'trello-teamplates',
          },
        });
      }
    }
  }, [error]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !boards) {
    return (
      <RetryScreen onRetryClick={refetch} buttonText={format('try-again')}>
        <p>{format('there-was-an-error')}</p>
      </RetryScreen>
    );
  }

  if (boards.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <DragAndDropStarredBoardsList
        boards={boards.map((board) => ({
          ...board,
          url: boardUrlFromShortLink(board.shortLink, board.name),
          prefs: {
            background: board.prefs?.background || undefined,
            backgroundTile: board.prefs?.backgroundTile || undefined,
            backgroundImage: board.prefs?.backgroundImage || undefined,
            backgroundColor: board.prefs?.backgroundColor || undefined,
            backgroundImageScaled:
              board.prefs?.backgroundImageScaled || undefined,
            isTemplate: board.prefs?.isTemplate || undefined,
          },
          organization: {
            displayName: board.organization?.displayName || undefined,
          },
          dateLastView: board.dateLastView
            ? new Date(board.dateLastView)
            : undefined,
          dateLastActivity: board.dateLastActivity
            ? new Date(board.dateLastActivity)
            : undefined,
        }))}
      />
    </>
  );
};
