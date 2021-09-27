/* eslint-disable import/no-default-export */
import React from 'react';
import styles from './UpgradeAccount.less';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';

const format = forTemplate('header_account_switcher');

interface UpgradeAccountProps {
  onClickUpdateAccount: () => void;
  isMigratable: boolean;
}

export const UpgradeAccount: React.FunctionComponent<UpgradeAccountProps> = ({
  onClickUpdateAccount: onClickUpdateAccount,
  isMigratable: isMigratable,
}) => {
  return (
    <div className={styles.upgradeAccount}>
      <div className={styles.blurb}>
        {format('your-account-requires-a-few-updates-before-it-can-be-added')}
      </div>
      <div className={styles.cta}>
        {isMigratable && (
          <Button onClick={onClickUpdateAccount} appearance="primary">
            {format('continue')}
          </Button>
        )}
      </div>
    </div>
  );
};
