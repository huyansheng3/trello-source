/* eslint-disable import/no-default-export */
import { HeaderTestIds } from '@trello/test-ids';
import { dynamicDebounce } from '@trello/time';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import { ConditionalWrapper } from 'app/src/components/ConditionalWrapper';
import { SearchIcon } from '@trello/nachos/icons/search';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import HeaderLink from 'app/gamma/src/components/header/header-link';
import { ScreenBreakpoints } from 'app/src/components/Responsive';
import { getKey, Key, Scope, useShortcut } from '@trello/keybindings';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip/ShortcutTooltip';
import {
  clearSearchQuery,
  clearSearchSuggestions,
  getSearchSuggestions,
  performSearch,
  setSearchQuery,
  setSelectedSuggestion,
} from 'app/gamma/src/modules/state/models/search';
import { State } from 'app/gamma/src/modules/types';
import React, {
  Suspense,
  FunctionComponent,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import Media from 'react-media';
import { useDispatch, useSelector } from 'react-redux';
import { getBoardsByIds } from 'app/gamma/src/selectors/boards';
import { getMembersByIds } from 'app/gamma/src/selectors/members';
import {
  getCurrentSearchQuery,
  getSearchSuggestions as selectSearchSuggestions,
  getSelectedSuggestion,
  getLastSearchQuery,
} from 'app/gamma/src/selectors/search';
import styles from './SearchForm.less';
import { BoardModel, MemberModel } from 'app/gamma/src/types/models';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { Popover, usePopover } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';
import { useSharedState } from '@trello/shared-state';
import { headerState } from 'app/gamma/src/components/header/headerState';
// Narrowed this import to avoid loading the entire SearchResults component non-lazily
import { searchState } from 'app/src/components/SearchResults/searchState';
import { SpotlightSearch } from 'app/src/components/SpotlightSearch';
import { loadBoardsForSearch } from 'app/gamma/src/modules/loaders/load-my-boards';
import { memberId } from '@trello/session-cookie';

const format = forTemplate('search_instant_results');
const alphabet: string =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const randomString = (length: number): string => {
  const letters: string[] = [];

  while (letters.length < length) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }

  return letters.join('');
};

// eslint-disable-next-line @trello/no-module-logic
const inputId = randomString(32);

interface SearchFormProps {
  focusRefOnDismiss: React.RefObject<HTMLElement>;
  redesign?: boolean;
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const shortcutTooltipWrapper = (children: React.ReactElement) => (
  <ShortcutTooltip shortcutKey="/" shortcutText={format('open-search')}>
    {children}
  </ShortcutTooltip>
);

export const SearchForm: FunctionComponent<SearchFormProps> = ({
  redesign,
  focusRefOnDismiss,
}) => {
  const dispatch = useDispatch();
  const { keywords, idMembers, idBoards } = useSelector(
    selectSearchSuggestions,
  );
  const boards: BoardModel[] = useSelector((state: State) =>
    getBoardsByIds(state, idBoards),
  );
  const members: MemberModel[] = useSelector((state: State) =>
    getMembersByIds(state, idMembers),
  );
  const allSuggestions = useMemo(() => [...keywords, ...boards, ...members], [
    boards,
    keywords,
    members,
  ]);
  const selectedSuggestion = useSelector(getSelectedSuggestion);
  const currentQuery = useSelector(getCurrentSearchQuery);
  const lastQuery = useSelector(getLastSearchQuery);
  const SearchResultsPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "search-results-popover" */ 'app/src/components/SearchResults'
      ),
    { namedImport: 'SearchResults' },
  );

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const searchResultsPopoverRef = useRef<HTMLDivElement>(null);

  const {
    triggerRef,
    show,
    popoverProps,
    hide,
  } = usePopover<HTMLInputElement>();
  const { isVisible, triggerElement } = popoverProps;

  const debouncedSearch = useMemo(() => {
    return dynamicDebounce((query: string) => dispatch(performSearch({})), 500);
  }, [dispatch]);

  const debouncedSuggest = useMemo(
    () =>
      dynamicDebounce((query: string, caretPos: number) => {
        dispatch(getSearchSuggestions(caretPos));
      }, 100),
    [dispatch],
  );

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // On initial load, fetch boards to populate the starred and recent
  // section of search (jump to) menu
  useEffect(() => {
    if (memberId) {
      dispatch(loadBoardsForSearch(memberId));
    }
  }, [dispatch]);

  /**
   * Because the search results popover is shown/hidden in response to the
   * focus and blur events and because those events are dispatched before
   * click events, we need to call preventDefault() to keep the popover from
   * closing itself when the input is clicked.
   */
  const stopClickPropagation = useCallback(
    (e: MouseEvent) => {
      // The searchContainerRef condition is necessary to catch click events
      // that return the incorrect event target. This only happens in Chrome and
      // leads to the popover showing then immediately closing. This would happen
      // on clicks on the input element, specifically clicking on the right side
      // where the active state renders two buttons.
      if (
        e.target === triggerElement ||
        e.target === searchContainerRef?.current
      ) {
        e.preventDefault();
      }
    },
    [triggerElement],
  );
  useEffect(() => {
    document.addEventListener('click', stopClickPropagation, true);
    return () => {
      document.removeEventListener('click', stopClickPropagation, true);
    };
  }, [stopClickPropagation]);

  const onShortcut = useCallback(() => {
    show();
    Analytics.sendPressedShortcutEvent({
      shortcutName: 'searchShortcut',
      source: getScreenFromUrl(),
      keyValue: '/',
    });
  }, [show]);
  useShortcut(onShortcut, {
    scope: Scope.Global,
    key: Key.ForwardSlash,
  });

  const [{ brandingName, brandingLogo }] = useSharedState(headerState);

  // This is for when blur gets called without a MouseEvent
  // (namely when the user presses `Esc`). Without this, the popover closes,
  // but the input remains in the active state
  const prevIsVisible = usePrevious(isVisible);
  const prevCurrentQuery = usePrevious(currentQuery);
  useEffect(() => {
    if (triggerElement && !isVisible && prevIsVisible) {
      triggerElement.blur();
      dispatch(clearSearchQuery());
      searchState.setValue({
        displaySavedSearchPromo: false,
        displayAddSavedSearchForm: false,
      });
    }

    // Also needed for focus without mouse event
    if (
      triggerElement &&
      isVisible &&
      (!prevIsVisible ||
        currentQuery === '' ||
        currentQuery !== prevCurrentQuery)
    ) {
      triggerElement.focus();
    }
  }, [
    currentQuery,
    dispatch,
    isVisible,
    prevCurrentQuery,
    prevIsVisible,
    triggerElement,
  ]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.currentTarget.value;
      dispatch(setSearchQuery({ query }));
      if (query.length) {
        debouncedSearch(query);
        debouncedSuggest(
          query,
          triggerElement && triggerElement.selectionStart
            ? triggerElement.selectionStart
            : 0,
        );
      }
    },
    [debouncedSearch, debouncedSuggest, dispatch, triggerElement],
  );

  const onBlur = useCallback(() => {
    const hasQuery = !!currentQuery;
    dispatch(clearSearchQuery());
    hide();

    // prevents calling this twice when pressing escape
    if (isVisible) {
      searchState.setValue({
        displaySavedSearchPromo: false,
        displayAddSavedSearchForm: false,
      });
      Analytics.sendClosedComponentEvent({
        componentType: 'inlineDialog',
        componentName: 'searchInlineDialog',
        source: getScreenFromUrl(),
        attributes: {
          hasQuery,
        },
      });
    }
  }, [currentQuery, dispatch, hide, isVisible]);

  const onMouseDown = useCallback(() => {
    if (!isVisible) {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'input',
        actionSubjectId: 'searchInput',
        source: 'appHeader',
      });
    }
  }, [isVisible]);

  const getSelectedIndex = useCallback(() => {
    let index = -1;
    if (keywords.length) {
      index = keywords.findIndex((keyword) => keyword === selectedSuggestion);
    }
    if (index === -1 && (boards.length || members.length)) {
      index = [...boards, ...members].findIndex(
        (suggestion) => suggestion.id === selectedSuggestion,
      );
    }

    return index;
  }, [boards, keywords, members, selectedSuggestion]);

  const getInitalQuery = useCallback(() => {
    return currentQuery.substring(0, currentQuery.lastIndexOf(' ') + 1);
  }, [currentQuery]);

  const onBoardSuggestion = useCallback(
    (board: BoardModel) => {
      dispatch(clearSearchSuggestions());
      dispatch(
        setSearchQuery({ query: `${getInitalQuery()}board:"${board.name}" ` }),
      );
      dispatch(performSearch({}));
    },
    [dispatch, getInitalQuery],
  );

  const onMemberSuggestion = useCallback(
    (member: MemberModel) => {
      dispatch(clearSearchSuggestions());
      dispatch(
        setSearchQuery({ query: `${getInitalQuery()}@${member.username} ` }),
      );
      dispatch(performSearch({}));
    },
    [dispatch, getInitalQuery],
  );

  const onKeywordSuggestion = useCallback(
    (keyword: string) => {
      dispatch(clearSearchSuggestions());
      dispatch(setSearchQuery({ query: `${getInitalQuery()}${keyword} ` }));
      dispatch(performSearch({}));
    },
    [dispatch, getInitalQuery],
  );

  const onUpArrow = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!allSuggestions.length) {
        return;
      }
      e.preventDefault();
      const index = getSelectedIndex();
      const next: number = index > 0 ? index - 1 : allSuggestions.length - 1;
      const nextSuggestion = allSuggestions[next];
      dispatch(
        setSelectedSuggestion(
          // @ts-expect-error
          nextSuggestion.id ? nextSuggestion.id : nextSuggestion,
        ),
      );
    },
    [allSuggestions, dispatch, getSelectedIndex],
  );

  const onDownArrow = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!allSuggestions.length) {
        return;
      }
      e.preventDefault();
      const index = getSelectedIndex();
      const length: number = allSuggestions.length - 1;
      const next: number = index === length ? 0 : index + 1;
      const nextSuggestion = allSuggestions[next];
      dispatch(
        setSelectedSuggestion(
          // @ts-expect-error
          nextSuggestion.id ? nextSuggestion.id : nextSuggestion,
        ),
      );
    },
    [allSuggestions, dispatch, getSelectedIndex],
  );

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!allSuggestions.length) {
        return;
      }
      e.preventDefault();
      const index = getSelectedIndex();
      if (index < keywords.length) {
        onKeywordSuggestion(keywords[index]);
      } else if (
        index >= keywords.length &&
        index < keywords.length + boards.length
      ) {
        onBoardSuggestion(boards[index - keywords.length]);
      } else {
        onMemberSuggestion(members[index - (keywords.length + boards.length)]);
      }
    },
    [
      allSuggestions.length,
      boards,
      getSelectedIndex,
      keywords,
      members,
      onBoardSuggestion,
      onKeywordSuggestion,
      onMemberSuggestion,
    ],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      switch (getKey(e)) {
        case Key.Escape:
          onBlur();
          e.preventDefault();
          e.stopPropagation();
          break;

        case Key.ArrowUp:
          onUpArrow(e);
          break;

        case Key.ArrowDown:
          onDownArrow(e);
          break;

        case Key.Enter:
        case Key.Tab:
          onEnter(e);
          break;

        default:
      }
    },
    [onBlur, onDownArrow, onEnter, onUpArrow],
  );

  const onKeyDownCloseButton = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!e.shiftKey && getKey(e) === Key.Tab) {
        e.preventDefault();
        searchResultsPopoverRef?.current?.focus({
          preventScroll: true,
        });
      }
    },
    [],
  );

  const onKeyDownSearchResultsPopover = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.shiftKey && getKey(e) === Key.Tab) {
        if (e.target === searchResultsPopoverRef.current) {
          e.preventDefault();
          closeButtonRef?.current?.focus({
            preventScroll: true,
          });
        }
      }

      if (getKey(e) === Key.Escape) {
        // set focus on logo if escape pressed from within the search results popover
        focusRefOnDismiss?.current?.focus({
          preventScroll: true,
        });
      }
    },
    [focusRefOnDismiss],
  );

  const onFocusSearchResultsPopover = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      const searchResultsPopoverScrollableArea = e.target
        .parentNode as HTMLDivElement;
      e.preventDefault();
      // ensure search results popover doesn't scroll when reverse tabbing
      searchResultsPopoverScrollableArea.scrollTop = 0;
    },
    [],
  );

  const SearchIconWithLabel = ({ redesign }: { redesign?: boolean }) => (
    <span className={redesign ? styles.searchIconContainer : styles.buttons}>
      <label htmlFor={inputId}>
        <SearchIcon
          dangerous_className={styles.searchIcon}
          size="medium"
          color={isVisible ? 'quiet' : 'light'}
        />
      </label>
    </span>
  );

  return (
    <>
      <Popover
        {...popoverProps}
        testId={HeaderTestIds.SearchPopover}
        dangerous_disableFocusManagement
        dangerous_width={600}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={searchResultsPopoverRef}
          /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
          tabIndex={0}
          onKeyDown={onKeyDownSearchResultsPopover}
          onFocus={onFocusSearchResultsPopover}
          className={styles.searchResultsPopover}
        >
          <Suspense fallback={null}>
            <SearchResultsPopover inputElement={triggerElement} />
          </Suspense>
        </div>
      </Popover>
      <Media
        queries={{
          small: ScreenBreakpoints.Small,
          medium: ScreenBreakpoints.Medium,
        }}
      >
        {(matches: { small: boolean; medium: boolean }) =>
          matches.small || (redesign && matches.medium && brandingName) ? (
            <span
              className={redesign ? styles.searchButtonRedesign : undefined}
            >
              <SpotlightSearch>
                <HeaderLink
                  href="/search"
                  buttonStyle="button"
                  className={classNames(redesign && styles.searchIconRedesign)}
                >
                  <SearchIcon
                    color="light"
                    size="medium"
                    dangerous_className={styles.searchIcon}
                  />
                </HeaderLink>
              </SpotlightSearch>
            </span>
          ) : (
            <SpotlightSearch>
              <div
                ref={searchContainerRef}
                className={classNames(
                  styles.search,
                  isVisible && styles.active,
                  brandingLogo && styles.branded,
                  redesign && styles.searchRedesign,
                )}
              >
                <label className={styles.searchLabelText} htmlFor={inputId}>
                  {format('jump-to-verbose')}
                </label>
                <ConditionalWrapper
                  condition={!isVisible}
                  wrapper={shortcutTooltipWrapper}
                  children={
                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className={classNames(
                        styles.searchInput,
                        isVisible && styles.searchInputActive,
                      )}
                      data-test-id={HeaderTestIds.SearchInput}
                      id={inputId}
                      onMouseDown={onMouseDown}
                      onFocus={show}
                      onKeyDown={onKeyDown}
                      onChange={onChange}
                      ref={triggerRef}
                      type="search"
                      value={currentQuery}
                      placeholder={
                        isVisible
                          ? format('search-ellipsis')
                          : redesign
                          ? format('search')
                          : format('jump-to')
                      }
                    />
                  }
                ></ConditionalWrapper>
                {redesign && <SearchIconWithLabel redesign />}
                {isVisible ? (
                  <span className={styles.buttons}>
                    <RouterLink
                      href={`/search?q=${encodeURIComponent(lastQuery)}`}
                      aria-label={format('jump-to-search-page')}
                    >
                      <ExternalLinkIcon
                        dangerous_className={classNames([
                          styles.searchIconButtons,
                          styles.externalIconButton,
                        ])}
                        size="medium"
                      />
                    </RouterLink>
                    <Button
                      className={classNames([
                        styles.searchIconButtons,
                        styles.closeIconButton,
                      ])}
                      appearance="icon"
                      type="button"
                      iconBefore={<CloseIcon size="small" />}
                      onKeyDown={onKeyDownCloseButton}
                      testId={HeaderTestIds.SearchClose}
                      ref={closeButtonRef}
                    />
                  </span>
                ) : (
                  !redesign && <SearchIconWithLabel />
                )}
              </div>
            </SpotlightSearch>
          )
        }
      </Media>
    </>
  );
};
