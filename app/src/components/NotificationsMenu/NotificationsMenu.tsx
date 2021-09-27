/* eslint-disable import/no-default-export */
import { HeaderTestIds, NotificationTestIds } from '@trello/test-ids';
import { forTemplate, forNamespace } from '@trello/i18n';
import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import { ChangeNotificationEmailFrequencyPopover } from 'app/src/components/ChangeNotificationEmailFrequencyPopover';
import { InfiniteNotificationsList } from './InfiniteNotificationsList';
import {
  setAllNotificationsRead,
  setSeenUnreadNotificationsAction,
} from 'app/gamma/src/modules/state/models/notifications';
import { State } from 'app/gamma/src/modules/types';
import { updateNotificationEmailFrequency } from 'app/gamma/src/modules/state/models/members';
import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transition } from 'react-transition-group';
import {
  shouldShowMeMarketingOptIn,
  shouldShowMeNoticeOfTosChange,
  getNotificationEmailFrequency,
} from 'app/gamma/src/selectors/members';
import { getUnreadNotificationsCountGroup } from 'app/gamma/src/selectors/notifications';
import {
  NotificationsCountModel,
  NotificationEmailFrequency,
} from 'app/gamma/src/types/models';
import { setNotificationSeenStateGroupCount } from './notificationSeenState';
import { DesktopNotification } from 'app/src/components/DesktopNotification';
import { MarketingOptInBanner } from './MarketingOptInBanner';
import { NotificationOfTosChange } from './NotificationOfTosChange';
import styles from './NotificationsMenu.less';
import { NotificationToggleFilterButton } from './NotificationToggleFilterButton';
import { usePopover, Popover } from '@trello/nachos/popover';
import { Analytics } from '@trello/atlassian-analytics';

const formatNotificationList = forTemplate('header_notification_list_menu');
const formatTitle = forNamespace('view title');

interface NotificationFrequencyButtonProps {
  notificationEmailFrequency: NotificationEmailFrequency;
  onSetNotificationEmailFrequency: (
    frequency: NotificationEmailFrequency,
  ) => void;
}

const NotificationFrequencyButton: FunctionComponent<NotificationFrequencyButtonProps> = ({
  notificationEmailFrequency,
  onSetNotificationEmailFrequency,
}) => {
  const onShow = useCallback(() => {
    Analytics.sendScreenEvent({
      name: 'notificationsEmailFrequencyInlineDialog',
    });
  }, []);
  const {
    triggerRef,
    toggle,
    popoverProps,
    hide,
  } = usePopover<HTMLButtonElement>({ onShow });
  return (
    <>
      <PopoverMenuButton
        onClick={toggle}
        ref={triggerRef}
        testId={HeaderTestIds.NotificationsEmailFrequency}
      >
        {formatNotificationList('change-notification-email-frequency')}
      </PopoverMenuButton>
      <Popover
        {...popoverProps}
        title={formatTitle('send emails')}
        noHorizontalPadding
      >
        <ChangeNotificationEmailFrequencyPopover
          notificationEmailFrequency={notificationEmailFrequency}
          // eslint-disable-next-line react/jsx-no-bind
          onSelectFrequency={(frequency) => {
            onSetNotificationEmailFrequency(frequency);
            hide();
          }}
        />
      </Popover>
    </>
  );
};

export const NotificationsMenu: React.FC = () => {
  const dispatch = useDispatch();
  const markAllNotificationsRead = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // This prevents the popover from closing. Because the "Mark All as Read"
      // button gets hidden after being clicked, the popover component thinks
      // that a component from outside the popover was clicked on, which causes
      // it to close.
      e.preventDefault();
      Analytics.sendClickedLinkEvent({
        linkName: 'markAllAsReadLink',
        source: 'notificationsInlineDialog',
      });
      dispatch(setAllNotificationsRead());
    },
    [dispatch],
  );
  const onSetNotificationEmailFrequency = useCallback(
    (frequency: NotificationEmailFrequency) => {
      dispatch(updateNotificationEmailFrequency(frequency));
    },
    [dispatch],
  );
  const setNotificationSeenState = useCallback(
    (unreadCount: NotificationsCountModel) => {
      setNotificationSeenStateGroupCount(unreadCount);
      dispatch(setSeenUnreadNotificationsAction(unreadCount));
    },
    [dispatch],
  );

  const {
    shouldShowMarketingOptIn,
    shouldShowNoticeOfTosChange,
    unreadNotificationsCountGroup,
    notificationEmailFrequency,
  } = useSelector((state: State) => {
    return {
      shouldShowMarketingOptIn: shouldShowMeMarketingOptIn(state),
      shouldShowNoticeOfTosChange: shouldShowMeNoticeOfTosChange(state),
      unreadNotificationsCountGroup: getUnreadNotificationsCountGroup(state),
      notificationEmailFrequency: getNotificationEmailFrequency(state),
    };
  });

  const [
    shouldDisplayDesktopNotificationButton,
    setShouldDisplayDesktopNotificationButton,
  ] = useState(DesktopNotification.isUnknown());

  useEffect(() => {
    setNotificationSeenState(unreadNotificationsCountGroup);
  }, [setNotificationSeenState, unreadNotificationsCountGroup]);

  const hasUnreadNotifications =
    Object.values(unreadNotificationsCountGroup).length > 0;

  const requestDesktopNotificationPermissions = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'allowDesktopNotificationsLink',
      source: 'notificationsInlineDialog',
    });
    DesktopNotification.requestPermission().finally(() => {
      setShouldDisplayDesktopNotificationButton(
        DesktopNotification.isUnknown(),
      );
    });
  }, []);

  return (
    <>
      <div className={styles.notificationActions}>
        <NotificationToggleFilterButton />
        {!!hasUnreadNotifications && (
          <button
            className={styles.notificationAction}
            onClick={markAllNotificationsRead}
            data-test-id={NotificationTestIds.MarkAllReadButton}
          >
            {formatNotificationList('mark-all-as-read')}
          </button>
        )}
      </div>
      <div className={styles.notificationsPanel}>
        <Transition in={shouldShowMarketingOptIn} timeout={2000}>
          {(state) => state !== 'exited' && <MarketingOptInBanner />}
        </Transition>
        {shouldShowNoticeOfTosChange && <NotificationOfTosChange />}
        <InfiniteNotificationsList />
        <PopoverMenu>
          <NotificationFrequencyButton
            notificationEmailFrequency={notificationEmailFrequency}
            onSetNotificationEmailFrequency={onSetNotificationEmailFrequency}
          />
          {shouldDisplayDesktopNotificationButton && (
            <PopoverMenuButton onClick={requestDesktopNotificationPermissions}>
              {formatNotificationList('allow-desktop-notifications')}
            </PopoverMenuButton>
          )}
        </PopoverMenu>
      </div>
    </>
  );
};
