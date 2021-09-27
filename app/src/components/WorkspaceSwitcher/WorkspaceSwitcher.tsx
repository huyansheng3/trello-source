import React, { Suspense, useCallback, useState, useEffect } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { forTemplate } from '@trello/i18n';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { WorkspaceSwitcherTestIds } from '@trello/test-ids';
import { useAllBoardsAndWorkspacesQuery } from './AllBoardsAndWorkspacesQuery.generated';
import { WorkspaceSwitcherPopover } from './WorkspaceSwitcherPopover';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { HeaderMenu } from 'app/src/components/HeaderMenu';
import { Null } from 'app/src/components/Null';
import { addIdleTask, clearIdleTask } from '@trello/idle-task-scheduler';

const DELAY_BEFORE_DATA_PREFETCH_MS = 1000;

const format = forTemplate('workspace_switcher');

const ErrorComponent: React.FC = () => <p>{format('error-loading-teams')}</p>;

export const WorkspaceSwitcher: React.FunctionComponent = () => {
  const [shouldHidePopover, setShouldHidePopover] = useState(false);

  /*
    We want to prefetch the workspaces data, but we don't want to
    make the call while the main body of the app is still loading.
    As of Sept-2021 we don't have any way to hook into render phases.
    Instead, we add a task to the idle task queue after an arbitrary delay.
  */
  const [prefetchData, setPrefetchData] = useState(false);

  useAllBoardsAndWorkspacesQuery({ skip: !prefetchData });

  useEffect(() => {
    const taskId = addIdleTask(() => {
      setPrefetchData(true);
    }, DELAY_BEFORE_DATA_PREFETCH_MS);
    return () => clearIdleTask(taskId);
  }, []);

  const CreateWorkspaceOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-team-overlay" */ 'app/src/components/CreateTeamOverlay'
      ),

    {
      preload: false,
      namedImport: 'CreateTeamOverlay',
    },
  );

  const [showCreateWorkspaceOverlay, setShowCreateWorkspaceOverlay] = useState(
    false,
  );

  const closeOverlay = useCallback(() => {
    setShowCreateWorkspaceOverlay(false);
  }, [setShowCreateWorkspaceOverlay]);

  const onClickCreateTeam = useCallback(() => {
    setShowCreateWorkspaceOverlay(true);
    setShouldHidePopover(true);
  }, [setShowCreateWorkspaceOverlay, setShouldHidePopover]);

  const onWorkspaceClick = useCallback(() => {
    setShouldHidePopover(true);
  }, [setShouldHidePopover]);

  const resetShouldHidePopover = useCallback(() => {
    setShouldHidePopover(false);
  }, [setShouldHidePopover]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.WorkspaceSwitcher,
      }}
      errorHandlerComponent={Null}
    >
      <HeaderMenu
        buttonText={format('teams')}
        analyticsButtonName="workspaceSwitcherButton"
        analyticsComponentName="workspaceSwitcherMenuInlineDialog"
        popoverTitle={format('teams')}
        dataTestId={WorkspaceSwitcherTestIds.WorkspaceSwitcher}
        shouldHidePopover={shouldHidePopover}
        resetShouldHidePopover={resetShouldHidePopover}
        noHorizontalPadding={true}
      >
        <ErrorBoundary
          tags={{
            ownershipArea: 'trello-teamplates',
            feature: Feature.WorkspaceSwitcher,
          }}
          errorHandlerComponent={ErrorComponent}
        >
          <WorkspaceSwitcherPopover
            onCreateTeamOverlayOpen={onClickCreateTeam}
            onWorkspaceClick={onWorkspaceClick}
          />
        </ErrorBoundary>
      </HeaderMenu>
      {showCreateWorkspaceOverlay && (
        <Suspense fallback={null}>
          <CreateWorkspaceOverlay
            teamType={TeamType.Default}
            onClose={closeOverlay}
          />
        </Suspense>
      )}
    </ErrorBoundary>
  );
};
