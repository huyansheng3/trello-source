/* eslint-disable import/no-default-export */
import { HeaderTestIds } from '@trello/test-ids';
import classNames from 'classnames';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import HeaderButton from 'app/gamma/src/components/header/button';
import { State } from 'app/gamma/src/modules/types';
import {
  loadNotificationGroups,
  loadUnreadNotificationsCount,
} from 'app/gamma/src/modules/loaders/load-notifications';
import React, {
  createContext,
  Suspense,
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FavIcon } from 'app/scripts/lib/favicon';
import { memberHasOtherNotifications } from 'app/gamma/src/selectors/members';
import { getUnseenNotificationsCount } from 'app/gamma/src/selectors/notifications';
import styles from './NotificationsMenuButton.less';
import { usePopover, Popover } from '@trello/nachos/popover';
import { forTemplate } from '@trello/i18n';
import { useLazyComponent } from '@trello/use-lazy-component';
import { NotificationIcon } from '@trello/nachos/icons/notification';
import { SmartLinkAnalyticsContextProvider } from 'app/src/components/SmartMedia';
const formatHeaderUser = forTemplate('header_user');

const NOTIFICATIONS_POPOVER_WIDTH = 432;

interface NotificationsMenuButtonProps {
  redesign?: boolean;
}

export interface NotificationsPopoverContextProps {
  hide: () => void;
  showPlanSelection: (idOrganization?: string) => void;
}

export const NotificationsPopoverContext = createContext<NotificationsPopoverContextProps>(
  {
    hide: () => {},
    showPlanSelection: () => {},
  },
);

export const NotificationsMenuButton: FunctionComponent<NotificationsMenuButtonProps> = ({
  redesign,
}) => {
  const dispatch = useDispatch();
  const { unreadNotificationsCount, hasOtherNotifications } = useSelector(
    (state: State) => {
      return {
        unreadNotificationsCount: getUnseenNotificationsCount(state),
        hasOtherNotifications: memberHasOtherNotifications(state),
      };
    },
  );

  const onLoadNotificationGroups = useCallback(() => {
    dispatch(loadNotificationGroups());
  }, [dispatch]);
  const onLoadUnreadNotificationsCount = useCallback(() => {
    dispatch(loadUnreadNotificationsCount());
  }, [dispatch]);

  const NotificationsMenu = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "notifications-menu-popover" */ 'app/src/components/NotificationsMenu'
      ),
    { namedImport: 'NotificationsMenu' },
  );
  const PlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "notifications-plan-selection-overlay" */ 'app/src/components/FreeTrial'
      ),
    {
      namedImport: 'PlanSelectionOverlay',
    },
  );

  useEffect(() => {
    onLoadUnreadNotificationsCount();
    onLoadNotificationGroups();
  }, [onLoadNotificationGroups, onLoadUnreadNotificationsCount]);

  useEffect(() => {
    if (!hasOtherNotifications && unreadNotificationsCount > 0) {
      FavIcon.setNotifications(true);
    }

    if (!hasOtherNotifications && unreadNotificationsCount === 0) {
      FavIcon.setNotifications(false);
    }
  }, [hasOtherNotifications, unreadNotificationsCount]);

  const onShow = useCallback(() => {
    Analytics.sendScreenEvent({
      name: 'notificationsInlineDialog',
    });
  }, []);

  const onHide = useCallback(() => {
    Analytics.sendClosedComponentEvent({
      componentType: 'inlineDialog',
      componentName: 'notificationsInlineDialog',
      source: getScreenFromUrl(),
    });
  }, []);

  const {
    triggerRef,
    toggle,
    hide,
    popoverProps,
  } = usePopover<HTMLButtonElement>({
    onShow,
    onHide,
  });

  const [isPlanSelectionOverlayOpen, togglePlanSelectionOverlay] = useState(
    false,
  );

  // string planSelectionOrgId is set by the individual child notification component
  const [planSelectionOrgId, setPlanSelectionOrgId] = useState('');

  const showPlanSelection = (orgId?: string) => {
    setPlanSelectionOrgId(orgId ?? '');
    togglePlanSelectionOverlay(true);
  };

  return (
    <>
      <HeaderButton
        icon={<NotificationIcon color="light" />}
        onClick={toggle}
        ref={triggerRef}
        testId={HeaderTestIds.NotificationsButton}
        className={classNames({
          [styles.newNotifications]:
            !hasOtherNotifications && unreadNotificationsCount > 0,
          [styles.hasOtherNotifications]: hasOtherNotifications,
          [styles.headerButtonRedesign]: redesign,
        })}
        ariaLabel={formatHeaderUser('notifications-menu')}
      />
      <SmartLinkAnalyticsContextProvider
        value={{ source: 'notificationsInlineDialog' }}
      >
        <NotificationsPopoverContext.Provider
          value={{ hide, showPlanSelection }}
        >
          <Popover
            {...popoverProps}
            title={formatHeaderUser('notifications-menu')}
            noHorizontalPadding
            testId={HeaderTestIds.NotificationsPopover}
            dangerous_width={NOTIFICATIONS_POPOVER_WIDTH}
          >
            <Suspense fallback={null}>
              <NotificationsMenu />
            </Suspense>
          </Popover>
          {isPlanSelectionOverlayOpen && (
            <Suspense fallback={null}>
              <PlanSelectionOverlay
                // eslint-disable-next-line react/jsx-no-bind
                onClose={() => {
                  togglePlanSelectionOverlay(false);
                  setPlanSelectionOrgId('');
                }}
                orgId={planSelectionOrgId}
                showDefault={true}
              />
            </Suspense>
          )}
        </NotificationsPopoverContext.Provider>
      </SmartLinkAnalyticsContextProvider>
    </>
  );
};
