/* eslint-disable import/no-default-export */
import API from 'app/gamma/src/api';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// eslint-disable-next-line @trello/less-matches-component
import styles from './BoardsMenu.less';

import { HeaderTestIds } from '@trello/test-ids';
import { Spinner } from '@trello/nachos/spinner';
import { CloseButton } from 'app/src/components/CloseButton';
import { forTemplate } from '@trello/i18n';
import { navigate } from 'app/scripts/controller/navigate';
import { Key } from '@trello/keybindings';
import { State } from 'app/gamma/src/modules/types';
import { BOARD_FIELDS } from 'app/gamma/src/modules/loaders/fields';
import {
  boardSearchResultsSuccess as boardSearchSuccess,
  resetPastQueries,
} from 'app/gamma/src/modules/state/models/search';
import { CompactBoardTile } from 'app/src/components/CompactBoardTile';
import {
  setBoardsMenuSearchText,
  setBoardsMenuSelectedBoard,
} from 'app/gamma/src/modules/state/ui/boards-menu';
import { getMe } from 'app/gamma/src/selectors/members';
import {
  BoardModel,
  BoardsMenuSelectedItemModel,
} from 'app/gamma/src/types/models';
import { dynamicDebounce } from '@trello/time';

const format = forTemplate('boards_sidebar');

import { Analytics } from '@trello/atlassian-analytics';
import { BoardsMenuVisibilityState } from './useBoardsMenuVisibility';
import { CloseIcon } from '@trello/nachos/icons/close';
import type { TrelloClientSearchBoardsParams } from 'app/gamma/src/api/trello-client-js/trello-client-js.types';

interface Props {
  readonly boards: BoardModel[] | null;
  readonly searchText: string;
  readonly selectedBoard: BoardsMenuSelectedItemModel | null;
  readonly visibleBoards: BoardsMenuSelectedItemModel[] | null;
  readonly boardsMenuVisibility: BoardsMenuVisibilityState;
  readonly setBoardsMenuVisibility: (s: BoardsMenuVisibilityState) => void;
  forwardedRef?: React.Ref<HTMLInputElement>;
}

const BoardsSearchComponent = (props: Props) => {
  const dispatch = useDispatch();
  const pastQueries = useSelector(
    (state: State) => state.ui.boardsMenu.pastQueries,
  );
  const shouldSearchTeamBoards = useSelector((state: State) => {
    const me = getMe(state);
    return (
      me !== undefined &&
      me.idOrganizations !== undefined &&
      me.idOrganizations.length > 0
    );
  });
  const debouncedSearch = useMemo(
    () =>
      dynamicDebounce(
        async (query: string) => {
          const partial = !query.endsWith(' ');
          const trimmedQuery = query.trim();
          const limit = 10;

          const results = await API.client.searchBoards(
            {
              board_fields: BOARD_FIELDS as TrelloClientSearchBoardsParams['board_fields'],
              boards_limit: limit,
              modelTypes: ['boards'],
              partial,
              query: trimmedQuery,
            },
            true,
          );

          dispatch(
            boardSearchSuccess({
              query: trimmedQuery,
              boards: results.boards,
              limited: results.boards.length === limit,
              timestamp: Date.now(),
            }),
          );
        },
        (query) => {
          if (pastQueries.some((entry) => entry.query.startsWith(query))) {
            // They're very likely hitting backspace, we don't need to be as quick to
            // search
            return 1000;
          } else {
            return query.length <= 3 ? 1000 : 500;
          }
        },
      ),
    [dispatch, pastQueries],
  );

  useEffect(() => {
    return () => {
      dispatch(setBoardsMenuSearchText(''));
      debouncedSearch.clear();
      dispatch(resetPastQueries());
    };
    // This should only run on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelectedIndex = useCallback(() => {
    const { selectedBoard, searchText } = props;
    const selectedCategory =
      selectedBoard && !searchText ? selectedBoard.category : null;

    return selectedBoard && props.visibleBoards
      ? props.visibleBoards.findIndex(
          (board) =>
            board.id === selectedBoard.id &&
            board.category === selectedCategory,
        )
      : -1;
  }, [props]);

  const onClickCloseButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const { boardsMenuVisibility, setBoardsMenuVisibility } = props;

      if (boardsMenuVisibility === BoardsMenuVisibilityState.POPOVER) {
        setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
        Analytics.sendClosedComponentEvent({
          componentType: 'inlineDialog',
          componentName: 'boardsMenuInlineDialog',
          source: 'appHeader',
          attributes: {
            method: 'clicked close button',
          },
        });
      }
    },
    [props],
  );

  const onUpArrow = useCallback(() => {
    const { visibleBoards } = props;
    if (!visibleBoards) {
      return;
    }
    const index = getSelectedIndex();
    const next: number = index > 0 ? index - 1 : 0;
    dispatch(setBoardsMenuSelectedBoard(visibleBoards[next]));
  }, [dispatch, getSelectedIndex, props]);

  const onDownArrow = useCallback(() => {
    const { visibleBoards } = props;
    if (!visibleBoards) {
      return;
    }
    const index = getSelectedIndex();
    const length: number = visibleBoards.length - 1;
    const next: number = index === length ? length : index + 1;
    dispatch(setBoardsMenuSelectedBoard(visibleBoards[next]));
  }, [dispatch, getSelectedIndex, props]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      switch (e.key) {
        case Key.ArrowUp:
          onUpArrow();
          break;
        case Key.ArrowDown:
          onDownArrow();
          break;
        default:
          return;
      }
    },
    [onUpArrow, onDownArrow],
  );

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      visibleBoards,
      boardsMenuVisibility,
      setBoardsMenuVisibility,
    } = props;
    if (!visibleBoards || visibleBoards.length === 0) {
      return;
    }

    if (boardsMenuVisibility === BoardsMenuVisibilityState.POPOVER) {
      setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
    }

    const index = Math.max(getSelectedIndex(), 0);
    const boardAtIndex = visibleBoards[index];
    if (boardAtIndex?.url) {
      navigate(boardAtIndex.url, { trigger: true });
    }
  };

  const isSearchNecessary = useCallback(
    (query: string) => {
      // Don't bother searching on just a single character
      if (query.trim().length <= 1) {
        return false;
      }

      const alreadySearched = pastQueries.some(
        (entry) =>
          // We recently searched for this exact thing
          query.toLowerCase() === entry.query.toLowerCase() ||
          // We recently got all the results for a shorter prefix of this search
          (!entry.limited &&
            query.toLowerCase().startsWith(entry.query.toLowerCase())),
      );

      return !alreadySearched;
    },
    [pastQueries],
  );

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async ({ target: { value: rawValue } }) => {
      const val = rawValue.trim();

      dispatch(setBoardsMenuSearchText(rawValue));
      dispatch(setBoardsMenuSelectedBoard(null));

      if (
        val.length > 0 &&
        shouldSearchTeamBoards &&
        isSearchNecessary(rawValue)
      ) {
        debouncedSearch(rawValue);
      } else {
        // A search is no longer necessary
        debouncedSearch.clear();
      }
    },
    [dispatch, shouldSearchTeamBoards, isSearchNecessary, debouncedSearch],
  );

  const {
    boards,
    searchText,
    selectedBoard,
    forwardedRef,
    boardsMenuVisibility,
  } = props;
  const selectedId = selectedBoard ? selectedBoard.id : null;
  const searchInProgress = searchText && isSearchNecessary(searchText);

  const closeButton =
    boardsMenuVisibility === BoardsMenuVisibilityState.PINNED ? null : (
      <CloseButton
        closeIcon={<CloseIcon />}
        className={styles.boardsMenuCloseButton}
        medium={true}
        onClick={onClickCloseButton}
        type="button"
      />
    );

  return (
    <>
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <form onSubmit={onSearchSubmit} className={styles.boardsMenuSearchForm}>
        <input
          ref={forwardedRef}
          autoComplete="off"
          className={classNames(styles.input)}
          type="text"
          placeholder={format('find-boards-by-name-ellipsis')}
          name="search-boards"
          value={searchText}
          onChange={onChange}
          onKeyDown={onKeyDown}
          data-test-id={HeaderTestIds.BoardsMenuSearch}
          aria-label={format('find-boards-by-name-ellipsis')}
        />
        {closeButton}
      </form>
      {Boolean(searchText) &&
        boards &&
        boards.map((board: BoardModel) => (
          <CompactBoardTile
            key={board.id}
            idBoard={board.id}
            showTeamName={true}
            focused={board.id === selectedId}
          />
        ))}
      {searchInProgress && <Spinner centered />}
    </>
  );
};

export const BoardsSearch = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => <BoardsSearchComponent forwardedRef={ref} {...props} />,
);
