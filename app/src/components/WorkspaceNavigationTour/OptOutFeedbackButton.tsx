import React, { useCallback, useMemo } from 'react';

import { Button } from '@trello/nachos/button';
import { memberId } from '@trello/session-cookie';
import { getOrgPaidStatus } from '@trello/organizations';

import { useOptOutFeedbackButtonQuery } from './OptOutFeedbackButtonQuery.generated';
// eslint-disable-next-line @trello/less-matches-component
import styles from './WorkspaceNavigationTourModal.less';

interface OptOutFeedbackButtonProps {
  onClick?: () => void;
  orgId?: string;
}

export const OptOutFeedbackButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<OptOutFeedbackButtonProps>
>((props, ref) => {
  const { children, onClick, orgId } = props;

  const { data } = useOptOutFeedbackButtonQuery(
    orgId ? { variables: { orgId } } : { skip: true },
  );

  const surveyHref = useMemo(() => {
    const url = new URL('https://trello.typeform.com/to/ZxhrW2RG');

    url.searchParams.append(
      'team_status',
      orgId && data ? getOrgPaidStatus(data.organization) : 'NO_TEAM',
    );

    if (memberId) {
      url.searchParams.append('memberid', memberId);
    }

    return url.href;
  }, [data, orgId]);

  const handleClick = useCallback(() => {
    window.open(surveyHref, '_blank');
    onClick?.();
  }, [onClick, surveyHref]);

  return (
    <Button
      appearance="primary"
      className={styles.primaryButton}
      onClick={handleClick}
      ref={ref}
    >
      {children}
    </Button>
  );
});
