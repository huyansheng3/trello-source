import React from 'react';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import styles from './EnterpriseNamePanel.less';
import { WorkspaceLogo } from 'app/src/components/WorkspaceLogo';
import { useEnterpriseNamePanelQuery } from './EnterpriseNamePanelQuery.generated';

export const EnterpriseNamePanel = ({ orgId }: { orgId: string }) => {
  const { data } = useEnterpriseNamePanelQuery({ variables: { orgId: orgId } });
  const displayName = data?.organization?.enterprise?.displayName || '';
  const logoHash = data?.organization?.enterprise?.logoHash;

  return (
    <div className={styles.container}>
      {logoHash ? (
        <WorkspaceLogo logoHash={logoHash} name={displayName} size={'small'} />
      ) : (
        <EnterpriseIcon dangerous_className={styles.icon} />
      )}
      <p className={styles.text}>{displayName}</p>
    </div>
  );
};
