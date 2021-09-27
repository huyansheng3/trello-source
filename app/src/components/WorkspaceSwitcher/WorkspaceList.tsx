import React from 'react';

import { WorkspaceSwitcherTestIds } from '@trello/test-ids';
import { WorkspaceListItem } from './WorkspaceListItem';
import { CreateTeamButton } from 'app/src/components/WorkspaceNavigation/CreateTeamButton';
import styles from './WorkspaceList.less';
import { forTemplate } from '@trello/i18n';
import {
  Enterprise,
  GuestWorkspace,
  PersonalWorkspace,
  MemberWorkspace,
  Workspace,
} from './useAllWorkspaces';
import classNames from 'classnames';
import { WorkspaceLogo } from 'app/src/components/WorkspaceLogo';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';

const format = forTemplate('workspace_switcher', {
  shouldEscapeStrings: false,
});

interface WorkspaceListViewProps {
  workspaces: Workspace[];
  onClickWorkspace: (orgId?: string) => void;
  idWorkspace?: string | null;
  isGlobal?: boolean;
  onCreateTeamOverlayOpen: () => void;
  // We hide the create workspace button from showing in the popover
  // because currently it opens a second popover _behind_ the first
  hideCreateWorkspaceButton?: boolean;
}

export const WorkspaceList = ({
  workspaces,
  idWorkspace,
  isGlobal,
  onCreateTeamOverlayOpen,
  onClickWorkspace,
  hideCreateWorkspaceButton,
}: WorkspaceListViewProps) => {
  let personalWorkspace: PersonalWorkspace | undefined = undefined;
  const memberWorkspaces: MemberWorkspace[] = [];
  const guestWorkspaces: GuestWorkspace[] = [];
  const enterpriseWorkspaces: MemberWorkspace[] = [];
  const userEnterprises: Map<string, Enterprise> = new Map<
    string,
    Enterprise
  >();

  for (const workspace of workspaces) {
    switch (workspace.userRelationshipToWorkspace) {
      case 'PERSONAL':
        personalWorkspace = workspace;
        break;
      case 'MEMBER':
        if (workspace.enterprise?.id) {
          enterpriseWorkspaces.push(workspace);
          if (!userEnterprises.has(workspace.enterprise.id)) {
            userEnterprises.set(workspace.enterprise.id, workspace.enterprise);
          }
        } else {
          memberWorkspaces.push(workspace);
        }

        break;
      case 'GUEST':
        guestWorkspaces.push(workspace);
        break;
      default:
        break;
    }
  }

  const currentWorkspace = workspaces.find((workspace): workspace is
    | MemberWorkspace
    | GuestWorkspace => {
    return (
      (workspace.userRelationshipToWorkspace === 'GUEST' ||
        workspace.userRelationshipToWorkspace === 'MEMBER') &&
      workspace.id === idWorkspace
    );
  });
  const showCurrentWorkspace = !isGlobal && idWorkspace && currentWorkspace;
  return (
    <div data-test-id={WorkspaceSwitcherTestIds.WorkspaceList}>
      {memberWorkspaces.length > 0 ? (
        <>
          {showCurrentWorkspace && (
            <>
              <div className={styles.teamsHeaderRow}>
                <p
                  className={styles.currentWorkspaceListSectionHeader}
                  data-test-id={
                    WorkspaceSwitcherTestIds.CurrentWorkspaceListSectionHeader
                  }
                >
                  {format('current-team')}
                </p>
              </div>
              <WorkspaceListItem
                key={currentWorkspace!.id}
                logoHash={currentWorkspace!.logoHash}
                displayName={currentWorkspace!.displayName}
              />
              <div className={styles.currentWorkspaceBottomDivider} />
            </>
          )}
        </>
      ) : null}
      {enterpriseWorkspaces.length > 0 ? (
        <>
          {Array.from(userEnterprises.values())
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((enterprise) => {
              return (
                <div key={enterprise.id} className={styles.enterpriseContainer}>
                  <div className={styles.enterpriseHeader}>
                    {enterprise.logoHash ? (
                      <WorkspaceLogo
                        logoHash={enterprise.logoHash}
                        name={enterprise.displayName}
                        size={'medium'}
                      />
                    ) : (
                      <EnterpriseIcon
                        size="large"
                        color="quiet"
                        dangerous_className={styles.enterpriseIcon}
                      />
                    )}
                    <p className={styles.enterpriseName}>
                      {enterprise.displayName}
                    </p>
                  </div>
                  <p className={styles.enterpriseListSectionHeader}>
                    {format('your-enterprise-teams', {
                      enterpriseName: enterprise.displayName,
                    })}
                  </p>
                  {enterpriseWorkspaces
                    .filter(
                      (workspace) => workspace.enterprise?.id === enterprise.id,
                    )
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((org) => {
                      const href = `/${org.name}`;

                      return (
                        <WorkspaceListItem
                          href={href}
                          key={href}
                          // eslint-disable-next-line react/jsx-no-bind
                          onClick={() => onClickWorkspace(org.id)}
                          logoHash={org.logoHash}
                          displayName={org.displayName}
                        />
                      );
                    })}
                </div>
              );
            })}
        </>
      ) : null}
      {memberWorkspaces.length > 0 ? (
        <>
          <div className={styles.teamsHeaderRow}>
            <p
              className={styles.workspacesListSectionHeader}
              data-test-id={
                WorkspaceSwitcherTestIds.MemberWorkspacesListSectionHeader
              }
            >
              {format('your-teams')}
            </p>
            {!hideCreateWorkspaceButton && (
              <span className={styles.createTeamButton} role="button">
                <CreateTeamButton
                  data-test-id={WorkspaceSwitcherTestIds.CreateTeamPlusButton}
                  analyticsSource="listWorkspaceNavigationDrawer"
                  currentWorkspaceId={idWorkspace}
                  onCreateTeamButtonClick={onCreateTeamOverlayOpen}
                />
              </span>
            )}
          </div>
          {memberWorkspaces
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((org) => {
              const href = `/${org.name}`;

              return (
                <WorkspaceListItem
                  href={href}
                  key={href}
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => onClickWorkspace(org.id)}
                  logoHash={org.logoHash}
                  displayName={org.displayName}
                />
              );
            })}
        </>
      ) : null}
      {guestWorkspaces.length > 0 ? (
        <>
          <p
            className={styles.workspacesListSectionHeader}
            data-test-id={
              WorkspaceSwitcherTestIds.GuestWorkspacesListSectionHeader
            }
          >
            {format('guest-teams')}
          </p>
          {guestWorkspaces
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((org, index) => (
              <WorkspaceListItem
                href={org.urlMostRecentlyViewedBoard}
                key={org.urlMostRecentlyViewedBoard}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => onClickWorkspace(org.id)}
                logoHash={org.logoHash}
                displayName={org.displayName}
              />
            ))}
        </>
      ) : null}
      {personalWorkspace ? (
        <>
          <div
            className={classNames({
              [styles.personalWorkspaceTopDivider]:
                memberWorkspaces.length > 0 || guestWorkspaces.length > 0,
            })}
          />
          <div>
            <WorkspaceListItem
              data-test-id={WorkspaceSwitcherTestIds.PersonalWorkspaceListItem}
              href={
                personalWorkspace.urlMostRecentlyViewedBoard ||
                `/${personalWorkspace.name}/boards`
              }
              onClick={onClickWorkspace}
              displayName={personalWorkspace.displayName}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
