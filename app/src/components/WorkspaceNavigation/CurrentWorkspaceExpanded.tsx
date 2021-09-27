import React, { useEffect, useCallback } from 'react';
import styles from './CurrentWorkspaceExpanded.less';
import { WorkspaceDetail } from './WorkspaceDetail';
import { BoardsList } from './BoardsList';
import { BoardsListItemProps } from './BoardsListItem';
import { FeedbackLink } from './FeedbackLink';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { MoveIcon } from '@trello/nachos/icons/move';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { Analytics } from '@trello/atlassian-analytics';
import {
  UserRelationshipToWorkspace,
  PersonalWorkspace,
  MemberWorkspace,
  GuestWorkspace,
} from './useCurrentWorkspace';
import { WorkspaceMemberQuery } from './WorkspaceMemberQuery.generated';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import { Util } from 'app/scripts/lib/util';
import { forTemplate } from '@trello/i18n';
import {
  CollapsibleViewsList,
  WorkspaceViewProps,
  ViewItem,
} from './CollapsibleViewsList';
import { EnterpriseNamePanel } from './EnterpriseNamePanel';

const format = forTemplate('workspace_navigation');

type BoardStar = NonNullable<
  WorkspaceMemberQuery['member']
>['boardStars'][number];

interface CurrentWorkspaceExpandedUnconnectedProps {
  userRelationshipToWorkspace: UserRelationshipToWorkspace;
  boards: BoardsListItemProps[];
  boardStars: BoardStar[];
  views: ViewItem[];
  displayName: string;
  id?: string;
  name?: string;
  logoHash?: string;
  toggleVisibility: () => void;
  organizationViews?: WorkspaceViewProps[];
  idEnterprise: string | undefined | null;
  hasViewsFeature: boolean;
  orgProducts: number[];
}

export const CurrentWorkspaceExpandedUnconnected: React.FunctionComponent<CurrentWorkspaceExpandedUnconnectedProps> = ({
  userRelationshipToWorkspace,
  boards,
  boardStars,
  views,
  displayName,
  id,
  name,
  logoHash,
  toggleVisibility,
  organizationViews,
  idEnterprise,
  hasViewsFeature,
  orgProducts,
}) => {
  const onSeeAllTeamBoardsClick = useCallback(
    function onSeeAllTeamBoardsClick() {
      Analytics.sendClickedLinkEvent({
        linkName: 'seeAllTeamBoardsLink',
        source: 'currentWorkspaceNavigationDrawer',
        containers: {
          organization: {
            id,
          },
          enterprise: {
            id: idEnterprise,
          },
        },
      });
    },
    [id, idEnterprise],
  );

  useEffect(
    function sendScreenEvent() {
      Analytics.sendScreenEvent({
        name: 'currentWorkspaceNavigationDrawer',
        containers: {
          organization: {
            id,
          },
          enterprise: {
            id: idEnterprise,
          },
        },
      });
    },
    [id, idEnterprise],
  );

  return (
    <div
      className={styles.container}
      data-test-id={WorkspaceNavigationTestIds.CurrentWorkspaceExpanded}
    >
      <div className={styles.workspaceDetailContainer}>
        <WorkspaceDetail
          name={name}
          displayName={displayName}
          userRelationshipToWorkspace={userRelationshipToWorkspace}
          logoHash={logoHash}
          orgId={id}
          toggleVisibility={toggleVisibility}
          orgProducts={orgProducts}
        />
      </div>
      <div
        className={styles.boardsListsContainer}
        data-test-id={WorkspaceNavigationTestIds.WorkspaceBoardsAndViewsLists}
      >
        <div>
          {views.length > 0 && (
            <CollapsibleViewsList
              views={views}
              idOrganization={id}
              organizationViews={organizationViews}
              idEnterprise={idEnterprise}
              hasViewsFeature={hasViewsFeature}
            />
          )}
          <BoardsList
            boards={boards}
            data-test-id={WorkspaceNavigationTestIds.AllBoardsList}
            orgId={id}
            boardStars={boardStars}
            userRelationshipToWorkspace={userRelationshipToWorkspace}
          />
        </div>
        {name && !(userRelationshipToWorkspace === 'PERSONAL') ? (
          <RouterLink
            href={`/${name}`}
            onClick={onSeeAllTeamBoardsClick}
            className={styles.linkAllTeamBoards}
            data-test-id={WorkspaceNavigationTestIds.SeeAllTeamBoardsLink}
          >
            <div className={styles.linkAllTeamBoardsContent}>
              <p className={styles.linkAllTeamBoardsText}>
                {format('see-all-team-boards')}
              </p>
              <div className={styles.moveIconContainer}>
                <MoveIcon
                  color="quiet"
                  size="small"
                  dangerous_className={styles.moveIcon}
                />
              </div>
            </div>
          </RouterLink>
        ) : null}
      </div>
      {userRelationshipToWorkspace === 'GUEST' && (
        <div
          data-test-id={WorkspaceNavigationTestIds.GuestWorkspaceDisclaimer}
          className={styles.guestDisclaimer}
        >
          <OrganizationIcon size="small" />
          <p className={styles.guestDisclaimerText}>
            {format('guest-board-disclamer')}
          </p>
        </div>
      )}
      <div className={styles.footer}>
        {!!idEnterprise && !!id ? (
          <EnterpriseNamePanel orgId={id} />
        ) : (
          <FeedbackLink orgId={id} />
        )}
      </div>
    </div>
  );
};

type Board = NonNullable<WorkspaceMemberQuery['member']>['boards'][number];

const mapBoardToBoardItem = (board: Board): BoardsListItemProps => {
  return {
    id: board.id,
    name: board.name,
    isTemplate: board.prefs?.isTemplate || false,
    href: Util.relativeUrl(board.url),
    dateLastActivity: board.dateLastActivity || undefined,
    dateLastView: board.dateLastView || undefined,
    permissionLevel: board.prefs?.permissionLevel,
    backgroundColor: board.prefs?.backgroundColor || undefined,
    backgroundUrl: board.prefs?.backgroundImageScaled
      ? (
          smallestPreviewBiggerThan(
            board.prefs.backgroundImageScaled,
            24,
            24,
          ) || {}
        ).url
      : board.prefs?.backgroundImage || undefined,
  };
};

interface CurrentWorkspaceExpandedProps {
  toggleVisibility: () => void;
  workspace: PersonalWorkspace | MemberWorkspace | GuestWorkspace;
}

export const CurrentWorkspaceExpanded: React.FunctionComponent<CurrentWorkspaceExpandedProps> = ({
  toggleVisibility,
  workspace,
}) => {
  return (
    <CurrentWorkspaceExpandedUnconnected
      userRelationshipToWorkspace={workspace.userRelationshipToWorkspace}
      boards={workspace.boards.map(mapBoardToBoardItem)}
      boardStars={workspace.boardStars}
      toggleVisibility={toggleVisibility}
      id={workspace.id || undefined}
      displayName={workspace.displayName}
      name={workspace.name}
      logoHash={workspace.logoHash || undefined}
      views={workspace.views}
      organizationViews={workspace.organizationViews}
      hasViewsFeature={workspace.hasViewsFeature ?? false}
      idEnterprise={workspace.idEnterprise}
      orgProducts={workspace.orgProducts}
    />
  );
};
