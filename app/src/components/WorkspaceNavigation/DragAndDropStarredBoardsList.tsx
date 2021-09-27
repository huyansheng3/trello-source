import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from '@trello/react-dom-wrapper';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { BoardsListItem, BoardsListItemProps } from './BoardsListItem';
import { useUpdateWorkspaceBoardStarMutation } from './UpdateWorkspaceBoardStarMutation.generated';
import { calculatePos } from '@trello/arrays';
import { memberId } from '@trello/session-cookie';
import isEqual from 'react-fast-compare';
import styles from './DragAndDropStarredBoardsList.less';

interface BoardStar {
  id: string;
  idBoard: string;
  pos: number;
}

interface DragAndDropStarredBoardsListProps {
  boards: BoardsListItemProps[];
  boardStars: BoardStar[];
  orgId: string | undefined;
}

export interface GetOrderedStarredBoardsProps {
  boards: BoardsListItemProps[];
  boardStars: BoardStar[];
}

export function getOrderedStarredBoards({
  boards,
  boardStars,
}: GetOrderedStarredBoardsProps): BoardsListItemProps[] {
  // sort starred boards by position
  const starredBoardIds = boardStars
    .slice()
    .sort((a, b) => a.pos - b.pos)
    .map((star) => star.idBoard);

  const starredBoards = boards
    .filter((b) => starredBoardIds.includes(b.id))
    .map((board) => ({ ...board, starred: true }))
    .sort(
      (a, b) => starredBoardIds.indexOf(a.id) - starredBoardIds.indexOf(b.id),
    );

  return starredBoards;
}

export const DragAndDropStarredBoardsList: React.FunctionComponent<DragAndDropStarredBoardsListProps> = ({
  boards,
  boardStars: starredBoardsFromCache,
  orgId,
}) => {
  const [portal, setPortal] = useState<Element | null>(null);
  const [
    previousStarredBoardsFromCache,
    setPreviousStarredBoardsFromCache,
  ] = useState(starredBoardsFromCache);
  const [starredBoards, setStarredBoards] = useState(starredBoardsFromCache);

  const starredBoardsToRender = getOrderedStarredBoards({
    boards,
    boardStars: starredBoards,
  });

  const [updateBoardStar] = useUpdateWorkspaceBoardStarMutation();

  useEffect(() => {
    const cacheUpdate = !isEqual(
      starredBoardsFromCache,
      previousStarredBoardsFromCache,
    );

    if (cacheUpdate) {
      setPreviousStarredBoardsFromCache(starredBoardsFromCache);
      setStarredBoards(starredBoardsFromCache);
    }
  }, [starredBoardsFromCache, previousStarredBoardsFromCache]);

  const sortedStarredBoards = useMemo(() => {
    return starredBoards.slice().sort((a, b) => a.pos - b.pos);
  }, [starredBoards]);

  useEffect(() => {
    // use app-wide react-beautiful-dnd portal DOM element
    const portalEl = document.getElementById('dnd-portal');

    if (portalEl) {
      setPortal(portalEl);
    } else {
      sendErrorEvent(
        new Error('No portal for DragAndDropStarredBoardsList in left nav'),
        {
          tags: {
            feature: Feature.WorkspaceNavigation,
            ownershipArea: 'trello-teamplates',
          },
        },
      );
    }
  }, [setPortal]);

  // we disable drag and drop if there's no portal
  const disableDragAndDrop = !portal;

  interface UpdateBoardStarPosition {
    idBoard: string;
    position: number;
  }

  const updateBoardStarPosition = useCallback(
    async ({ idBoard, position }: UpdateBoardStarPosition) => {
      const board = sortedStarredBoards.find(
        (board) => board.idBoard === idBoard,
      );

      if (board) {
        try {
          // Get the board in the destination position in the workspace-specific
          // starred boards list. Then find the index of this board in the full
          // starred boards list (n workspaces).  This becomes the new destination
          // so `calculatePos` can correctly determine the new position.
          const boardInDestinationPosition = starredBoardsToRender[position];
          const newDestinationPosition = sortedStarredBoards.findIndex(
            (board) => board.idBoard === boardInDestinationPosition.id,
          );
          // calculatePos requires the boards to be passed in sorted order
          const newPos = calculatePos(
            newDestinationPosition,
            sortedStarredBoards,
            board,
          );
          const updatedStarredBoards = sortedStarredBoards.map((board) => {
            const cloned = { ...board };
            if (cloned.idBoard === idBoard) {
              cloned.pos = newPos;
            }
            return cloned;
          });

          // update board order locally
          setStarredBoards(updatedStarredBoards);

          // update board order on server
          await updateBoardStar({
            variables: {
              memberId: memberId || '',
              boardStarId: board.id,
              pos: newPos,
            },
          });
        } catch (err) {
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-teamplates',
              feature: Feature.WorkspaceNavigation,
            },
          });

          // there was an error, update board order to persistent version
          setStarredBoards(starredBoardsFromCache);
        }
      }
    },

    [
      updateBoardStar,
      sortedStarredBoards,
      setStarredBoards,
      starredBoardsFromCache,
      starredBoardsToRender,
    ],
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, source, destination } = result;
      if (
        // they didn't drop it on a droppable
        !destination ||
        // they dropped it in the same position
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      ) {
        return;
      }

      updateBoardStarPosition({
        idBoard: draggableId,
        position: destination.index,
      });
    },
    [updateBoardStarPosition],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="starred-boards-left-nav"
        isDropDisabled={disableDragAndDrop}
      >
        {({ droppableProps, innerRef, placeholder }) => (
          <div {...droppableProps} ref={innerRef}>
            {starredBoardsToRender.map((board, index) => (
              <Draggable
                key={board.id}
                draggableId={board.id}
                index={index}
                isDragDisabled={disableDragAndDrop}
              >
                {(
                  { innerRef, draggableProps, dragHandleProps },
                  { isDragging },
                ) => {
                  const child = (
                    <div
                      key={board.id}
                      ref={innerRef}
                      {...draggableProps}
                      {...dragHandleProps}
                      className={styles.listItem}
                    >
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
                    </div>
                  );

                  if (!isDragging || !portal) {
                    return child;
                  } else {
                    // If dragging, put the item in a portal. We need to
                    // create a portal here because this list is rendered
                    // in a parent element that uses 'transform'.
                    // For more detail: https://github.com/atlassian/react-beautiful-dnd/issues/128#issuecomment-333410772
                    return ReactDOM.createPortal(child, portal);
                  }
                }}
              </Draggable>
            ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
