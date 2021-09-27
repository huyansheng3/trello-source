import React from 'react';

import { PopoverScreen } from '@trello/nachos/popover';
import { CreateWorkspaceViewPopoverScreenContent } from './CreateWorkspaceViewPopoverScreenContent';
import { forTemplate } from '@trello/i18n';

interface CreateWorkspaceViewPopoverScreenProps {
  idOrganization?: string;
  name?: string;
  boardsFilter?: string[];

  onClose: () => void;
}

export enum Screen {
  CreateWorkspaceViewPopoverScreen,
}

const format = forTemplate('organization_view');

export const CreateWorkspaceViewPopoverScreen: React.FC<CreateWorkspaceViewPopoverScreenProps> = ({
  idOrganization,
  name,
  boardsFilter,
  onClose,
}: CreateWorkspaceViewPopoverScreenProps) => {
  return (
    <PopoverScreen
      id={Screen.CreateWorkspaceViewPopoverScreen}
      title={format('create-view')}
    >
      <CreateWorkspaceViewPopoverScreenContent
        idOrganization={idOrganization}
        name={name}
        boardsFilter={boardsFilter}
        onClose={onClose}
      ></CreateWorkspaceViewPopoverScreenContent>
    </PopoverScreen>
  );
};
