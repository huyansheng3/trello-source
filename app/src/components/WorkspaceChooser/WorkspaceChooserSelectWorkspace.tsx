import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { memberId } from '@trello/session-cookie';
import { forNamespace } from '@trello/i18n';
import { useWorkspaceChooserSelectWorkspaceQuery } from './WorkspaceChooserSelectWorkspaceQuery.generated';
import styles from './WorkspaceChooserSelectWorkspace.less';
import { Select } from '@trello/nachos/select';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { isManaged } from '@trello/enterprise';

const format = forNamespace('workspace-chooser');

interface WorkspaceChooserSelectWorkspaceProps {
  boardId: string;
  isLoadingSelectedWorkspace: boolean;
  onSelectCreateWorkspace: () => void;
  onSelectWorkspace: (selectedWorkspaceId: string) => void;
  onSubmit: () => void;
  selectedWorkspaceId: string;
}

type WorkspaceSelectOptions = {
  label: string;
  value: string;
  isDisabled?: boolean;
  meta?: string;
}[];

const CREATE_NEW_WORKSPACE = 'CREATE_NEW_WORKSPACE';

export const WorkspaceChooserSelectWorkspace: React.FunctionComponent<WorkspaceChooserSelectWorkspaceProps> = ({
  boardId,
  isLoadingSelectedWorkspace,
  onSelectCreateWorkspace,
  onSelectWorkspace,
  onSubmit,
  selectedWorkspaceId,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, loading } = useWorkspaceChooserSelectWorkspaceQuery({
    variables: {
      memberId: memberId || 'me',
      boardId,
    },
  });

  const workspaceSelectOptions: WorkspaceSelectOptions = useMemo(() => {
    const isMemberManaged = isManaged(
      data?.member?.idEnterprise || '',
      data?.member?.enterprises || [],
    );

    return (data?.member?.organizations || [])
      .filter((org) =>
        isMemberManaged
          ? org.idEnterprise === data?.member?.idEnterprise
          : true,
      )
      .map((org) => {
        const status = org.limits?.orgs?.freeBoardsPerOrg?.status;
        const shouldDisable = status === 'disabled' || status === 'maxExceeded';

        return {
          label: org.displayName,
          value: org.id,
          isDisabled: shouldDisable,
          meta: shouldDisable
            ? format('upgrade-prompt-headline-run-out-of-free-boards')
            : undefined,
        };
      })
      .concat({
        label: format('team-select-create-workspace-option'),
        value: CREATE_NEW_WORKSPACE,
        isDisabled: false,
        meta: undefined,
      });
  }, [data?.member]);

  // get the last used workspace for this board when it was closed. If the member is
  // managed and the workspace has the idEnterprise, it'd exist in the options, otherwise
  // it won't default to that since they can't open the workspace into non enterprise.
  const existingWorkspaceOption =
    !!data?.board?.idOrganization &&
    workspaceSelectOptions.find(
      (option) =>
        !option.isDisabled && option.value === data?.board?.idOrganization,
    );

  const defaultValue = existingWorkspaceOption
    ? existingWorkspaceOption
    : {
        label: format('team-select-default-option'),
        value: '',
      };

  const isButtonLoading = isSubmitted || loading || isLoadingSelectedWorkspace;
  const isButtonEnabled = selectedWorkspaceId && !isButtonLoading;

  const onChange = useCallback(
    (option: { label: string; value: string }) => {
      if (option.value === CREATE_NEW_WORKSPACE) {
        onSelectCreateWorkspace();
      } else if (option.value) {
        onSelectWorkspace(option.value);
      }
    },
    [onSelectCreateWorkspace, onSelectWorkspace],
  );

  const onSelectWorkspaceSubmit: React.FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      if (isButtonEnabled) {
        setIsSubmitted(true);
        onSubmit();
      }
    },
    [setIsSubmitted, isButtonEnabled, onSubmit],
  );

  useEffect(() => {
    if (!loading && data?.board?.idOrganization) {
      onSelectWorkspace(data?.board?.idOrganization);
    }
  }, [loading, data?.board?.idOrganization, onSelectWorkspace]);

  return (
    <>
      <label htmlFor="workspaceChooserSelect">
        {format('workspace-select-label')}
      </label>
      <Select
        id="workspaceChooserSelect"
        isLoading={loading}
        isDisabled={isSubmitted || loading}
        options={workspaceSelectOptions}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <Button
        className={styles.selectWorkspaceSubmitButton}
        onClick={onSelectWorkspaceSubmit}
        size="fullwidth"
        isDisabled={!isButtonEnabled}
        appearance="primary"
      >
        {isButtonLoading ? (
          <Spinner centered />
        ) : (
          format('prompt-continue-button-add-to-workspace')
        )}
      </Button>
    </>
  );
};
