import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { addDismissedMessage } from 'app/gamma/src/modules/state/models/members';

import styles from './NotificationOfTosChange.less';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('in-app-notif');

export const NotificationOfTosChange: React.FC = () => {
  const dispatch = useDispatch();
  const agreeClick = useCallback(() => {
    dispatch(addDismissedMessage('1-nov-2018-tos-change-accepted'));
  }, [dispatch]);

  const submitAndDismiss = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // This prevents the popover from closing. Because the "Yep, I'm in!" and
      // "No thanks" buttons get hidden after being clicked, the popover component
      // thinks that a component from outside the popover was clicked on, which
      // causes it to close.
      e.preventDefault();

      Analytics.sendClickedButtonEvent({
        buttonName: 'noticeOfTosChangeButton',
        source: 'notificationsInlineDialog',
      });

      agreeClick();
    },
    [agreeClick],
  );

  const atlassianTosUrl =
    'https://www.atlassian.com/legal/cloud-terms-of-service';
  const summaryOfChangesUrl =
    'https://help.trello.com/article/1125-cloud-terms-of-service-summary-of-changes';

  const noticeString = format(
    'weve-replaced-the-trello-terms-of-service-no-html',
    {
      atlassianTosLink: (
        <a
          key="atlassianTosLink"
          href={atlassianTosUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {format('atlassian-cloud-terms-of-service')}
        </a>
      ),
      learnMoreLink: (
        <a
          key="learnMoreLink"
          href={summaryOfChangesUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {format('here')}
        </a>
      ),
    },
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.greeting}>{format('terms-of-service-update')}</h2>
      <p className={styles.noticeOfReplacementText}>{noticeString}</p>
      <p className={styles.explanationOfAgreementText}>
        {format('by-clicking-i-agree')}
      </p>
      <div className={styles.agreeToTosButton}>
        <Button
          appearance="primary"
          className={styles.button}
          onClick={submitAndDismiss}
        >
          {format('i-agree')}
        </Button>
      </div>
    </div>
  );
};
