import React, { useEffect } from 'react';
import { usePopover, Popover, PopoverContent } from '@trello/nachos/popover';
import { forTemplate } from '@trello/i18n';
import {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} from '@trello/keybindings';

import { FilterIcon } from '@trello/nachos/icons/filter';
import { CloseIcon } from '@trello/nachos/icons/close';

import { Button } from '@trello/nachos/button';
import { BoardFilterComponent } from './BoardFilterComponent';

import classnames from 'classnames';
import styles from './BoardHeaderFilterButton.less';

const format = forTemplate('board_header');

interface BoardHeaderFilterButtonProps {
  backgroundBrightness?: 'dark' | 'light';
  idBoard: string;
  idOrganization?: string;
  idEnterprise?: string;
  clearFilters: () => void;
  isFiltering: () => boolean;
  cardCount: number;
}

export const BoardHeaderFilterButton: React.FunctionComponent<BoardHeaderFilterButtonProps> = ({
  backgroundBrightness,
  idBoard,
  idOrganization,
  idEnterprise,
  clearFilters,
  isFiltering,
  cardCount,
}) => {
  const { toggle, triggerRef, popoverProps } = usePopover<HTMLButtonElement>();

  useEffect(() => {
    registerShortcut(toggle, { scope: Scope.BoardView, key: Key.f });
    return () => {
      unregisterShortcut(toggle);
    };
  }, [toggle]);

  function headerClearFilters(e: React.MouseEvent) {
    e.stopPropagation();
    clearFilters();
  }

  function onKeyUp(e: React.KeyboardEvent<Element>) {
    if (e.key === 'Enter' || e.key === ' ') {
      clearFilters();
    }
  }

  const isDarkBackground = backgroundBrightness === 'dark';

  const filterIconColor = isDarkBackground ? 'light' : 'dark';

  const isFilteringActive = isFiltering();

  return (
    <>
      <Button
        className={classnames(
          styles.boardHeaderFilterBtn,
          isFilteringActive && styles.boardHeaderFilterBtnActive,
        )}
        appearance={isDarkBackground ? 'transparent' : 'transparent-dark'}
        iconBefore={
          <FilterIcon color={isFilteringActive ? 'blue' : filterIconColor} />
        }
        ref={triggerRef}
        onClick={toggle}
      >
        <span className={styles.boardHeaderFilterSection}>
          <span className={styles.boardHeaderFilterBtnText}>
            {format('filter')}
          </span>
          {isFilteringActive && (
            <span className={styles.boardHeaderFilterCount}>{cardCount}</span>
          )}
        </span>
        {isFilteringActive && (
          <span
            role="button"
            onClick={headerClearFilters}
            className={styles.boardHeaderClearFilter}
          >
            <CloseIcon color={'blue'} />
          </span>
        )}
      </Button>

      <Popover
        {...popoverProps}
        title={format('filter-cards')}
        dontOverlapAnchorElement
      >
        <PopoverContent maxHeight={500} noBottomPadding noHorizontalPadding>
          <BoardFilterComponent
            idBoard={idBoard}
            idOrganization={idOrganization}
            idEnterprise={idEnterprise}
          />
        </PopoverContent>
        <div className={styles.clearFilterWrapper}>
          <Button
            className={styles.clearFilterButton}
            onClick={clearFilters}
            onKeyUp={onKeyUp}
            isDisabled={!isFilteringActive}
            iconBefore={
              <CloseIcon
                size={'small'}
                color={isFilteringActive ? 'light' : 'disabled'}
              />
            }
            appearance="primary"
            tabIndex={0}
            shouldFitContainer
          >
            {format('clear-filter')}
          </Button>
        </div>
      </Popover>
    </>
  );
};
