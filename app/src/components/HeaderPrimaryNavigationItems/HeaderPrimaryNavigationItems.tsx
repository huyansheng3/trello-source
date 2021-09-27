import React, { useCallback } from 'react';
import { WidthObserver } from '@atlaskit/width-detector';
import {
  OverflowProvider,
  useOverflowController,
  NavigationItem,
} from './useOverflowController';
import styles from './HeaderPrimaryNavigationItems.less';
import { SpotlightTopNavDropdowns } from 'app/src/components/SpotlightTopNavDropdowns';
import { LazyMoreMenu } from 'app/src/components/MoreMenu';
import { WorkspaceSwitcher } from 'app/src/components/WorkspaceSwitcher';
import { LazyRecentlyViewedBoardsMenu } from 'app/src/components/RecentlyViewedBoardsMenu';
import { LazyStarredBoardsMenuButton } from 'app/src/components/StarredBoardsMenu';
import { CreateMenuButton } from 'app/gamma/src/components/header/create-menu-button';

export const HeaderPrimaryNavigationItems = () => {
  const navigationItems: NavigationItem[] = [
    {
      name: 'WorkspaceSwitcher',
      component: <WorkspaceSwitcher key="WorkspaceSwitcher" />,
    },
    {
      name: 'RecentlyViewedBoardsMenu',
      component: (
        <LazyRecentlyViewedBoardsMenu key="RecentlyViewedBoardsMenu" />
      ),
    },
    {
      name: 'StarredBoardsMenuButton',
      component: <LazyStarredBoardsMenuButton key="StarredBoardsMenuButton" />,
    },
  ];
  const { updateWidth, visibleItems, overflowItems } = useOverflowController(
    navigationItems,
  );

  const WidthObserverRelativeWrapper = () => {
    return (
      <div className={styles.widthObserverContainerStyle}>
        <WidthObserver offscreen={true} setWidth={updateWidth} />
      </div>
    );
  };

  const content = useCallback(
    () => {
      const names = overflowItems.map((item) => {
        return item.name;
      });

      return (
        <OverflowProvider isVisible={false}>
          <LazyMoreMenu menuItems={names} />
        </OverflowProvider>
      );
    },

    // moreMenuItems  has an unstable reference - so we will only recalculate
    // content if `moreMenuItems` length changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [overflowItems.length],
  );

  return (
    <div className={styles.containerCSS}>
      <SpotlightTopNavDropdowns>
        <div>
          <OverflowProvider isVisible>
            {visibleItems.map((item) => item.component)}
          </OverflowProvider>
          {overflowItems.length > 0 && <>{content()}</>}
        </div>
      </SpotlightTopNavDropdowns>
      <CreateMenuButton redesign />
      <WidthObserverRelativeWrapper />
    </div>
  );
};
