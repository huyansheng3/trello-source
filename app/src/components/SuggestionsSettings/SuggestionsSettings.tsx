import React from 'react';
import cx from 'classnames';
import { Analytics } from '@trello/atlassian-analytics';

import { forTemplate } from '@trello/i18n';
import styles from './SuggestionsSettings.less';

interface SuggestionsSettingsProps {
  context: string;
  onStopShowingSuggestions: () => void;
}

const format = forTemplate('suggestions_settings');

export const SuggestionsSettings: React.FunctionComponent<SuggestionsSettingsProps> = function SuggestionsSettings({
  context,
  onStopShowingSuggestions,
}) {
  return (
    <>
      <p>{format('if-these-arent-useful')}</p>
      <button
        className={cx('button', styles.stop)}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e) => {
          Analytics.sendClickedButtonEvent({
            source: 'suggestionSettingsInlineDialog',
            buttonName: 'stopShowingSuggestionsButton',
            attributes: {
              context,
            },
          });
          onStopShowingSuggestions();
        }}
      >
        {format('stop-showing-suggestions')}
      </button>
    </>
  );
};
