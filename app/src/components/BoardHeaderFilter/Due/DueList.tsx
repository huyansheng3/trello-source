import React from 'react';
import classNames from 'classnames';
import { forNamespace } from '@trello/i18n';
import { CheckIcon } from '@trello/nachos/icons/check';

import { ModelCache } from 'app/scripts/db/model-cache';
import {
  DueFilter,
  BoardDueFilterString,
} from 'app/src/components/ViewFilters/filters';

import { DueFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import { Attributes } from '../types';

import styles from './DueList.less';

const format = forNamespace('due date filter');

interface DueListProps {
  idBoard: string;
  dueList: DueFilterCriteriaOption[];
  dueFilter: DueFilter;
  trackFilterItemClick: (attributes: Attributes) => void;
  clearSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
}

export const DueList: React.FunctionComponent<DueListProps> = ({
  idBoard,
  dueList,
  dueFilter,
  trackFilterItemClick,
  clearSearch,
  onKeyDown,
}) => {
  function toggleDue(dueValue: BoardDueFilterString) {
    const board = ModelCache.get('Board', idBoard);
    const filter = board?.filter;
    if (filter) {
      trackFilterItemClick({ type: 'date' });

      switch (dueValue) {
        case 'complete':
          DueFilter.setBoardDueFilter('dueComplete', true, filter);
          break;
        case 'incomplete':
          DueFilter.setBoardDueFilter('dueComplete', false, filter);
          break;
        case 'overdue':
          DueFilter.setBoardDueFilter('overdue', true, filter);
          break;
        default: {
          DueFilter.setBoardDueFilter('due', dueValue, filter);
        }
      }
    }
  }

  const NO_DUE: Omit<DueFilterCriteriaOption, 'filterableWords'> = {
    value: 'notdue',
    label: format('notdue'),
  };

  const dueItemsList = [NO_DUE, ...dueList].map(({ value, label }) => {
    const isActive = dueFilter.isDueOptionActive(value);

    function onKeyUp(e: React.KeyboardEvent<Element>) {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleDue(value);
      }
    }

    return (
      <li
        key={value}
        className={classNames(styles.dueListItem, isActive && styles.isActive)}
      >
        <a
          className={styles.dueListItemLink}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => toggleDue(value)}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
        >
          <span>{label}</span>
          {isActive && (
            <CheckIcon
              size="small"
              dangerous_className={styles.dueListItemLinkIcon}
            />
          )}
        </a>
      </li>
    );
  });

  return <>{dueItemsList}</>;
};
