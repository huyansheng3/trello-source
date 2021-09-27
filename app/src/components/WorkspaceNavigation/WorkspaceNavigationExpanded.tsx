import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';
import { Spinner } from '@trello/nachos/spinner';
import { sendErrorEvent } from '@trello/error-reporting';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import {
  featureFlagClient,
  useSeesVersionedVariation,
} from '@trello/feature-flag-client';

import { Feature } from 'app/scripts/debug/constants';

import { SpotlightNavigationExpanded } from './SpotlightNavigationExpanded';
import { CurrentWorkspaceExpanded } from './CurrentWorkspaceExpanded';
import { NoRelationshipMessage } from './NoRelationshipMessage';
import {
  MissingCurrentWorkspaceDataError,
  useCurrentWorkspace,
} from './useCurrentWorkspace';
import styles from './WorkspaceNavigationExpanded.less';
import { Analytics } from '@trello/atlassian-analytics';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { WorkspaceNavigationExpandedError } from './WorkspaceNavigationExpandedError';
import { WorkspaceNavigationExpandedContainer } from './WorkspaceNavigationExpandedContainer';
import { TemplatesList } from './TemplatesList';
import { usePublicTemplateQuery } from './PublicTemplateQuery.generated';

interface ExpandedWorkspaceNavigationProps {
  toggleVisibility: () => void;
  idWorkspace: string | null;
  idBoard?: string;
  isGlobal: boolean;
  isLoading: boolean;
  isHidden: boolean;
}

export const WorkspaceNavigationExpanded: React.FunctionComponent<ExpandedWorkspaceNavigationProps> = ({
  toggleVisibility,
  idWorkspace,
  idBoard,
  isGlobal,
  isLoading,
  isHidden,
}) => {
  const isOrganizationDefaultViewsEnabled = useSeesVersionedVariation(
    'remarkable.default-views',
    'alpha',
  );
  const isWorkspaceCalendarEnabled = featureFlagClient.get(
    'ecosystem.multi-board-calendar',
    false,
  );

  const skip = isLoading || isGlobal || isHidden;
  const {
    workspace,
    error: currentWorkspaceError,
    loading: currentWorkspaceLoading,
    refetch: currentWorkspaceRefetch,
  } = useCurrentWorkspace({
    idWorkspace,
    idBoard,
    skip,
    isOrganizationDefaultViewsEnabled,
    isWorkspaceCalendarEnabled,
  });
  const { data: boardData, loading: boardLoading } = usePublicTemplateQuery(
    idBoard ? { variables: { boardId: idBoard } } : { skip: true },
  );

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

  const closeCreateTeamOverlay = useCallback(() => {
    setShowCreateWorkspaceOverlay(false);
  }, [setShowCreateWorkspaceOverlay]);

  // watch for errors from useCurrentWorkspace
  useEffect(() => {
    if (currentWorkspaceError) {
      if (currentWorkspaceError instanceof MissingCurrentWorkspaceDataError) {
        Analytics.sendOperationalEvent({
          action: 'attempted',
          actionSubject: 'fetchCurrentWorkspace',
          source: 'currentWorkspaceNavigationDrawer',
          containers: {
            organization: { id: idWorkspace },
          },
          attributes: {
            name: currentWorkspaceError.name,
            message: currentWorkspaceError.message,
          },
        });
      } else {
        sendErrorEvent(currentWorkspaceError, {
          tags: {
            ownershipArea: 'trello-teamplates',
            feature: Feature.WorkspaceNavigation,
          },
          extraData: {
            idWorkspace: idWorkspace || '',
          },
        });
      }
    }
  }, [
    currentWorkspaceError,
    currentWorkspaceLoading,
    workspace,
    skip,
    idWorkspace,
  ]);

  if (
    isLoading ||
    currentWorkspaceLoading ||
    // When the user has no relationship to workspace, wait for board
    // data to load so we can determine if it's a public template
    (workspace?.userRelationshipToWorkspace === 'NONE' && boardLoading)
  ) {
    return (
      <WorkspaceNavigationExpandedContainer>
        <div
          className={styles.loadingContainer}
          data-test-id={
            WorkspaceNavigationTestIds.WorkspaceNavigationExpandedSpinner
          }
        >
          <Spinner />
        </div>
      </WorkspaceNavigationExpandedContainer>
    );
  }

  if (isGlobal || isHidden) {
    return null;
  }

  if (currentWorkspaceError || !workspace) {
    return (
      <WorkspaceNavigationExpandedError
        retryFunction={currentWorkspaceRefetch}
        isGlobal={isGlobal}
        isHidden={isHidden}
      />
    );
  }

  const isPublicTemplate =
    boardData?.board?.prefs?.isTemplate &&
    boardData?.board?.prefs?.permissionLevel === 'public';

  return (
    <WorkspaceNavigationExpandedContainer>
      {workspace.userRelationshipToWorkspace === 'NONE' ? (
        isPublicTemplate ? (
          <TemplatesList toggleVisibility={toggleVisibility} />
        ) : (
          <NoRelationshipMessage
            toggleVisibility={toggleVisibility}
            workspace={workspace}
          />
        )
      ) : (
        <SpotlightNavigationExpanded>
          <CurrentWorkspaceExpanded
            toggleVisibility={toggleVisibility}
            workspace={workspace}
          />
        </SpotlightNavigationExpanded>
      )}
      {showCreateWorkspaceOverlay && (
        <Suspense fallback={null}>
          <CreateWorkspaceOverlay
            teamType={TeamType.Default}
            onClose={closeCreateTeamOverlay}
          />
        </Suspense>
      )}
    </WorkspaceNavigationExpandedContainer>
  );
};
