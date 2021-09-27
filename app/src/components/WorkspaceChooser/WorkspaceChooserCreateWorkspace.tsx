import React, { useState, useCallback } from 'react';
import { forNamespace } from '@trello/i18n';
import styles from './WorkspaceChooserCreateWorkspace.less';
import { useWorkspaceChooserCreateWorkspaceMutation } from './WorkspaceChooserCreateWorkspaceMutation.generated';
import { useWorkspaceChooserAddBoardToWorkspaceMutation } from './WorkspaceChooserAddBoardToWorkspaceMutation.generated';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { TeamTypeSelect } from 'app/src/components/TeamTypeSelect';

const format = forNamespace('workspace-chooser');

interface WorkspaceChooserCreateWorkspaceProps {
  boardId: string;
  onSuccess: (workspaceId: string) => void;
}

export const WorkspaceChooserCreateWorkspace: React.FunctionComponent<WorkspaceChooserCreateWorkspaceProps> = ({
  boardId,
  onSuccess,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState<string>();
  const [isWorkspaceNameValid, setIsWorkspaceNameValid] = useState(false);
  const [createWorkspace] = useWorkspaceChooserCreateWorkspaceMutation();
  const [
    addBoardToWorkspace,
  ] = useWorkspaceChooserAddBoardToWorkspaceMutation();

  const isButtonEnabled =
    isWorkspaceNameValid && !!workspaceType && !isSubmitted;

  const onChangeWorkspaceName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newWorkspaceName = e?.target?.value;
      if (typeof newWorkspaceName !== 'undefined') {
        setWorkspaceName(newWorkspaceName);
        setIsWorkspaceNameValid(newWorkspaceName.trim().length > 0);
      }
    },
    [setWorkspaceName, setIsWorkspaceNameValid],
  );

  const onChangeWorkspaceType = useCallback(
    (workspaceTypeValue: string) => {
      setWorkspaceType(workspaceTypeValue);
    },
    [setWorkspaceType],
  );

  const onCreateWorkspaceSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();

      if (isButtonEnabled) {
        setIsSubmitted(true);

        try {
          const { data: createResponse } = await createWorkspace({
            variables: {
              type: 'default',
              displayName: workspaceName.trim(),
              teamType: workspaceType,
            },
          });

          const orgId = createResponse?.createOrganization?.id;

          if (orgId) {
            await addBoardToWorkspace({
              variables: { boardId, orgId },
            });

            onSuccess(orgId);
          }
        } catch {
          setIsSubmitted(false);
          // TODO error handling
        }
      }
    },
    [
      setIsSubmitted,
      createWorkspace,
      addBoardToWorkspace,
      workspaceName,
      workspaceType,
      boardId,
      isButtonEnabled,
      onSuccess,
    ],
  );

  return (
    <div className={styles.createWorkspace}>
      <label
        className={styles.createWorkspaceInputLabel}
        htmlFor="WorkspaceChooserCreateWorkspaceInput"
      >
        {format(['new-workspace-input-label'])}
      </label>
      <input
        id="WorkspaceChooserCreateWorkspaceInput"
        className={styles.createWorkspaceInput}
        type="text"
        autoComplete="off"
        spellCheck={false}
        onChange={onChangeWorkspaceName}
        autoFocus={true}
        placeholder={format(['new-team-input-placeholder'])}
        value={workspaceName}
        maxLength={100}
        disabled={isSubmitted}
      />
      <TeamTypeSelect
        onChange={onChangeWorkspaceType}
        isDisabled={isSubmitted}
      />
      <Button
        isDisabled={!isButtonEnabled}
        appearance="primary"
        className={styles.createWorkspaceButton}
        onClick={onCreateWorkspaceSubmit}
        size="fullwidth"
      >
        {isSubmitted ? (
          <Spinner centered />
        ) : (
          format(['submit-button-create-workspace'])
        )}
      </Button>
    </div>
  );
};
