import { forTemplate } from '@trello/i18n';
import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import React, { FunctionComponent } from 'react';
import { NotificationEmailFrequency } from 'app/gamma/src/types/models';
import { CheckIcon } from '@trello/nachos/icons/check';

import styles from './ChangeNotificationEmailFrequencyPopover.less';
import { Analytics } from '@trello/atlassian-analytics';

const formatPopoverMenu = forTemplate('popover_set_email_freq');

interface ChangeNotificationEmailFrequencyPopoverProps {
  notificationEmailFrequency: NotificationEmailFrequency;
  onSelectFrequency: (frequency: NotificationEmailFrequency) => void;
}

const ActiveFrequencyIcon = () => (
  <CheckIcon size="small" block dangerous_className={styles.icon} />
);

const trackChangeFrequencyEvent = (frequency: NotificationEmailFrequency) => {
  const frequencyMap = {
    [-1]: 'never',
    [60]: 'periodically',
    [1]: 'instantly',
  };

  Analytics.sendClickedButtonEvent({
    buttonName: 'notificationsEmailFrequencyButton',
    source: 'notificationsInlineDialog',
    attributes: {
      frequency: frequencyMap[frequency],
    },
  });
};

const options = [
  {
    titleKey: 'never',
    descriptionKey: 'don-t-send-emails',
    frequency: NotificationEmailFrequency.Never,
  },
  {
    titleKey: 'periodically',
    descriptionKey: 'send-emails-about-once-an-hour',
    frequency: NotificationEmailFrequency.Periodically,
  },
  {
    titleKey: 'instantly',
    descriptionKey: 'send-emails-as-soon-as-possible',
    frequency: NotificationEmailFrequency.Instantly,
  },
];

export const ChangeNotificationEmailFrequencyPopover: FunctionComponent<ChangeNotificationEmailFrequencyPopoverProps> = ({
  notificationEmailFrequency,
  onSelectFrequency,
}) => {
  return (
    <PopoverMenu>
      {options.map(({ titleKey, descriptionKey, frequency }) => (
        <PopoverMenuButton
          key={titleKey}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            trackChangeFrequencyEvent(frequency);
            onSelectFrequency(frequency);
          }}
          title={
            <>
              {formatPopoverMenu(titleKey)}{' '}
              {notificationEmailFrequency === frequency && (
                <ActiveFrequencyIcon />
              )}
            </>
          }
          description={formatPopoverMenu(descriptionKey)}
        />
      ))}
    </PopoverMenu>
  );
};
