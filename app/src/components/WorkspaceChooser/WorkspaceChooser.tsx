import React, { useEffect, useState, useCallback } from 'react';
import { memberId } from '@trello/session-cookie';
import { usePopover, Popover, PopoverScreen } from '@trello/nachos/popover';
import { useWorkspaceChooserQuery } from './WorkspaceChooserQuery.generated';
import { useWorkspaceChooserAddBoardToWorkspaceMutation } from './WorkspaceChooserAddBoardToWorkspaceMutation.generated';
import { useWorkspaceChooserChangeBoardVisibilityMutation } from './WorkspaceChooserChangeBoardVisibilityMutation.generated';
import { useWorkspaceChooserNewBillableGuestsQuery } from './WorkspaceChooserNewBillableGuestsQuery.generated';
// eslint-disable-next-line no-restricted-imports
import { Board_Prefs_PermissionLevel } from '@trello/graphql/generated';
import { useRestrictedBoardVisibility } from './useRestrictedBoardVisibility';
import { useRestrictedGuests } from './useRestrictedGuests';
import { BoardMemberRestrictionAlert } from './BoardMemberRestrictionAlert';
import { BoardVisibilityRestrictionAlert } from './BoardVisibilityRestrictionAlert';
import { NewBillableGuestsAlert } from './NewBillableGuestsAlert';
import { WorkspaceChooserCreateWorkspace } from './WorkspaceChooserCreateWorkspace';
import { WorkspaceChooserSelectWorkspace } from './WorkspaceChooserSelectWorkspace';
import { forNamespace } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import styles from './WorkspaceChooser.less';

const format = forNamespace('workspace-chooser');

export interface WorkspaceChooserProps {
  boardId: string;
  onSuccess?: (workspaceId?: string) => void;
  buttonText: string;
  shouldFitContainer?: boolean;
}

enum Screens {
  SelectWorkspace,
  CreateWorkspace,
  BoardMemberRestriction,
  BoardVisibilityRestriction,
  NewBillableGuests,
}

export const WorkspaceChooser: React.FunctionComponent<WorkspaceChooserProps> = ({
  boardId,
  onSuccess,
  buttonText,
  shouldFitContainer = true,
}) => {
  const { data, loading } = useWorkspaceChooserQuery({
    variables: {
      boardId,
      memberId: memberId || 'me',
    },
  });
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(
    data?.board?.idOrganization || '',
  );
  const [
    isBoardMemberRestrictionResolved,
    setIsBoardMemberRestrictionResolved,
  ] = useState(false);
  const [
    boardVisibilityRestrictionResolution,
    setBoardVisibilityRestrictionResolution,
  ] = useState('' as Board_Prefs_PermissionLevel);
  const [
    isNewBillableGuestsResolved,
    setIsNewBillableGuestsResolved,
  ] = useState(false);

  const {
    data: newBillableGuestsData,
  } = useWorkspaceChooserNewBillableGuestsQuery({
    variables: { boardId, orgId: selectedWorkspaceId },
    skip: selectedWorkspaceId === '',
  });

  const {
    hasBoardMemberRestrictions,
    boardMembersNotInWorkspace,
    loading: restrictedGuestsLoading,
  } = useRestrictedGuests({
    orgId: selectedWorkspaceId,
    boardId,
    skip: data?.board?.members?.length === 1,
  });

  const {
    loading: boardVisibilityRestrictionsLoading,
    workspaceRestrictsCurrentBoardVisibility,
  } = useRestrictedBoardVisibility({
    orgId: selectedWorkspaceId,
    boardId,
  });

  const [
    addBoardToWorkspace,
  ] = useWorkspaceChooserAddBoardToWorkspaceMutation();
  const [
    updateBoardVisibility,
  ] = useWorkspaceChooserChangeBoardVisibilityMutation();

  const isMemberOfWorkspace = Boolean(data?.member?.idOrganizations?.length);
  const usePopoverArgs = loading
    ? {}
    : {
        initialScreen: isMemberOfWorkspace
          ? Screens.SelectWorkspace
          : Screens.CreateWorkspace,
      };

  const {
    popoverProps,
    push,
    toggle: togglePopover,
    triggerRef,
  } = usePopover<HTMLButtonElement>(usePopoverArgs);

  useEffect(() => {
    // Reset resolutions when the workspace is changed or the popover is closed
    setIsBoardMemberRestrictionResolved(false);
    setBoardVisibilityRestrictionResolution('' as Board_Prefs_PermissionLevel);
  }, [
    popoverProps.isVisible,
    selectedWorkspaceId,
    setIsBoardMemberRestrictionResolved,
    setBoardVisibilityRestrictionResolution,
  ]);

  const onSelectWorkspaceSubmit = useCallback(
    async (options?: {
      boardMemberRestrictionResolved?: boolean;
      boardVisibilityRestrictionResolution?: Board_Prefs_PermissionLevel;
      newBillableGuestsResolved?: boolean;
    }) => {
      /**
       * If adding the board to the workspace will result in removing board members, stop
       * and notify the user. If not, continue add the board to the workspace. The
       * BoardMemberRestriction popover screen will notify the user and allow them to
       * continue or return to the workspace selection step.
       */
      if (
        hasBoardMemberRestrictions &&
        boardMembersNotInWorkspace.length &&
        !options?.boardMemberRestrictionResolved &&
        !isBoardMemberRestrictionResolved
      ) {
        push(Screens.BoardMemberRestriction);
        return;
      }

      /**
       * If adding the board to the workspace will result in new billable guests, stop
       * and notify the user. If not, continue to add the board to the workspace. The
       * NewBillableGuests popover screen will notify the user and allow them to
       * continue or return to the workspace selection step.
       */
      if (
        newBillableGuestsData?.organization?.newBillableGuests?.length &&
        !options?.newBillableGuestsResolved &&
        !isNewBillableGuestsResolved
      ) {
        push(Screens.NewBillableGuests);
        return;
      }

      /**
       * If the board's visibility is restricted by the workspace, stop and notify the user.
       * The BoardVisibilityRestriction popover screen will notify the user and allow
       * them to choose another visibility for the board or return to the workspace selection
       * step.
       */
      if (
        workspaceRestrictsCurrentBoardVisibility &&
        !options?.boardVisibilityRestrictionResolution &&
        !boardVisibilityRestrictionResolution
      ) {
        push(Screens.BoardVisibilityRestriction);
        return;
      }

      try {
        /**
         * If the user is a workspace admin, they can keep new billable guests. The
         * user will already have been notified of any new billable guests in the
         * NewBillableGuests popover screen.
         */
        const keepBillableGuests = !!newBillableGuestsData?.organization?.memberships?.find(
          (membership) =>
            membership.idMember === memberId &&
            membership.memberType === 'admin',
        );

        /**
         * If we need to set a new visibility, we'll need to do that while moving
         * to the workspace. This is the only way Workspace Visible can be chosen as an option.
         * Otherwise, we can simply move the board to the workspace.
         */
        if (
          options?.boardVisibilityRestrictionResolution ||
          boardVisibilityRestrictionResolution
        ) {
          const newVisibility =
            options?.boardVisibilityRestrictionResolution ||
            boardVisibilityRestrictionResolution;
          await updateBoardVisibility({
            variables: {
              boardId,
              visibility: newVisibility,
              orgId: selectedWorkspaceId,
              keepBillableGuests,
            },
          });
        } else {
          await addBoardToWorkspace({
            variables: {
              boardId,
              orgId: selectedWorkspaceId,
              keepBillableGuests,
            },
          });
        }

        if (onSuccess) {
          onSuccess(selectedWorkspaceId);
        }
      } catch (err) {
        // TODO error handling
      }
    },
    [
      addBoardToWorkspace,
      boardId,
      boardMembersNotInWorkspace.length,
      boardVisibilityRestrictionResolution,
      hasBoardMemberRestrictions,
      isBoardMemberRestrictionResolved,
      isNewBillableGuestsResolved,
      newBillableGuestsData,
      onSuccess,
      push,
      selectedWorkspaceId,
      updateBoardVisibility,
      workspaceRestrictsCurrentBoardVisibility,
    ],
  );

  const onCreateWorkspaceSuccessCallback = useCallback(
    (workspaceId: string) => {
      if (onSuccess) {
        onSuccess(workspaceId);
      }
    },
    [onSuccess],
  );

  const onNewBillableGuestsAlertSubmit = useCallback(() => {
    setIsNewBillableGuestsResolved(true);
    onSelectWorkspaceSubmit({ newBillableGuestsResolved: true });
  }, [setIsNewBillableGuestsResolved, onSelectWorkspaceSubmit]);

  const onSelectCreateWorkspace = useCallback(() => {
    push(Screens.CreateWorkspace);
  }, [push]);

  const onBoardMemberRestrictionAlertCancel = useCallback(() => {
    push(Screens.SelectWorkspace);
  }, [push]);

  const onBoardMemberRestrictionAlertSubmit = useCallback(() => {
    setIsBoardMemberRestrictionResolved(true);
    onSelectWorkspaceSubmit({ boardMemberRestrictionResolved: true });
  }, [setIsBoardMemberRestrictionResolved, onSelectWorkspaceSubmit]);

  const onBoardVisibilityRestrictionAlertSubmit = useCallback(
    (visibility: Board_Prefs_PermissionLevel) => {
      setBoardVisibilityRestrictionResolution(visibility);
      onSelectWorkspaceSubmit({
        boardVisibilityRestrictionResolution: visibility,
      });
    },
    [setBoardVisibilityRestrictionResolution, onSelectWorkspaceSubmit],
  );

  return (
    <>
      <Button
        appearance="primary"
        className={styles.workspaceChooserTriggerButton}
        onClick={togglePopover}
        ref={triggerRef}
        shouldFitContainer={shouldFitContainer}
      >
        {buttonText}
      </Button>
      <Popover
        {...popoverProps}
        title={
          isMemberOfWorkspace
            ? format('popover-title-add-to-workspace')
            : format('popover-title-create-workspace')
        }
      >
        <PopoverScreen id={Screens.SelectWorkspace}>
          <WorkspaceChooserSelectWorkspace
            boardId={boardId}
            isLoadingSelectedWorkspace={
              restrictedGuestsLoading || boardVisibilityRestrictionsLoading
            }
            onSelectWorkspace={setSelectedWorkspaceId}
            onSelectCreateWorkspace={onSelectCreateWorkspace}
            onSubmit={onSelectWorkspaceSubmit}
            selectedWorkspaceId={selectedWorkspaceId}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.CreateWorkspace}>
          <WorkspaceChooserCreateWorkspace
            boardId={boardId}
            onSuccess={onCreateWorkspaceSuccessCallback}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.BoardMemberRestriction}>
          <BoardMemberRestrictionAlert
            boardId={boardId}
            onCancel={onBoardMemberRestrictionAlertCancel}
            onSubmit={onBoardMemberRestrictionAlertSubmit}
            orgId={selectedWorkspaceId}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.BoardVisibilityRestriction}>
          <BoardVisibilityRestrictionAlert
            boardId={boardId}
            onSubmit={onBoardVisibilityRestrictionAlertSubmit}
            orgId={selectedWorkspaceId}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.NewBillableGuests}>
          <NewBillableGuestsAlert onSubmit={onNewBillableGuestsAlertSubmit} />
        </PopoverScreen>
      </Popover>
    </>
  );
};
