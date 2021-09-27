import { NotificationEmptyState } from './NotificationEmptyState';
import { ANIMATION_DURATION, NotificationGroup } from './NotificationGroup';
import { InfiniteList } from 'app/src/components/InfiniteList';
import { State } from 'app/gamma/src/modules/types';
import { loadNotificationGroups as _loadNotificationGroups } from 'app/gamma/src/modules/loaders/load-notifications';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transition, TransitionGroup } from 'react-transition-group';
import {
  getNotificationGroups,
  hasUnreadNotifications,
  isNotificationGroupsStale,
} from 'app/gamma/src/selectors/notifications';
import {
  isLoadingNotifications,
  shouldLoadMoreNotifications,
} from 'app/gamma/src/selectors/ui';
import {
  isNotificationFilterVisibilityAll,
  notificationsMenuState,
} from './notificationsMenuState';

import { IterableType } from '@researchgate/react-intersection-list';
import styles from './InfiniteNotificationsList.less';

const PAGE_SIZE = 10;

const viewAllNotifications = () => {
  notificationsMenuState.setValue({
    visibilityFilter: 'VISIBILITY_ALL',
  });
};

export const InfiniteNotificationsList: React.FC = () => {
  const dispatch = useDispatch();
  const loadNotificationGroups = useCallback(
    (skipNotificationGroups) => {
      dispatch(_loadNotificationGroups({ skipNotificationGroups }));
    },
    [dispatch],
  );

  const {
    isFilteringByUnread,
    notificationGroups,
    isLoading,
    isShowAll,
    isStale,
    awaitMore,
  } = useSelector((state: State) => {
    const isShowAll = isNotificationFilterVisibilityAll();

    const notificationGroups = getNotificationGroups(state).filter(
      (notificationGroup) =>
        isShowAll || hasUnreadNotifications(state, notificationGroup.id),
    );

    return {
      notificationGroups,
      isLoading: isLoadingNotifications(state),
      isShowAll,
      isStale: isNotificationGroupsStale(state),
      awaitMore: shouldLoadMoreNotifications(state),
      isFilteringByUnread: !isShowAll,
    };
  });

  const [isSwitchingToViewAll, setIsSwitchingToViewAll] = useState(false);

  /**
   * Weird logic ahead!
   *
   * When a member switches the notification filter from "Filter by Unread" to
   * "View All," we want the read notifications to transition from a height
   * and opacity of 0 to their full heights and an opacity of 1.
   *
   * In order to differentiate between notifications simply being rendered for
   * the first time and notifications being rendered for the first time *right
   * after* clicking "View All," we use the `isSwitchingToViewAll` state
   * combined with a ref that keeps track of the initial load. This
   * state is used in the `Transition` component to determine whether or not
   * to animate the initial mount "exited"->"entering" transition.
   */
  const initialLoad = useRef(true);
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setIsSwitchingToViewAll(!isFilteringByUnread);
    }
  }, [isFilteringByUnread]);

  // If the number of notifications changes, then we must have loaded
  // more notifications, in which case we reset the flag. This prevents
  // new notifications from being incorrectly animated in the future
  // (e.g. during infinite scroll)
  const numberOfNotifications = notificationGroups.length;
  useEffect(() => {
    setIsSwitchingToViewAll(false);
  }, [numberOfNotifications]);

  const renderEmpty = useCallback(
    (isEmpty: boolean) => {
      const showEmptyState = isEmpty && !isLoading;

      // Render two separate components so that `isShowAll` can't change
      // during the fade-out animation.
      return (
        <>
          <NotificationEmptyState
            isShowAll
            visible={showEmptyState && isShowAll}
          />
          <NotificationEmptyState
            visible={showEmptyState && !isShowAll}
            onClickViewAll={viewAllNotifications}
          />
        </>
      );
    },
    [isLoading, isShowAll],
  );

  const loadMoreNotifications = useCallback(() => {
    const skipNotificationGroups = isStale ? [] : notificationGroups;
    loadNotificationGroups(skipNotificationGroups);
  }, [isStale, notificationGroups, loadNotificationGroups]);

  // Because the rendered notification depends on the current
  // notificationGroups in props, make a new renderNotification per render.
  // (This could also be achieved by sending notificationGroups through
  // the InfiniteList as items instead of providing an itemCount)
  const renderNotification = useCallback(
    (index: number) => {
      const notificationGroup = notificationGroups[index];

      return (
        <Transition timeout={ANIMATION_DURATION} key={notificationGroup.id}>
          {(state) => {
            return (
              <NotificationGroup
                {...notificationGroup}
                key={notificationGroup.id}
                collapsed={
                  state === 'exiting' ||
                  (isSwitchingToViewAll && state === 'exited')
                }
              />
            );
          }}
        </Transition>
      );
    },
    [isSwitchingToViewAll, notificationGroups],
  );

  const notificationsRenderer = useCallback(
    (items: IterableType, ref: (instance: React.ReactInstance) => void) => {
      // Hack: IterableType isn't a useful/generic type, and by relying on
      // implementation details, we know it's just an array.
      // https://github.com/researchgate/react-intersection-list/blob/ab7fc85392c08457d6ddbac5c2c2301e7bba826c/src/List.js#L130
      const itemsArr = Array.from(items as JSX.Element[]);

      // Hack: Rely on implementation detail of scroll sentinel being keyed
      // 'sentinel'. This is required because putting the sentinel inside a
      // TransitionGroup causes `loadMore` to repeatedly get called.
      const sentinel = itemsArr.find((item) => item.key === 'sentinel');
      const notifications = itemsArr.filter((item) => item.key !== 'sentinel');

      return (
        // eslint-disable-next-line react/jsx-no-bind
        <div ref={(instance) => instance !== null && ref(instance)}>
          <TransitionGroup>{notifications}</TransitionGroup>
          {sentinel}
        </div>
      );
    },
    [],
  );

  return (
    <div className={styles.notificationsList}>
      <InfiniteList
        renderItem={renderNotification}
        itemsRenderer={notificationsRenderer}
        itemCount={notificationGroups.length}
        awaitMore={awaitMore}
        loadMore={loadMoreNotifications}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        spinnerClassName={styles.spinner}
        renderEmpty={renderEmpty}
      />
    </div>
  );
};
