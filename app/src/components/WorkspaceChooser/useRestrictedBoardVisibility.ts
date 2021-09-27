import { useWorkspaceChooserRestrictedBoardVisibilityQuery } from './WorkspaceChooserRestrictedBoardVisibilityQuery.generated';
import { memberId } from '@trello/session-cookie';

interface Args {
  orgId: string;
  boardId: string;
  skip?: boolean;
}

/**
 * Compares the board's visibility with the workspace's board visibility settings
 */
export const useRestrictedBoardVisibility = ({
  orgId,
  boardId,
  skip,
}: Args) => {
  const { data, loading } = useWorkspaceChooserRestrictedBoardVisibilityQuery({
    variables: {
      orgId,
      boardId,
    },
    skip: !orgId || !boardId || skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const boardVisibility = data?.board?.prefs?.permissionLevel;
  const restrictions = data?.organization?.prefs?.boardVisibilityRestrict;
  const userIsWorkspaceAdmin =
    data?.organization?.memberships?.some(
      (membership) =>
        membership.idMember === memberId && membership.memberType === 'admin',
    ) || false;

  const workspaceRestrictsCurrentBoardVisibility =
    restrictions &&
    boardVisibility &&
    (restrictions[boardVisibility] === 'none' ||
      (restrictions[boardVisibility] === 'admin' && !userIsWorkspaceAdmin));

  const workspaceAllowsPrivateBoards =
    restrictions &&
    (restrictions.private === 'org' ||
      (restrictions.private === 'admin' && userIsWorkspaceAdmin));
  const workspaceAllowsPublicBoards =
    restrictions &&
    (restrictions.public === 'org' ||
      (restrictions.public === 'admin' && userIsWorkspaceAdmin));
  const workspaceAllowsWorkspaceVisibleBoards =
    restrictions &&
    (restrictions.org === 'org' ||
      (restrictions.org === 'admin' && userIsWorkspaceAdmin));

  const workspaceRestrictsAllBoardVisibilities =
    !workspaceAllowsPrivateBoards &&
    !workspaceAllowsPublicBoards &&
    !workspaceAllowsWorkspaceVisibleBoards;

  return {
    boardVisibility,
    loading,
    workspaceAllowsPrivateBoards,
    workspaceAllowsPublicBoards,
    workspaceAllowsWorkspaceVisibleBoards,
    workspaceRestrictsAllBoardVisibilities,
    workspaceRestrictsCurrentBoardVisibility,
  };
};
