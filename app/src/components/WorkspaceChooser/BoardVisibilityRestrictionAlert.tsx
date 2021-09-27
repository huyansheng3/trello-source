import React, { useState, useCallback } from 'react';
import { forNamespace } from '@trello/i18n';
import classNames from 'classnames';
import styles from './BoardVisibilityRestrictionAlert.less';
// eslint-disable-next-line no-restricted-imports
import { Board_Prefs_PermissionLevel } from '@trello/graphql/generated';
import { useWorkspaceChooserBoardVisibilityRestrictionAlertQuery } from './WorkspaceChooserBoardVisibilityRestrictionAlertQuery.generated';
import { Spinner } from '@trello/nachos/spinner';
import { CheckIcon } from '@trello/nachos/icons/check';
import { PublicIcon } from '@trello/nachos/icons/public';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { OrganizationIcon } from '@trello/nachos/icons/organization';

import { useRestrictedBoardVisibility } from './useRestrictedBoardVisibility';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { memberId } from '@trello/session-cookie';

const format = forNamespace('workspace-chooser');
const permissionsFormat = forNamespace('board perms');

interface BoardVisibilityRestrictionAlertProps {
  boardId: string;
  onSubmit: (visibility: Board_Prefs_PermissionLevel) => void;
  orgId: string;
}

export const BoardVisibilityRestrictionAlert: React.FunctionComponent<BoardVisibilityRestrictionAlertProps> = ({
  boardId,
  onSubmit,
  orgId,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    data,
    loading,
  } = useWorkspaceChooserBoardVisibilityRestrictionAlertQuery({
    variables: { orgId },
  });

  const {
    boardVisibility,
    loading: boardVisibilityRestrictionsLoading,
    workspaceAllowsPrivateBoards,
    workspaceAllowsPublicBoards,
    workspaceAllowsWorkspaceVisibleBoards,
    workspaceRestrictsAllBoardVisibilities,
  } = useRestrictedBoardVisibility({
    orgId,
    boardId,
  });

  const onClickPrivate = useCallback(() => {
    if (workspaceAllowsPrivateBoards && !isSubmitted) {
      setIsSubmitted(true);
      onSubmit(Board_Prefs_PermissionLevel.Private);
    }
  }, [workspaceAllowsPrivateBoards, isSubmitted, setIsSubmitted, onSubmit]);

  const onClickWorkspaceVisible = useCallback(() => {
    if (workspaceAllowsWorkspaceVisibleBoards && !isSubmitted) {
      setIsSubmitted(true);
      onSubmit(Board_Prefs_PermissionLevel.Org);
    }
  }, [
    workspaceAllowsWorkspaceVisibleBoards,
    isSubmitted,
    setIsSubmitted,
    onSubmit,
  ]);

  const onClickPublic = useCallback(() => {
    if (workspaceAllowsPublicBoards && !isSubmitted) {
      setIsSubmitted(true);
      onSubmit(Board_Prefs_PermissionLevel.Public);
    }
  }, [workspaceAllowsPublicBoards, isSubmitted, setIsSubmitted, onSubmit]);

  if (loading || boardVisibilityRestrictionsLoading) {
    return <Spinner centered />;
  }

  // It is possible that a BC workspace's settings are such that all board visibilities are restricted for some or all workspace members
  if (workspaceRestrictsAllBoardVisibilities) {
    const isWorkspaceAdmin = !!data?.organization?.memberships?.find(
      (membership) =>
        membership.idMember === memberId &&
        membership.memberType === 'admin' &&
        !membership.deactivated &&
        !membership.unconfirmed,
    );
    const orgName = (
      <strong key="orgName">{data?.organization?.displayName}</strong>
    );
    const messaging = isWorkspaceAdmin
      ? format('board-visibility-all-restricted', {
          orgName,
          teamSettingsPageLink: (
            <RouterLink
              key="settingsLink"
              href={`/${data?.organization?.name}/account`}
            >
              {format('workspace-board-visibility-settings-link')}
            </RouterLink>
          ),
        })
      : format('workspace-board-visibility-all-restricted-not-admin', {
          orgName,
        });

    return <p id="allVisibilitiesAreRestrictedMessaging">{messaging}</p>;
  }

  return (
    <>
      <p>
        {format('workspace-board-visibility-messaging', {
          orgName: (
            <strong key="orgName">{data?.organization?.displayName}</strong>
          ),
        })}
      </p>
      <div
        id="privateVisibilityOption"
        role="button"
        onClick={onClickPrivate}
        className={classNames(styles.boardVisibilityOption, {
          [styles.boardVisibilityOptionDisabled]:
            !workspaceAllowsPrivateBoards || isSubmitted,
        })}
      >
        <div className={styles.boardVisibilityOptionTitle}>
          <PrivateIcon
            dangerous_className={styles.boardVisibilityIcon}
            color="red"
            size="small"
          />
          {permissionsFormat(['private', 'name'])}
          {boardVisibility === 'private' && (
            <CheckIcon
              dangerous_className={styles.boardVisibilityIcon}
              size="small"
            />
          )}
        </div>
        <p className={styles.boardVisibilityOptionDescription}>
          {permissionsFormat(['private', 'short summary'])}
          &nbsp;
          {!workspaceAllowsPrivateBoards && (
            <span className={styles.boardVisibilityDisabledMessaging}>
              {format('workspace-board-visibility-option-disabled')}
            </span>
          )}
        </p>
      </div>
      <div
        id="workspaceVisibleVisibilityOption"
        role="button"
        onClick={onClickWorkspaceVisible}
        className={classNames(styles.boardVisibilityOption, {
          [styles.boardVisibilityOptionDisabled]:
            !workspaceAllowsWorkspaceVisibleBoards || isSubmitted,
        })}
      >
        <div className={styles.boardVisibilityOptionTitle}>
          <OrganizationIcon
            dangerous_className={styles.boardVisibilityIcon}
            size="small"
          />
          {permissionsFormat(['org', 'name'])}
          {boardVisibility === 'org' && (
            <CheckIcon
              dangerous_className={styles.boardVisibilityIcon}
              size="small"
            />
          )}
        </div>
        <p className={styles.boardVisibilityOptionDescription}>
          {permissionsFormat(['org', 'short summary'])}
          &nbsp;
          {!workspaceAllowsWorkspaceVisibleBoards && (
            <span className={styles.boardVisibilityDisabledMessaging}>
              {format('workspace-board-visibility-option-disabled')}
            </span>
          )}
        </p>
      </div>
      <div
        id="publicVisibilityOption"
        role="button"
        onClick={onClickPublic}
        className={classNames(styles.boardVisibilityOption, {
          [styles.boardVisibilityOptionDisabled]:
            !workspaceAllowsPublicBoards || isSubmitted,
        })}
      >
        <div className={styles.boardVisibilityOptionTitle}>
          <PublicIcon
            dangerous_className={styles.boardVisibilityIcon}
            color="green"
            size="small"
          />
          {permissionsFormat(['public', 'name'])}
          {boardVisibility === 'public' && (
            <CheckIcon
              dangerous_className={styles.boardVisibilityIcon}
              size="small"
            />
          )}
        </div>
        <p className={styles.boardVisibilityOptionDescription}>
          {permissionsFormat(['public', 'short summary'])}
          &nbsp;
          {!workspaceAllowsPublicBoards && (
            <span className={styles.boardVisibilityDisabledMessaging}>
              {format('workspace-board-visibility-option-disabled')}
            </span>
          )}
        </p>
      </div>
    </>
  );
};
