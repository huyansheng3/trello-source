// react imports
import React, { useCallback, useState, useEffect, createRef } from 'react';
import cx from 'classnames';

// trello imports
import { Button } from '@trello/nachos/button';
import { CopyIcon } from '@trello/nachos/icons/copy';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { usePopover, Popover } from '@trello/nachos/popover';
import { OverflowMenuHorizontalIcon } from '@trello/nachos/icons/overflow-menu-horizontal';
import { showFlag } from '@trello/nachos/experimental-flags';

// outside directory imports
import { Auth } from 'app/scripts/db/auth';
import { forTemplate } from '@trello/i18n';
import { useUpdateCalendarFeedEnabledPreferenceMutation } from 'app/src/components/ViewsGenerics/UpdateCalendarFeedEnabledPreferenceMutation.generated';
import { useUpdateCalendarKeyMutation } from 'app/src/components/ViewsGenerics/UpdateCalendarKeyMutation.generated';
import { SettingsPopover } from 'app/src/components/ViewsGenerics/SettingsPopover';

// local directory imports
import styles from './CalendarSettings.less';
interface CalendarSettingsProps {
  idBoard: string;
  calendarFeedEnabled: boolean;
  calendarKey: string;
}

const format = forTemplate('calendar-view');

export const CalendarSettings: React.FunctionComponent<CalendarSettingsProps> = ({
  idBoard,
  calendarFeedEnabled,
  calendarKey,
}) => {
  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();

  const [isCopied, changeCopyState] = useState(false);
  const [updateCalendarKey] = useUpdateCalendarKeyMutation();
  const [
    updateCalendarFeedEnabledPref,
  ] = useUpdateCalendarFeedEnabledPreferenceMutation();

  const urlBoxRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (!calendarKey) {
      updateCalendarKey({
        variables: {
          boardId: idBoard,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCalendarKey: {
            __typename: 'Board',
            id: idBoard,
            myPrefs: {
              __typename: 'MyPrefs',
              calendarKey: calendarKey,
            },
          },
        },
      });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const feedURL = Auth.me()
    ? `https://${location.host}/calendar/` +
      `${Auth.me().id}/${idBoard}/${calendarKey}.ics`
    : '';

  const copyToClipboard = useCallback(() => {
    const urlBox = urlBoxRef.current;
    if (urlBox) {
      urlBox.value = feedURL;
      try {
        urlBox.focus();
        urlBox.select();
        document.execCommand('copy');
        changeCopyState(true);
        setTimeout(() => {
          changeCopyState(false);
        }, 1000);
      } catch (err) {
        console.error('Unable to copy URL', err);
        showFlag({
          id: 'CalendarSettings',
          appearance: 'error',
          title: format('sync-error'),
        });
      }
    }
  }, [urlBoxRef]);

  const child = (
    <div className={styles.popover}>
      <div className={styles.copyUrlDescription}>
        <CopyIcon />
        <div
          className={cx(styles.header, !calendarFeedEnabled && styles.disabled)}
        >
          {calendarFeedEnabled
            ? format('copy-url-header')
            : format('url-disabled')}
        </div>
        <Button
          className={styles.kebabButton}
          onClick={toggle}
          ref={triggerRef}
          iconBefore={<OverflowMenuHorizontalIcon size={'small'} />}
        />
      </div>
      {calendarFeedEnabled && (
        <div className={styles.text}>{format('copy-url-description')}</div>
      )}
      <Popover dangerous_width={150} {...popoverProps}>
        <a
          role="link"
          className={styles.changePreferencePopover}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            toggle();
            updateCalendarFeedEnabledPref({
              variables: {
                boardId: idBoard,
                calendarFeedEnabled: !calendarFeedEnabled,
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateCalendarFeedEnabledPref: {
                  __typename: 'Board',
                  id: idBoard,
                  prefs: {
                    __typename: 'Board_Prefs',
                    calendarFeedEnabled: !calendarFeedEnabled,
                  },
                },
              },
            });
          }}
        >
          {calendarFeedEnabled ? format('disable-sync') : format('enable-sync')}
        </a>
      </Popover>
      <div
        className={cx(styles.calendarFeed, !calendarFeedEnabled && styles.hide)}
      >
        {calendarFeedEnabled && (
          <>
            <input
              ref={urlBoxRef}
              readOnly
              className={styles.linkBox}
              value={feedURL}
            />
            <Button
              className={styles.copyButton}
              appearance="primary"
              onClick={copyToClipboard}
              children={isCopied ? format('copied') : format('copy')}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <SettingsPopover
      title={format('sync-description')}
      iconBefore={<CalendarIcon />}
      className={'calendarSettingsButton'}
      popoverChild={child}
    />
  );
};
