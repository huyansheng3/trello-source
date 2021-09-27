import React, { useEffect } from 'react';

import { sendErrorEvent } from '@trello/error-reporting';

import { Feature } from 'app/scripts/debug/constants';

import {
  MissingCurrentWorkspaceDataError,
  useCurrentWorkspace,
} from './useCurrentWorkspace';
import { SpotlightNavigationCollapsed } from './SpotlightNavigationCollapsed';
import { Analytics } from '@trello/atlassian-analytics';
import { WorkspaceNavigationCollapsed } from './WorkspaceNavigationCollapsed';
import { usePublicTemplateQuery } from './PublicTemplateQuery.generated';

/*
  This component fetches the data needed to populate 
  WorkspaceNavigationCollapsed with the workspace's logo and display
  name (which shows when hovering over the logo)
*/

interface WorkspaceNavigationCollapsedProps {
  toggleVisibility: () => void;
  idWorkspace: string | null;
  idBoard?: string;
  isGlobal: boolean;
  isLoading: boolean;
  isHidden: boolean;
}

export const WorkspaceNavigationCollapsedWrapper: React.FunctionComponent<WorkspaceNavigationCollapsedProps> = ({
  toggleVisibility,
  idWorkspace,
  idBoard,
  isLoading,
  isGlobal,
  isHidden,
}) => {
  const skip = isLoading || isGlobal || isHidden;
  const {
    workspace,
    error: currentWorkspaceError,
    loading: currentWorkspaceLoading,
    // refetch: currentWorkspaceRefetch,
  } = useCurrentWorkspace({
    idWorkspace,
    idBoard: idBoard || undefined,
    skip,
  });
  const { data } = usePublicTemplateQuery(
    idBoard ? { variables: { boardId: idBoard } } : { skip: true },
  );

  // watch for errors from useCurrentWorkspace
  useEffect(() => {
    const workspaceExpectedButMissing =
      !skip && !currentWorkspaceLoading && !currentWorkspaceError && !workspace;
    if (currentWorkspaceError || workspaceExpectedButMissing) {
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
        sendErrorEvent(
          currentWorkspaceError ||
            new Error('Missing workspace data from useCurrentWorkspace'),
          {
            tags: {
              ownershipArea: 'trello-teamplates',
              feature: Feature.WorkspaceNavigation,
            },
            extraData: {
              idWorkspace: idWorkspace || '',
            },
          },
        );
      }
    }
  }, [
    currentWorkspaceError,
    currentWorkspaceLoading,
    workspace,
    skip,
    idWorkspace,
  ]);

  if (isGlobal || isHidden) {
    return null;
  }

  const displayName = workspace?.displayName;
  const logoHash = workspace?.logoHash || undefined;
  const isPublicTemplate =
    data?.board?.prefs?.isTemplate &&
    data?.board?.prefs?.permissionLevel === 'public';

  const shouldShowTrelloLogoIcon =
    workspace?.userRelationshipToWorkspace === 'NONE' && isPublicTemplate;

  return (
    <SpotlightNavigationCollapsed>
      <WorkspaceNavigationCollapsed
        displayName={displayName}
        logoHash={logoHash}
        toggleVisibility={toggleVisibility}
        isGlobal={isGlobal}
        isHidden={isHidden}
        shouldShowTrelloLogoIcon={shouldShowTrelloLogoIcon}
      />
    </SpotlightNavigationCollapsed>
  );
};
