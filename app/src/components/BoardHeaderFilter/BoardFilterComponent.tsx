import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { memberId } from '@trello/session-cookie';
import { Key } from '@trello/keybindings';

import { ModelCache } from 'app/scripts/db/model-cache';

import { Spinner } from '@trello/nachos/spinner';
import { Textfield } from '@trello/nachos/textfield';

import { useFilterCriteriaOptions } from 'app/src/components/FilterPopover/FilterCriteriaOptions';

import { useBoardFilterDataQuery } from './BoardFilterDataQuery.generated';
import { useBoardFilterMemberQuery } from './BoardFilterMemberQuery.generated';

import { LabelsList } from './Labels/LabelsList';
import { MembersList } from './Members/MembersList';
import { ModeList } from './Mode/ModeList';
import { DueList } from './Due/DueList';
import {
  parseBoardFilterObject,
  useBoardFiltersFromModelCache,
} from 'app/src/components/ViewFilters';
import { Attributes } from './types';

import styles from './BoardFilterComponent.less';

const format = forTemplate('filter_cards_search_results');

interface BoardFilterComponentProps {
  idBoard: string;
  idOrganization?: string;
  idEnterprise?: string;
}

export const BoardFilterComponent: React.FunctionComponent<BoardFilterComponentProps> = ({
  idBoard,
  idOrganization,
  idEnterprise,
}) => {
  const { data, loading, error } = useBoardFilterDataQuery({
    variables: { idBoard },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const { data: memberData } = useBoardFilterMemberQuery({
    variables: { memberId: memberId || 'me' },
  });

  function trackFilterItemClick(attributes: Attributes) {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'dropdownItem',
      actionSubjectId: 'viewsCardFilterDropdownItem',
      source: 'viewsCardFilterInlineDialog',
      containers: {
        board: {
          id: idBoard,
        },
        organization: {
          id: idOrganization,
        },
        enterprise: {
          id: idEnterprise,
        },
      },
      attributes,
    });
  }
  const boardFilters = useBoardFiltersFromModelCache(idBoard);

  const viewFilters = useMemo(() => parseBoardFilterObject(boardFilters), [
    boardFilters,
  ]);

  const [search, setSearch] = useState<string>(boardFilters.title || '');
  const [debouncedSearch] = useDebounce(search, 250);

  // To account for cleared filters
  useEffect(() => {
    setSearch(boardFilters.title || '');
  }, [boardFilters.title]);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'viewsCardFilterInlineDialog',
      containers: {
        board: {
          id: idBoard,
        },
        organization: {
          id: idOrganization,
        },
        enterprise: {
          id: idEnterprise,
        },
      },
    });
  }, [idBoard, idEnterprise, idOrganization]);

  useEffect(() => {
    const board = ModelCache.get('Board', idBoard);
    const filter = board?.filter;
    filter?.set('title', debouncedSearch);
  }, [debouncedSearch, idBoard]);

  const setTitle: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [],
  );

  function toggleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  function clearSearch() {
    if (search) {
      setSearch('');
    }
  }

  function onKeyDown(e: React.KeyboardEvent<Element>) {
    if (e.key === Key.Space) {
      e.preventDefault();
    }
  }

  const filterCriteria = useFilterCriteriaOptions({
    boards: data?.board ? [data.board] : [],
    searchQuery: search,
  });

  if (error) {
    return <div className="filterErrorWrapper">Uh oh, an error occurred!</div>;
  }

  if (loading || !data?.board) {
    return <Spinner centered />;
  }

  const isColorBlind = memberData?.member?.prefs?.colorBlind || false;

  return (
    <ul className={styles.popoverContentWrapper}>
      <Textfield
        value={search}
        onChange={setTitle}
        onFocus={toggleFocus}
        autoFocus
        tabIndex={0}
      />
      {!search && (
        <p className={styles.searchBarDescription}>
          {format('type-to-search-by-term-label-member-or-due-time')}
        </p>
      )}
      <hr />
      <LabelsList
        idBoard={idBoard}
        labels={filterCriteria?.labels || []}
        labelsFilter={viewFilters.labels}
        isColorBlind={isColorBlind}
        trackFilterItemClick={trackFilterItemClick}
        clearSearch={clearSearch}
        onKeyDown={onKeyDown}
      />
      <hr />
      <MembersList
        idBoard={idBoard}
        members={filterCriteria?.members || []}
        membersFilter={viewFilters.members}
        trackFilterItemClick={trackFilterItemClick}
        clearSearch={clearSearch}
        onKeyDown={onKeyDown}
      />
      <hr />
      <DueList
        idBoard={idBoard}
        dueList={filterCriteria?.due || []}
        dueFilter={viewFilters.due}
        trackFilterItemClick={trackFilterItemClick}
        clearSearch={clearSearch}
        onKeyDown={onKeyDown}
      />
      {!search && (
        <>
          <hr />
          <ModeList
            idBoard={idBoard}
            filterMode={viewFilters.mode}
            trackFilterItemClick={trackFilterItemClick}
            onKeyDown={onKeyDown}
          />
        </>
      )}
    </ul>
  );
};
