import { useRefetchWorkspaceOnNewBoard } from './useRefetchWorkspaceOnNewBoard';
import {
  useOrganizationViewsQuery,
  OrganizationViewsQuery,
} from './OrganizationViewsQuery.generated';
import {
  useGuestWorkspacesQuery,
  GuestWorkspacesQuery,
} from './GuestWorkspacesQuery.generated';
import {
  useWorkspaceMemberQuery,
  WorkspaceMemberQuery,
} from './WorkspaceMemberQuery.generated';
import {
  useWorkspaceDetailQuery,
  WorkspaceDetailQuery,
} from './WorkspaceDetailQuery.generated';

type Board = NonNullable<WorkspaceMemberQuery['member']>['boards'][number];
type Member = NonNullable<WorkspaceMemberQuery['member']>;
type Organization = WorkspaceDetailQuery['organization'];
type BoardStar = NonNullable<
  WorkspaceMemberQuery['member']
>['boardStars'][number];
type OrganizationViews = NonNullable<
  OrganizationViewsQuery['organization']
>['organizationViews'];
type GuestOrganization = NonNullable<
  GuestWorkspacesQuery['member']
>['guestOrganizations'][number];
import { ViewItem } from './CollapsibleViewsList';
import { ApolloError } from '@apollo/client';
import { forTemplate } from '@trello/i18n';
import { canViewTeamTablePage } from 'app/src/components/ViewsGenerics/canViewTeamTablePage';
import { ProductFeatures } from '@trello/product-features';
import { memberId } from '@trello/session-cookie';

const format = forTemplate('workspace_navigation');

const isMemberOfWorkspace = (
  idOrganizations: string[] = [],
  idWorkspace: string | null,
): boolean => {
  return idOrganizations.some((orgId) => orgId === idWorkspace);
};

export class MissingCurrentWorkspaceDataError extends Error {
  constructor() {
    const message = 'Data missing for current workspace.';
    super(message);
    this.name = 'MissingCurrentWorkspaceDataError';
  }
}

export type UserRelationshipToWorkspace =
  | 'PERSONAL'
  | 'GUEST'
  | 'MEMBER'
  | 'NONE';

interface WorkspaceBase {
  id: null | string;
  displayName: string;
  name: string | undefined;
  userRelationshipToWorkspace: UserRelationshipToWorkspace;
  logoHash: string | undefined | null;
  boards: Board[];
  boardStars: BoardStar[];
  views: ViewItem[];
  organizationViews?: OrganizationViews;
  idEnterprise: string | undefined | null;
  hasViewsFeature?: boolean;
  orgProducts: number[];
}

export interface PersonalWorkspace extends WorkspaceBase {
  id: null;
  name: undefined;
  userRelationshipToWorkspace: 'PERSONAL';
  logoHash: undefined;
  views: [];
}
export interface GuestWorkspace extends WorkspaceBase {
  id: string;
  name: undefined;
  userRelationshipToWorkspace: 'GUEST';
  views: [];
}
export interface MemberWorkspace extends WorkspaceBase {
  id: string;
  name: string;
  userRelationshipToWorkspace: 'MEMBER';
}
export interface NoRelationshipWorkspace {
  userRelationshipToWorkspace: 'NONE';
  displayName?: string | null;
  logoHash?: string | null;
}

export type Workspace =
  | PersonalWorkspace
  | MemberWorkspace
  | GuestWorkspace
  | NoRelationshipWorkspace;

export const getViewsForCurrentWorkspace = ({
  organization,
  isOrganizationDefaultViewsEnabled,
  isWorkspaceCalendarEnabled,
}: {
  organization: {
    premiumFeatures: string[];
    products: number[];
    name: string;
  };
  isOrganizationDefaultViewsEnabled?: boolean;
  isWorkspaceCalendarEnabled?: boolean;
}): ViewItem[] => {
  const views: ViewItem[] = [];
  const hasViewsFeature = organization.premiumFeatures.includes('views');
  const isBusinessClass = ProductFeatures.isBusinessClassProduct(
    organization.products?.[0],
  );
  const isEnterprise = ProductFeatures.isEnterpriseProduct(
    organization.products?.[0],
  );

  // Only teams that won't have this are legacy BC
  if (canViewTeamTablePage(hasViewsFeature, isBusinessClass || isEnterprise)) {
    // only true BC teams get default views
    if (hasViewsFeature && isOrganizationDefaultViewsEnabled) {
      views.push({
        title: format('my-work'),
        linkName: 'organizationMyWorkViewLink',
        href: `/${organization.name}/views/my-work`,
        iconName: 'table',
        prefs: {
          permissionLevel: 'private',
        },
      });
    }
    // (just about) all teams can see the workspace table/custom view
    if (isOrganizationDefaultViewsEnabled) {
      views.push({
        title: format('custom-view'),
        linkName: 'organizationCustomViewLink',
        href: `/${organization.name}/views/table`,
        iconName: 'table',
      });
    } else {
      views.push({
        title: format('team-table'),
        linkName: 'teamTableLink',
        href: `/${organization.name}/tables`,
        iconName: 'table',
      });
    }

    if (isWorkspaceCalendarEnabled) {
      views.push({
        title: format('workspace-calendar'),
        linkName: 'workspaceCalendarLink',
        href: `/${organization.name}/views/calendar`,
        iconName: 'calendar',
      });
    }
  }

  return views;
};

interface GetWorkspaceData {
  idWorkspace: string | null;
  idBoard?: string;
  member: Member;
  organization: Organization;
  isOrganizationDefaultViewsEnabled?: boolean;
  guestOrganizations?: GuestOrganization[];
  isWorkspaceCalendarEnabled?: boolean;
}

const getWorkspaceData = ({
  idWorkspace,
  idBoard,
  member,
  organization,
  isOrganizationDefaultViewsEnabled,
  guestOrganizations,
  isWorkspaceCalendarEnabled,
}: GetWorkspaceData): Workspace => {
  const openBoards = member.boards.filter((board) => !board.closed);

  if (
    isMemberOfWorkspace(member.idOrganizations, idWorkspace) &&
    organization
  ) {
    // Member of Workspace
    const boards = openBoards.filter(
      (board) => board.idOrganization === idWorkspace,
    );

    const hasViewsFeature =
      organization.premiumFeatures?.includes('views') ?? false;

    return {
      id: organization.id,
      displayName: organization.displayName,
      name: organization.name,
      logoHash: organization.logoHash,
      userRelationshipToWorkspace: 'MEMBER',
      boards,
      boardStars: member.boardStars,
      views: getViewsForCurrentWorkspace({
        organization,
        isOrganizationDefaultViewsEnabled,
        isWorkspaceCalendarEnabled,
      }),
      organizationViews: [],
      idEnterprise: organization.idEnterprise,
      hasViewsFeature,
      orgProducts: organization.products || [],
    };
  }

  const guestWorkspace = guestOrganizations?.find(
    (org) => org.id === idWorkspace,
  );

  if (guestWorkspace) {
    // Guest of workspace

    const boards = openBoards.filter(
      (board) => board.idOrganization === idWorkspace,
    );

    return {
      id: guestWorkspace.id,
      displayName: guestWorkspace.displayName,
      name: undefined,
      logoHash: guestWorkspace.logoHash,
      userRelationshipToWorkspace: 'GUEST',
      boards,
      boardStars: member.boardStars,
      views: [],
      organizationViews: [],
      idEnterprise: undefined,
      orgProducts: [],
    };
  }

  const isMemberOfBoard = idBoard && !!openBoards.find((b) => b.id === idBoard);

  if (isMemberOfBoard) {
    // Personal Workspace
    const boards = openBoards.filter((board) => !board.idOrganization);
    return {
      id: null,
      displayName: format('personal-boards'),
      name: undefined,
      logoHash: undefined,
      userRelationshipToWorkspace: 'PERSONAL',
      boards,
      boardStars: member.boardStars,
      views: [],
      idEnterprise: null,
      orgProducts: [],
    };
  }

  return {
    userRelationshipToWorkspace: 'NONE',
    displayName: organization?.displayName,
    logoHash: organization?.logoHash,
  };
};

interface UseCurrentWorkspaceReturn {
  workspace: undefined | Workspace;
  error: ApolloError | Error | undefined;
  loading: boolean;
  refetch: () => void;
}

interface WorkspacePresentReturn extends UseCurrentWorkspaceReturn {
  error: undefined;
  workspace: Workspace;
  loading: false;
}

interface WorkspaceErrorReturn extends UseCurrentWorkspaceReturn {
  workspace: undefined;
  error: ApolloError | Error;
}

interface WorkspaceLoadingReturn extends UseCurrentWorkspaceReturn {
  loading: true;
}

interface WorkspaceSkippedReturn extends UseCurrentWorkspaceReturn {
  skipped: true;
}

export const useCurrentWorkspace = ({
  idWorkspace,
  idBoard,
  skip,
  isOrganizationDefaultViewsEnabled,
  isWorkspaceCalendarEnabled,
}: {
  idWorkspace: string | null;
  idBoard?: string;
  skip?: boolean;
  isOrganizationDefaultViewsEnabled?: boolean;
  isWorkspaceCalendarEnabled?: boolean;
}):
  | WorkspacePresentReturn
  | WorkspaceErrorReturn
  | WorkspaceLoadingReturn
  | WorkspaceSkippedReturn => {
  const {
    data: memberData,
    error: memberError,
    loading: memberLoading,
    refetch: memberRefetch,
  } = useWorkspaceMemberQuery({
    variables: {
      memberId: memberId || '',
    },
    skip,
  });

  const skipWorkspaceDetailQuery = skip || !idWorkspace;
  const {
    data: workspaceData,
    error: workspaceError,
    loading: workspaceLoading,
    refetch: workspaceRefetch,
  } = useWorkspaceDetailQuery({
    // idWorkspace is null for personal workspaces
    variables: {
      orgId: idWorkspace,
    },
    notifyOnNetworkStatusChange: true,
    skip: skipWorkspaceDetailQuery,
  });

  const memberOfWorkspace = isMemberOfWorkspace(
    memberData?.member?.idOrganizations,
    idWorkspace,
  );

  const { data: organizationViewsData } = useOrganizationViewsQuery({
    variables: {
      orgId: idWorkspace!,
    },
    notifyOnNetworkStatusChange: true,
    skip: !memberOfWorkspace || !idWorkspace,
  });

  const {
    data: guestWorkspacesData,
    error: guestWorkspacesError,
    loading: guestWorkspacesLoading,
  } = useGuestWorkspacesQuery({
    // only run query when we know user is guest of current workspace
    variables: {
      memberId: memberId as string,
    },
    skip:
      // TODO: Remove skip if no idWorkspace when personal boards removed
      !idWorkspace ||
      // skip if the member data hasn't loaded yet
      !memberData?.member ||
      memberOfWorkspace,
  });

  useRefetchWorkspaceOnNewBoard(idWorkspace);

  const refetch = () => {
    memberRefetch();
    workspaceRefetch();
  };

  if (skip) {
    return {
      error: undefined,
      workspace: undefined,
      loading: false,
      skipped: true,
      refetch,
    };
  }

  const error = memberError || workspaceError || guestWorkspacesError;
  if (error) {
    return {
      workspace: undefined,
      error,
      loading: false,
      refetch,
    };
  }

  const loading = memberLoading || workspaceLoading || guestWorkspacesLoading;
  if (loading) {
    return {
      workspace: undefined,
      error: undefined,
      loading,
      refetch,
    };
  }

  if (
    !memberData ||
    !memberData.member ||
    (!workspaceData && !skipWorkspaceDetailQuery)
  ) {
    const error = new MissingCurrentWorkspaceDataError();
    return {
      workspace: undefined,
      error,
      loading: false,
      refetch,
    };
  }

  const { member } = memberData;
  const organization = workspaceData?.organization;

  const workspace = getWorkspaceData({
    idWorkspace,
    idBoard,
    member,
    organization,
    isOrganizationDefaultViewsEnabled,
    guestOrganizations: guestWorkspacesData?.member?.guestOrganizations,
    isWorkspaceCalendarEnabled,
  });

  if (
    workspace.userRelationshipToWorkspace === 'MEMBER' &&
    organizationViewsData?.organization
  ) {
    workspace.organizationViews =
      organizationViewsData.organization.organizationViews;
  }

  return {
    workspace,
    error,
    loading,
    refetch,
  };
};
