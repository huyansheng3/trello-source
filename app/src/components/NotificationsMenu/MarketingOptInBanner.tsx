import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { CheckIcon } from '@trello/nachos/icons/check';
import { updateMarketingOptIn } from 'app/gamma/src/modules/state/models/members';

import styles from './MarketingOptInBanner.less';
import { featureFlagClient } from '@trello/feature-flag-client';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';

const format = forTemplate('marketing');

interface MarketingOptInBannerState {
  isDone: boolean;
}

export const MarketingOptInBanner: React.FC = () => {
  const dispatch = useDispatch();
  const optIn = useCallback(() => {
    dispatch(updateMarketingOptIn(true));
  }, [dispatch]);
  const rejectOptIn = useCallback(() => {
    dispatch(updateMarketingOptIn(false));
  }, [dispatch]);

  const [state, setState] = useState<MarketingOptInBannerState>({
    isDone: false,
  });

  const sendGASEvent = featureFlagClient.get(
    'dataeng.gasv3-event-tracking',
    false,
  );

  const { isDone } = state;

  const chooseToOptIn = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sendGASEvent) {
        Analytics.sendTrackEvent({
          action: 'optedIn',
          actionSubject: 'marketingEmail',
          source: getScreenFromUrl(),
        });
      }

      // This prevents the popover from closing. Because the "Yep, I'm in!" and
      // "No thanks" buttons get hidden after being clicked, the popover component
      // thinks that a component from outside the popover was clicked on, which
      // causes it to close.
      e.preventDefault();

      setState({ isDone: true });
      optIn();
    },
    [optIn, sendGASEvent],
  );

  const chooseToRejectOptIn = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sendGASEvent) {
        Analytics.sendTrackEvent({
          action: 'optedOut',
          actionSubject: 'marketingEmail',
          source: getScreenFromUrl(),
        });
      }

      // This prevents the popover from closing. Because the "Yep, I'm in!" and
      // "No thanks" buttons get hidden after being clicked, the popover component
      // thinks that a component from outside the popover was clicked on, which
      // causes it to close.
      e.preventDefault();

      setState({ isDone: true });

      rejectOptIn();
    },
    [rejectOptIn, sendGASEvent],
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.greeting}>
        {isDone ? (
          <>
            <CheckIcon size="large" color="green" block />
            {format('got-it')}
          </>
        ) : (
          format('hey-there')
        )}
      </h2>
      {!isDone && (
        <>
          <p>{format('can-we-occasionally-send-you-marketing-emails-like')}</p>
          <div>
            <Button
              appearance="primary"
              className={styles.button}
              onClick={chooseToOptIn}
            >
              {format('yep-im-in')}
            </Button>
            <Button
              appearance="primary"
              className={styles.button}
              onClick={chooseToRejectOptIn}
            >
              {format('no-thanks')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
