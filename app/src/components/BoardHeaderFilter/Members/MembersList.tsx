import React, { useState } from 'react';
import { forTemplate } from '@trello/i18n';
import { ModelCache } from 'app/scripts/db/model-cache';

import classnames from 'classnames';

// eslint-disable-next-line @trello/less-matches-component
import styles from './MemberItem.less';

import { Attributes } from '../types';
import { MemberItem } from './MemberItem';

import { MemberFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import { MembersFilter } from 'app/src/components/ViewFilters/filters';
import { ID_NONE } from 'app/common/lib/util/satisfies-filter';

const format = forTemplate('filter_cards_search_results');

interface MembersListProps {
  idBoard: string;
  members: Omit<
    MemberFilterCriteriaOption,
    'filterableWords' | 'label' | 'value'
  >[];
  membersFilter: MembersFilter;
  trackFilterItemClick: (attributes: Attributes) => void;
  clearSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
}

export const MembersList: React.FunctionComponent<MembersListProps> = ({
  idBoard,
  members,
  membersFilter,
  trackFilterItemClick,
  clearSearch,
  onKeyDown,
}) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const MEMBERS_TO_DISPLAY = 5;

  function toggleMember(idMember: string) {
    const board = ModelCache.get('Board', idBoard);
    const filter = board?.filter;
    filter?.toggleMember(idMember);
    clearSearch();
  }

  function expandMembers() {
    setShowAllMembers(true);
  }

  function onKeyUp(e: React.KeyboardEvent<Element>) {
    if (e.key === 'Enter' || e.key === ' ') {
      expandMembers();
    }
  }

  const firstMembersToDisplay = members.slice(0, MEMBERS_TO_DISPLAY);

  const membersToShow = showAllMembers ? members : firstMembersToDisplay;

  const DEFAULT_MEMBER = (
    <MemberItem
      key={ID_NONE}
      id={ID_NONE}
      activityBlocked={false}
      avatarUrl=""
      confirmed={true}
      initials="?"
      fullName=""
      username=""
      toggleMember={toggleMember}
      isActive={membersFilter.isEnabled(ID_NONE)}
      trackFilterItemClick={trackFilterItemClick}
      onKeyDown={onKeyDown}
    />
  );

  const memberItemsList = [
    DEFAULT_MEMBER,
    ...membersToShow.map(({ id, ...properties }) => (
      <MemberItem
        key={id}
        id={id}
        toggleMember={toggleMember}
        isActive={membersFilter.isEnabled(id)}
        trackFilterItemClick={trackFilterItemClick}
        onKeyDown={onKeyDown}
        {...properties}
      />
    )),
  ];

  const numMembersRemaining = Math.max(members.length - MEMBERS_TO_DISPLAY, 0);

  return (
    <>
      {memberItemsList}
      {!showAllMembers && members.length > MEMBERS_TO_DISPLAY && (
        <li className={classnames(styles.memberListItem, 'showAllMembers')}>
          <a
            className={styles.memberListItemLink}
            onClick={expandMembers}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            role="button"
            tabIndex={0}
          >
            <span
              className={classnames(
                styles.memberListItemLinkName,
                styles.modQuiet,
              )}
            >
              {format('show-all-members-remainingmembers-hidden', {
                remainingMembers: numMembersRemaining,
              })}
            </span>
          </a>
        </li>
      )}
    </>
  );
};
