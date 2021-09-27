/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useState, Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { forNamespace, forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { AddIcon } from '@trello/nachos/icons/add';
import { useDispatch } from 'react-redux';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';
import styles from './BoardsList.less';
import { CollapsibleList } from './CollapsibleList';
import { BoardsListItem, BoardsListItemProps } from './BoardsListItem';
import { Analytics } from '@trello/atlassian-analytics';
import { BoardsListEmptyState } from './BoardsListEmptyState';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { WorkspaceMemberQuery } from './WorkspaceMemberQuery.generated';
import { TrelloStorage } from '@trello/storage';
import { memberId } from '@trello/session-cookie';
import { DragAndDropStarredBoardsList } from './DragAndDropStarredBoardsList';
import { UserRelationshipToWorkspace } from './useCurrentWorkspace';

const format = forTemplate('workspace_navigation');
const formatViewTitle = forNamespace('view title');
export const INITIAL_BOARDS_TO_SHOW = 20;
export const SHOW_COLLAPSED_BOARDS_STORAGE_KEY = `sidebar_boardslist_full_show_collapsed_${memberId}`;

type BoardStar = NonNullable<
  WorkspaceMemberQuery['member']
>['boardStars'][number];

export interface GetOrderedBoardsProps {
  boards: BoardsListItemProps[];
  boardStars: BoardStar[];
  showAllBoards: boolean;
}

// we want to order boards in the sidebar as follows:
// 1. All starred boards, sorted by position, then
// 2. All unstarred boards, sorted alphabetically
// BUT if there are more boards than the INITIAL_BOARDS_TO_SHOW limit
// Then we want to show:
// 1. All starred boards, sorted by position, then
// 2. Most recent unstarred boards, sorted alphabetically
// up to limit
export function getOrderedBoards({
  boards,
  boardStars,
  showAllBoards,
}: GetOrderedBoardsProps): BoardsListItemProps[] {
  const starredBoardIds = boardStars.map((star) => star.idBoard);
  const starredBoards = boards.filter((b) => starredBoardIds.includes(b.id));
  const unstarredBoards = boards.filter((b) => !starredBoardIds.includes(b.id));
  const boardsExceedLimit = boards.length > INITIAL_BOARDS_TO_SHOW;

  if (!boardsExceedLimit || showAllBoards) {
    // show all unstarred boards sorted alphabetically
    return [...unstarredBoards.sort((a, b) => a.name.localeCompare(b.name))];
  }

  // show most recent unstarred boards (up to INITIAL_BOARDS_TO_SHOW limit)
  const numberOfUnstarredBoardsToDisplay = Math.max(
    INITIAL_BOARDS_TO_SHOW - starredBoards.length,
    0,
  );

  return [
    ...unstarredBoards
      .sort(compareDateLastViewDescending)
      .slice(0, numberOfUnstarredBoardsToDisplay)
      .sort((a, b) => a.name.localeCompare(b.name)),
  ].slice(0, INITIAL_BOARDS_TO_SHOW);

  interface DateLastViewItem {
    dateLastView?: string;
  }
  function compareDateLastViewDescending(
    board1: DateLastViewItem,
    board2: DateLastViewItem,
  ): number {
    return (
      new Date(board2?.dateLastView!).getTime() -
      new Date(board1?.dateLastView!).getTime()
    );
  }
}

interface BoardsListProps {
  boards: BoardsListItemProps[];
  boardStars: BoardStar[];
  orgId?: string;
  userRelationshipToWorkspace: UserRelationshipToWorkspace;
}

export const BoardsList: React.FunctionComponent<BoardsListProps> = ({
  boards,
  boardStars,
  orgId,
  userRelationshipToWorkspace,
}) => {
  const dispatch = useDispatch();
  const CreateBoardOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-overlay" */ 'app/src/components/CreateBoardOverlay'
      ),
    {
      preload: false,
      namedImport: 'CreateBoardOverlay',
    },
  );

  const [showCreateBoardOverlay, setShowCreateBoardOverlay] = useState(false);

  const closeCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(false);
  }, [setShowCreateBoardOverlay]);

  const openCreateBoardOverlay = useCallback(() => {
    dispatch(preloadCreateBoardData());
    setShowCreateBoardOverlay(true);
  }, [setShowCreateBoardOverlay, dispatch]);

  const [showCollapsedBoards, setShowCollapsedBoards] = useState(
    TrelloStorage.get(SHOW_COLLAPSED_BOARDS_STORAGE_KEY) === 'true',
  );

  const handleAddClick = useCallback(() => {
    openCreateBoardOverlay();
    Analytics.sendClickedButtonEvent({
      buttonName: 'createBoardButton',
      source: 'currentWorkspaceNavigationDrawer',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  }, [openCreateBoardOverlay, orgId]);

  const handleToggleClick = useCallback(
    (expanded: boolean) => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'expandCollapseBoardsListButton',
        source: 'currentWorkspaceNavigationDrawer',
        containers: {
          organization: {
            id: orgId,
          },
        },
        attributes: {
          expanded: expanded,
        },
      });
    },
    [orgId],
  );

  const toggleShowCollapsedBoards = useCallback(() => {
    const updatedShowCollapsedBoards = !showCollapsedBoards;
    setShowCollapsedBoards(updatedShowCollapsedBoards);
    TrelloStorage.set(
      SHOW_COLLAPSED_BOARDS_STORAGE_KEY,
      JSON.stringify(updatedShowCollapsedBoards),
    );
    Analytics.sendClickedButtonEvent({
      buttonName: 'showHideCollapsedBoardsButton',
      source: 'currentWorkspaceNavigationDrawer',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        showCollapsedBoards: updatedShowCollapsedBoards,
      },
    });
  }, [showCollapsedBoards, orgId]);

  const excessBoardsCount = Math.max(boards.length - INITIAL_BOARDS_TO_SHOW, 0);

  const boardsToRender = getOrderedBoards({
    boards,
    boardStars,
    showAllBoards: showCollapsedBoards,
  });

  const title = format('your-boards');
  const headerAriaLabel = `${format('title-with-count-items', {
    title: title,
    count: boards.length,
  })}`;

  const showAddBoardButton =
    userRelationshipToWorkspace !== 'GUEST' &&
    userRelationshipToWorkspace !== 'NONE';

  return (
    <>
      <CollapsibleList
        controls={
          showAddBoardButton && (
            <Button
              iconBefore={<AddIcon size="small" color="quiet" />}
              onClick={handleAddClick}
              aria-label={formatViewTitle('add board')}
              className={styles.iconButton}
            />
          )
        }
        title={title}
        onClick={handleToggleClick}
        itemCount={boards.length}
        ariaLabel={headerAriaLabel}
      >
        {boards.length === 0 ? (
          <BoardsListEmptyState orgId={orgId} />
        ) : (
          <>
            <DragAndDropStarredBoardsList
              boards={boards}
              boardStars={boardStars}
              orgId={orgId}
            />
            {boardsToRender.map((board) => (
              <BoardsListItem
                key={board.id}
                isTemplate={board.isTemplate}
                id={board.id}
                name={board.name}
                href={board.href}
                permissionLevel={board.permissionLevel}
                dateLastActivity={board.dateLastActivity}
                dateLastView={board.dateLastView}
                backgroundColor={board.backgroundColor}
                backgroundUrl={board.backgroundUrl}
                orgId={orgId}
                starred={board.starred}
              />
            ))}
            {excessBoardsCount > 0 && (
              <Button
                onClick={toggleShowCollapsedBoards}
                appearance="subtle-link"
                size="default"
                type="button"
                testId={WorkspaceNavigationTestIds.BoardsListShowMoreButton}
              >
                {showCollapsedBoards
                  ? format('show-less')
                  : format('show-more', {
                      count: excessBoardsCount,
                    })}
              </Button>
            )}
          </>
        )}
      </CollapsibleList>
      {showCreateBoardOverlay && (
        <Suspense fallback={null}>
          <CreateBoardOverlay
            onClose={closeCreateBoardOverlay}
            preSelectedTeamId={orgId}
          />
        </Suspense>
      )}
    </>
  );
};
