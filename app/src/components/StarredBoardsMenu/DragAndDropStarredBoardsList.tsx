import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { calculatePos } from '@trello/arrays';
import { useUpdateBoardStarMutation } from './UpdateBoardStarMutation.generated';
import { memberId } from '@trello/session-cookie';
import styles from './DragAndDropStarredBoardsList.less';
import {
  BoardTile,
  BoardTileDropdownWrapper,
} from 'app/src/components/BoardTile';
import ReactDOM from '@trello/react-dom-wrapper';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import isEqual from 'react-fast-compare';
import { Analytics } from '@trello/atlassian-analytics';

export const STARRED_BOARDS_MENU_POPOVER_CLASSNAME =
  'starred-boards-menu-popover';

interface BackgroundImageScaledProps {
  readonly width: number;
  readonly height: number;
  readonly url: string;
}
interface Board {
  id: string;
  idBoardStar: string;
  pos: number;
  name: string;
  prefs?: {
    background?: string;
    backgroundTile?: boolean;
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundImageScaled?: BackgroundImageScaledProps[];
    isTemplate?: boolean;
  };
  organization?: {
    displayName?: string;
  };
  dateLastView: Date | undefined;
  dateLastActivity: Date | undefined;
  url: string;
}
interface DragAndDropStarredBoardsListProps {
  boards: Board[];
}

export const DragAndDropStarredBoardsList: React.FC<DragAndDropStarredBoardsListProps> = ({
  boards: boardsFromCache,
}) => {
  const [previousBoardsFromCache, setPreviousBoardsFromCache] = useState(
    boardsFromCache,
  );
  const [boards, setBoards] = useState(boardsFromCache);
  const [portal, setPortal] = useState<Element | null>(null);
  const [updateBoardStar] = useUpdateBoardStarMutation();

  useEffect(() => {
    const cacheUpdate = !isEqual(boardsFromCache, previousBoardsFromCache);
    if (cacheUpdate) {
      setPreviousBoardsFromCache(boardsFromCache);
      setBoards(boardsFromCache);
    }
  }, [boardsFromCache, previousBoardsFromCache]);

  const sortedBoards = useMemo(() => {
    return boards.slice().sort((a, b) => a.pos - b.pos);
  }, [boards]);
  const maxBoardStarPosition = useMemo(() => {
    return Math.max(...boards.map((b) => b.pos));
  }, [boards]);
  useEffect(() => {
    const portalEl = document.getElementsByClassName(
      STARRED_BOARDS_MENU_POPOVER_CLASSNAME,
    )[0];
    if (portalEl) {
      setPortal(portalEl);
    } else {
      sendErrorEvent(new Error('No portal for DragAndDropStarredBoardsList'), {
        tags: {
          feature: Feature.StarredBoardsMenuButton,
          ownershipArea: 'trello-teamplates',
        },
      });
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
      const board = sortedBoards.find((board) => board.id === idBoard);

      if (board) {
        try {
          // calculatePos requires the boards to be passed in sorted order
          const newPos = calculatePos(position, sortedBoards, board);

          const updatedBoards = sortedBoards.map((board) => {
            const cloned = { ...board };
            if (cloned.id === idBoard) {
              cloned.pos = newPos;
            }

            return cloned;
          });
          // update board order locally
          setBoards(updatedBoards);

          // update board order on server
          await updateBoardStar({
            variables: {
              memberId: memberId || '',
              boardStarId: board.idBoardStar,
              pos: newPos,
            },
          });
        } catch (err) {
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-teamplates',
              feature: Feature.StarredBoardsMenuButton,
            },
          });
          // there was an error, update board order to persistent version
          setBoards(boardsFromCache);
        }
      }
    },
    [updateBoardStar, sortedBoards, setBoards, boardsFromCache],
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

  const handleBoardClick = useCallback((boardId?: string) => {
    Analytics.sendClickedLinkEvent({
      linkName: 'starredBoardsLink',
      source: 'starredBoardsMenuInlineDialog',
      containers: {
        board: {
          id: boardId,
        },
      },
    });
  }, []);

  const handleStarClick = useCallback((boardId?: string) => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'boardStarButton',
      source: 'starredBoardsMenuInlineDialog',
      attributes: {
        starred: false,
      },
      containers: {
        board: {
          id: boardId,
        },
      },
    });
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="starred-boards-menu-popover"
        isDropDisabled={disableDragAndDrop}
      >
        {({ droppableProps, innerRef, placeholder }) => (
          <div {...droppableProps} ref={innerRef}>
            <BoardTileDropdownWrapper>
              {sortedBoards.map(
                (
                  {
                    id,
                    name,
                    prefs,
                    organization,
                    dateLastView,
                    dateLastActivity,
                    idBoardStar,
                    url,
                  },
                  index,
                ) => (
                  <Draggable
                    key={id}
                    draggableId={id}
                    index={index}
                    isDragDisabled={disableDragAndDrop}
                  >
                    {(
                      { innerRef, draggableProps, dragHandleProps },
                      { isDragging },
                    ) => {
                      const child = (
                        <li
                          key={id}
                          ref={innerRef}
                          {...draggableProps}
                          {...dragHandleProps}
                          style={{
                            ...draggableProps.style,
                          }}
                          className={styles.listItem}
                        >
                          <BoardTile
                            id={id}
                            name={name}
                            maxBoardStarPosition={maxBoardStarPosition}
                            dateLastView={dateLastView}
                            dateLastActivity={dateLastActivity}
                            background={prefs?.background}
                            backgroundTile={prefs?.backgroundTile}
                            backgroundImage={prefs?.backgroundImage}
                            backgroundColor={prefs?.backgroundColor}
                            backgroundImageScaled={
                              prefs?.backgroundImageScaled || undefined
                            }
                            url={url}
                            organizationDisplayName={organization?.displayName}
                            isTemplate={prefs?.isTemplate}
                            boardStarId={idBoardStar}
                            // eslint-disable-next-line react/jsx-no-bind
                            onStarClick={() => handleStarClick(id)}
                            // eslint-disable-next-line react/jsx-no-bind
                            onBoardClick={() => handleBoardClick(id)}
                          />
                        </li>
                      );

                      if (!isDragging || !portal) {
                        return child;
                      } else {
                        // if dragging - put the item in a portal
                        // we need to create a portal here because this
                        // list is rendered in a popover, with a parent
                        // element that uses 'transform'. See this issue
                        // for more detail: https://github.com/atlassian/react-beautiful-dnd/issues/128#issuecomment-333410772
                        return ReactDOM.createPortal(child, portal);
                      }
                    }}
                  </Draggable>
                ),
              )}
              {placeholder}
            </BoardTileDropdownWrapper>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
