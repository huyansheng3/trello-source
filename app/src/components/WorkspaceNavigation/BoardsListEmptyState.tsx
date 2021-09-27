import React, { useState, useCallback, Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { EmptyState } from './EmptyState';
import { BoardIcon } from '@trello/nachos/icons/board';
import { useDispatch } from 'react-redux';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('workspace_navigation');

interface BoardsListEmptyStateProps {
  orgId?: string;
}

export const BoardsListEmptyState: React.FunctionComponent<BoardsListEmptyStateProps> = ({
  orgId,
}) => {
  const dispatch = useDispatch();
  const CreateBoardOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-overlay" */ 'app/src/components/CreateBoardOverlay'
      ),
    {
      preload: false,
      namedImport: 'CreateBoardOverlay',
    },
  );

  const [showCreateBoardOverlay, setShowCreateBoardOverlay] = useState(false);

  const closeCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(false);
  }, [setShowCreateBoardOverlay]);

  const openCreateBoardOverlay = useCallback(() => {
    dispatch(preloadCreateBoardData());
    setShowCreateBoardOverlay(true);
  }, [setShowCreateBoardOverlay, dispatch]);

  const text = format('empty-board-list');
  const linkText = format('create-board');
  const icon = <BoardIcon size="small" color="quiet" />;

  return (
    <>
      <div data-test-id={WorkspaceNavigationTestIds.BoardsListEmptyState}>
        <EmptyState
          icon={icon}
          text={text}
          linkText={linkText}
          onClickLink={openCreateBoardOverlay}
        />
      </div>
      {showCreateBoardOverlay && (
        <Suspense fallback={null}>
          <CreateBoardOverlay
            onClose={closeCreateBoardOverlay}
            preSelectedTeamId={orgId}
          />
        </Suspense>
      )}
    </>
  );
};
