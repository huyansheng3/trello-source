import { useWorkspaceChooserRestrictedGuestsQuery } from './WorkspaceChooserRestrictedGuestsQuery.generated';

interface Args {
  orgId: string;
  boardId: string;
  skip?: boolean;
}

interface Member {
  id: string;
  fullName?: string | null;
}

export const useRestrictedGuests = ({ orgId, boardId, skip }: Args) => {
  const { data, loading } = useWorkspaceChooserRestrictedGuestsQuery({
    variables: {
      orgId,
      boardId,
    },
    skip: !orgId || !boardId || skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const hasBoardMemberRestrictions =
    data?.organization?.prefs?.boardInviteRestrict === 'org';

  const workspaceMemberIds =
    data?.organization?.members?.map((member) => member.id) || [];

  const boardMembersNotInWorkspace = (data?.board?.members || []).reduce(
    (excludedMembers: Member[], boardMember) => {
      if (!workspaceMemberIds.includes(boardMember.id)) {
        excludedMembers.push(boardMember);
      }
      return excludedMembers;
    },
    [],
  );

  return {
    hasBoardMemberRestrictions,
    boardMembersNotInWorkspace,
    loading,
  };
};
