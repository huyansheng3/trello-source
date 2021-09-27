import React, { Suspense, useMemo, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Media from 'react-media';

import { HeaderTestIds } from '@trello/test-ids';
import classNames from 'classnames';

import { TrelloStorage } from '@trello/storage';
import { getNotificationFilterStateKey } from 'app/src/components/NotificationsMenu/notificationsMenuState';
import { loadNotifications } from 'app/gamma/src/modules/state/ui/notifications-pane';
import {
  getNotificationSeenStateGroupCount,
  getNotificationSeenStateKey,
} from 'app/src/components/NotificationsMenu/notificationSeenState';
import { setSeenUnreadNotificationsAction } from 'app/gamma/src/modules/state/models/notifications';

import { ScreenBreakpoints } from 'app/src/components/Responsive';
import { SearchForm } from 'app/src/components/SearchForm';
import { QuickSwitcher } from 'app/src/components/QuickSwitcher';
import printStyles from './print.less';

import { useRouteId, RouteId } from '@trello/routes';
import BackToHomeLink from 'app/gamma/src/components/header/back-to-home-link';
import DesktopSettingsButton from 'app/gamma/src/components/header/desktop-settings-button';
import { NotificationsMenuButton } from 'app/src/components/NotificationsMenu';
import HeaderBoardMenuButton from './board-menu-button';
import ChannelSwitcherButton from './channel-switcher-button';
import { CreateMenuButton } from './create-menu-button';
import { EnterpriseMenuButton } from './enterprise-menu-button';
import HeaderLogo from './header-logo';
import { InfoMenuButton } from './info-menu-button';
import { MemberMenuButton } from './member-menu-button';
import HeaderButton from './button';
import { ApplicationSwitcherIcon } from '@trello/nachos/icons/application-switcher';
import { TacoAnnouncements } from 'app/src/components/TacoAnnouncements';
import { useFeatureFlag } from '@trello/feature-flag-client';

import { MemberModel } from 'app/gamma/src/types/models';

import styles from './header.less';
import { isDesktop, isTouch } from '@trello/browser';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';
import {
  useBoardsMenuVisibility,
  BoardsMenuVisibilityState,
} from 'app/src/components/BoardsMenu/useBoardsMenuVisibility';
import { useWorkspaceNavigation } from 'app/src/components/WorkspaceNavigation';
import { noop } from 'app/src/noop';
import { HeaderPrimaryNavigationItems } from 'app/src/components/HeaderPrimaryNavigationItems';

interface AuthenticatedHeaderProps {
  brandingColor: string | undefined;
  member: MemberModel | undefined;
}

export const AuthenticatedHeader: React.FunctionComponent<AuthenticatedHeaderProps> = ({
  member,
  brandingColor,
}) => {
  const { boardsMenuVisibility } = useBoardsMenuVisibility();

  const dispatch = useDispatch();

  useEffect(() => {
    const onChangeNotificationSeenState = ({ key }: { key: string }) => {
      if (key === getNotificationSeenStateKey()) {
        dispatch(
          setSeenUnreadNotificationsAction(
            getNotificationSeenStateGroupCount(),
          ),
        );
      }
    };

    TrelloStorage.listenSyncedAcrossBrowser(onChangeNotificationSeenState);
    return () => {
      TrelloStorage.unlisten(onChangeNotificationSeenState);
    };
  }, [dispatch]);

  useEffect(() => {
    const onChangeNotificationFilterState = ({ key }: { key: string }) => {
      if (key === getNotificationFilterStateKey()) {
        dispatch(loadNotifications());
      }
    };
    TrelloStorage.listenSyncedAcrossBrowser(onChangeNotificationFilterState);
    return () => {
      TrelloStorage.unlisten(onChangeNotificationFilterState);
    };
  }, [dispatch]);

  const AtlassianAppSwitcherButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-app-switcher-button" */ 'app/gamma/src/components/header/atlassian-app-switcher-button'
      ),
    { namedImport: 'AtlassianAppSwitcherButton' },
  );

  const CrossFlowProvider = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "cross-flow-provider" */ 'app/src/components/CrossFlowProvider/CrossFlowProvider'
      ),
    { namedImport: 'CrossFlowProvider' },
  );

  const isNetworkRequestActivityEnabled = useFeatureFlag(
    'fep.developer_toolbar',
    false,
  );

  const NetworkRequestActivityTool = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "network-request-activity-tool" */ 'app/src/components/NetworkRequestActivityTool'
      ),
    {
      namedImport: 'NetworkRequestActivityTool',
      preload: isNetworkRequestActivityEnabled,
    },
  );

  const Heartbeat = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "heartbeat" */ 'app/src/components/Heartbeat'
      ),
    {
      namedImport: 'Heartbeat',
      preload: member?.isAaMastered,
    },
  );

  const networkActivityTool = useMemo(
    () =>
      process.env.NODE_ENV !== 'production' &&
      isNetworkRequestActivityEnabled && <NetworkRequestActivityTool />,
    [NetworkRequestActivityTool, isNetworkRequestActivityEnabled],
  );

  const routeId = useRouteId();

  const [{ enabled: workspaceNavigationEnabled }] = useWorkspaceNavigation();
  const boardOrCardRoute = [RouteId.BOARD, RouteId.CARD].includes(routeId);

  const headerLogoRef = useRef<HTMLAnchorElement>(null);
  const infoMenuButtonRef = useRef<HTMLButtonElement>(null);

  const renderAppSwitcherFallback = () => {
    return (
      <HeaderButton
        icon={<ApplicationSwitcherIcon color="light" />}
        onClick={noop}
        className={classNames(
          workspaceNavigationEnabled && styles.headerButtonRedesign,
          workspaceNavigationEnabled && styles.appSwitcherRedesign,
        )}
      />
    );
  };

  if (workspaceNavigationEnabled) {
    return (
      // Desktop injects styles based on this `id`, but we'll update it
      // soon to use the new `data-desktop-id`. We'd rather use isDesktop
      // and isMac here to add another class, but we need to take the app's zoom
      // factor in to account which is only available from within the
      // desktop context.
      <div
        className={classNames(
          styles.header,
          printStyles.noPrint,
          styles.headerRedesign,
          boardOrCardRoute && styles.headerBoardOrCardRoute,
        )}
        id="header"
        data-test-id={HeaderTestIds.Container}
        data-desktop-id="header-inner"
        style={{ backgroundColor: brandingColor }}
      >
        {member?.isAaMastered && !isDesktop() && !isTouch() && (
          <Suspense fallback={renderAppSwitcherFallback()}>
            <ChunkLoadErrorBoundary fallback={null}>
              <CrossFlowProvider>
                <AtlassianAppSwitcherButton member={member} redesign />
              </CrossFlowProvider>
            </ChunkLoadErrorBoundary>
          </Suspense>
        )}
        <HeaderLogo ref={headerLogoRef} redesign />
        <TacoAnnouncements />
        <div className={styles.leftSection}>
          <HeaderPrimaryNavigationItems />
        </div>

        <QuickSwitcher />
        <div className={styles.rightSectionRedesign}>
          {routeId !== RouteId.SEARCH && (
            <SearchForm focusRefOnDismiss={infoMenuButtonRef} redesign />
          )}
          {!isDesktop() && (
            <Media query={ScreenBreakpoints.MediumMin}>
              <InfoMenuButton redesign infoMenuButtonRef={infoMenuButtonRef} />
            </Media>
          )}
          <NotificationsMenuButton redesign />
          {/*Don't show the Enterprise menu on tiny devices*/}
          <Media query="only screen and (min-width: 450px)">
            <EnterpriseMenuButton redesign />
          </Media>
          <Media query={ScreenBreakpoints.MediumMin}>
            {(matches: boolean) =>
              matches && (
                <div className={styles.flexContainer}>
                  <ChannelSwitcherButton redesign />
                </div>
              )
            }
          </Media>
          <MemberMenuButton />
          {isDesktop() && <DesktopSettingsButton redesign />}
        </div>
        {networkActivityTool}
        <Suspense fallback={null}>
          <ChunkLoadErrorBoundary fallback={null}>
            {/* Locating this here until all Trello users are 100% migrated to Aa. */}
            {/* This can be moved to TrelloOnline once the migration is complete. */}
            <Heartbeat isAaMastered={member?.isAaMastered} />
          </ChunkLoadErrorBoundary>
        </Suspense>
      </div>
    );
  }
  return (
    // Desktop injects styles based on this `id`, but we'll update it
    // soon to use the new `data-desktop-id`. We'd rather use isDesktop
    // and isMac here to add another class, but we need to take the app's zoom
    // factor in to account which is only available from within the
    // desktop context.
    <div
      className={classNames(styles.header, printStyles.noPrint)}
      id="header"
      data-test-id={HeaderTestIds.Container}
      data-desktop-id="header-inner"
      style={{ backgroundColor: brandingColor }}
    >
      <div className={styles.leftSection}>
        {member?.isAaMastered && !isDesktop() && !isTouch() && (
          <Suspense fallback={renderAppSwitcherFallback()}>
            <ChunkLoadErrorBoundary fallback={null}>
              <CrossFlowProvider>
                <AtlassianAppSwitcherButton member={member} />
              </CrossFlowProvider>
            </ChunkLoadErrorBoundary>
          </Suspense>
        )}
        <Media query={ScreenBreakpoints.MediumMin}>
          <BackToHomeLink />
        </Media>
        {boardsMenuVisibility !== BoardsMenuVisibilityState.PINNED && (
          <HeaderBoardMenuButton />
        )}
        {routeId !== RouteId.SEARCH && (
          <SearchForm focusRefOnDismiss={headerLogoRef} />
        )}
        <TacoAnnouncements />
      </div>
      <HeaderLogo ref={headerLogoRef} />
      <div className={styles.rightSection}>
        <CreateMenuButton />
        {!isDesktop() && (
          <Media query={ScreenBreakpoints.MediumMin}>
            <InfoMenuButton />
          </Media>
        )}
        <NotificationsMenuButton />
        {/*Don't show the Enterprise menu on tiny devices*/}
        <Media query="only screen and (min-width: 450px)">
          <EnterpriseMenuButton />
        </Media>
        <Media query={ScreenBreakpoints.MediumMin}>
          {(matches: boolean) =>
            matches && (
              <div className={styles.flexContainer}>
                <ChannelSwitcherButton />
              </div>
            )
          }
        </Media>
        <MemberMenuButton />
        {isDesktop() && <DesktopSettingsButton />}
      </div>
      {networkActivityTool}
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          {/* Locating this here until all Trello users are 100% migrated to Aa. */}
          {/* This can be moved to TrelloOnline once the migration is complete. */}
          <Heartbeat isAaMastered={member?.isAaMastered} />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </div>
  );
};
