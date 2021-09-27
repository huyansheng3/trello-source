import React, { useEffect, useState } from 'react';
import { forTemplate } from '@trello/i18n';
import { RecentlyViewedBoardsMenuPopover } from './RecentlyViewedBoardsMenuPopover';
import { RecentlyViewedBoardsMenuTestIds } from '@trello/test-ids';
import { HeaderMenu } from 'app/src/components/HeaderMenu';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { addIdleTask, clearIdleTask } from '@trello/idle-task-scheduler';
import { useRecentBoards } from './useRecentBoards';

const format = forTemplate('recently_viewed_boards_menu');

const DELAY_BEFORE_DATA_PREFETCH_MS = 1000;

const ErrorComponent: React.FC = () => (
  <p>{format('error-loading-recent-boards')}</p>
);

export const RecentlyViewedBoardsMenu: React.FC = () => {
  /*
    We want to prefetch the recent boards data, but we don't want to
    make the call while the main body of the app is still loading.
    As of Sept-2021 don't have any way to hook into render phases.
    Instead, we add a task to the idle task queue after an arbitrary delay.
  */
  const [fetchStarredBoards, setFetchStarredBoards] = useState(false);

  useRecentBoards({ skip: !fetchStarredBoards });

  useEffect(() => {
    const taskId = addIdleTask(() => {
      setFetchStarredBoards(true);
    }, DELAY_BEFORE_DATA_PREFETCH_MS);
    return () => clearIdleTask(taskId);
  }, []);

  return (
    <HeaderMenu
      buttonText={format('recent')}
      analyticsButtonName="recentlyViewedButton"
      analyticsComponentName="recentlyViewedBoardsMenuInlineDialog"
      popoverTitle={format('recent-boards')}
      dataTestId={RecentlyViewedBoardsMenuTestIds.RecentlyViewedBoardsMenu}
    >
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-teamplates',
          feature: Feature.RecentlyViewedBoardsMenu,
        }}
        errorHandlerComponent={ErrorComponent}
      >
        <RecentlyViewedBoardsMenuPopover />
      </ErrorBoundary>
    </HeaderMenu>
  );
};
