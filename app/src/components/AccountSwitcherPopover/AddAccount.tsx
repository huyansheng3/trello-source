/* eslint-disable import/no-default-export */
import React, { useState, useEffect } from 'react';
import styles from './AddAccount.less';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { TrelloStorage } from '@trello/storage';
import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';

const format = forTemplate('header_account_switcher');

interface AccountSwitcherPolicy {
  url: string;
  reason: string;
}
interface AddAccountParams {
  initialEmail?: string;
  policy?: AccountSwitcherPolicy;
}

const trackAccountSwitchFailed = (reason: string | null) => {
  Analytics.sendTrackEvent({
    action: 'failed',
    actionSubject: 'accountSwitcher',
    source: 'accountSwitcherAddAccountInlineDialog',
    attributes: {
      reason: reason || 'Trello account not found',
    },
  });
};

const fetchPolicy = async (email: string) => {
  const queryString = new URLSearchParams({
    email,
  }).toString();
  const res = await fetch(`/auth/accountSwitcher/policy?${queryString}`, {
    method: 'GET',
    headers: {
      'X-Trello-Client-Version': clientVersion,
      credentials: 'include',
    },
  });
  if (!res.ok) {
    throw new Error('error getting account switcher policy');
  }
  return res.json();
};

export const AddAccount: React.FunctionComponent<AddAccountParams> = ({
  initialEmail,
  policy,
}) => {
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [accountToAdd, setAccountToAdd] = useState('');
  const [policyState, setPolicyState] = useState(
    policy || { url: '', reason: '' },
  );

  const onSubmitEmail = async () => {
    setPolicyState({ url: '', reason: '' });
    setSubmitEnabled(false);
    try {
      const { url, reason } = await fetchPolicy(accountToAdd);
      if (reason && url.indexOf(window.location.origin) === 0) {
        trackAccountSwitchFailed(reason);
        setPolicyState({ url, reason });
      } else if (url) {
        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'accountSwitcher',
          source: 'accountSwitcherAddAccountInlineDialog',
        });
        TrelloStorage.set('accountSwitcherAccountAdded', 'true');
        window.location.href = url;
      }
    } catch {
      setPolicyState({ url: '', reason: 'not found' });
      trackAccountSwitchFailed(null);
    }
  };

  const onClickUpdateAccount = () => {
    TrelloStorage.set('accountSwitcherAccountAdded', 'true');
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'button',
      source: 'accountSwitcherAddAccountInlineDialog',
      actionSubjectId: 'accountSwitcherLoginAndUpdateButton',
    });
    window.location.href = policyState.url;
  };

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'accountSwitcherAddAccountInlineDialog',
    });
  }, []);

  const onEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitEnabled(event.currentTarget.value.length > 0);
    setAccountToAdd(event.currentTarget.value);
    setPolicyState({ url: '', reason: '' });
  };

  return (
    <div className={styles.addAccount}>
      <p>{format('enter-the-email-for-the-account-youd-like-to-add')}</p>
      <form
        // eslint-disable-next-line react/jsx-no-bind
        onSubmit={(e) => {
          e.preventDefault();
          if (submitEnabled) {
            onSubmitEmail();
          }
        }}
      >
        <input
          className={styles.email}
          placeholder={format('enter-email')}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={onEmailInputChange}
          value={initialEmail}
        />
        {policyState.reason === 'not found' && (
          <p className={styles.notFoundError}>
            {format('there-isnt-an-account-for-this-email')}
          </p>
        )}
        {policyState.reason !== 'migration ineligible' &&
          policyState.reason !== 'migration required' && (
            <Button
              isDisabled={!submitEnabled}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={onSubmitEmail}
              appearance="primary"
            >
              {format('continue')}
            </Button>
          )}
      </form>
      {(policyState.reason === 'migration ineligible' ||
        policyState.reason === 'migration required') && (
        <>
          <p className={styles.addAccountError}>
            {format(
              'this-account-requires-a-few-updates-before-it-can-be-added',
            )}
          </p>
          <Button
            appearance="primary"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={onClickUpdateAccount}
          >
            {format('log-in-and-update')}
          </Button>
        </>
      )}
    </div>
  );
};

export default AddAccount;
