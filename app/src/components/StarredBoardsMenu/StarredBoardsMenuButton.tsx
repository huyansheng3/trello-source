import React, { useEffect, useState } from 'react';
import { forTemplate } from '@trello/i18n';
import { StarredBoardsMenuPopover } from './StarredBoardsMenuPopover';
import { HeaderMenu } from 'app/src/components/HeaderMenu';
import { STARRED_BOARDS_MENU_POPOVER_CLASSNAME } from './DragAndDropStarredBoardsList';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { addIdleTask, clearIdleTask } from '@trello/idle-task-scheduler';
import { useStarredBoards } from './useStarredBoards';

const format = forTemplate('starred_boards_menu');

const DELAY_BEFORE_DATA_PREFETCH_MS = 1000;

const ErrorComponent: React.FC = () => <p>{format('there-was-an-error')}</p>;

export const StarredBoardsMenuButton: React.FC = () => {
  /*
    We want to prefetch the starred boards data, but we don't want to
    make the call while the main body of the app is still loading.
    As of Sept-2021 don't have any way to hook into render phases.
    Instead, we add a task to the idle task queue after an arbitrary delay.
  */
  const [fetchStarredBoards, setFetchStarredBoards] = useState(false);

  useStarredBoards({ skip: !fetchStarredBoards });

  useEffect(() => {
    const taskId = addIdleTask(() => {
      setFetchStarredBoards(true);
    }, DELAY_BEFORE_DATA_PREFETCH_MS);

    return () => clearIdleTask(taskId);
  }, []);

  return (
    <HeaderMenu
      buttonText={format('starred')}
      analyticsButtonName="starredBoardsMenuButton"
      analyticsComponentName="starredBoardsMenuInlineDialog"
      popoverTitle={format('starred-boards')}
      dangerous_classNamePopover={STARRED_BOARDS_MENU_POPOVER_CLASSNAME}
    >
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-teamplates',
          feature: Feature.StarredBoardsMenuButton,
        }}
        errorHandlerComponent={ErrorComponent}
      >
        <StarredBoardsMenuPopover />
      </ErrorBoundary>
    </HeaderMenu>
  );
};
