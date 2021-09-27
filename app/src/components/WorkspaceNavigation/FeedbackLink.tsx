import React, { useMemo, useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { memberId } from '@trello/session-cookie';
import { getOrgPaidStatus } from '@trello/organizations';
import { CommentIcon } from '@trello/nachos/icons/comment';

import { forTemplate } from '@trello/i18n';

import { useFeedbackLinkQuery } from './FeedbackLinkQuery.generated';
import styles from './FeedbackLink.less';

const format = forTemplate('workspace_navigation');

export const FeedbackLink = ({ orgId }: { orgId?: string }) => {
  const handleClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'giveFeedbackLink',
      source: 'currentWorkspaceNavigationDrawer',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  }, [orgId]);
  const { data } = useFeedbackLinkQuery(
    orgId ? { variables: { orgId: orgId } } : { skip: true },
  );
  const linkWithParameters = useMemo(() => {
    const url = new URL('https://trello.typeform.com/to/xtXa4sVq');

    if (data) {
      url.searchParams.append(
        'team_status',
        getOrgPaidStatus(data.organization),
      );
    } else if (!orgId) {
      url.searchParams.append('team_status', 'NO_TEAM');
    }

    if (memberId) {
      url.searchParams.append('memberid', memberId);
    }

    return url.href;
  }, [data, orgId]);

  return (
    <div className={styles.container}>
      <CommentIcon />
      <p className={styles.text}>
        <a
          href={linkWithParameters}
          target="_blank"
          rel="noreferrer noopener"
          onClick={handleClick}
          className={styles.link}
        >
          {format('sidebar-feedback')}
        </a>
      </p>
    </div>
  );
};
