/* eslint-disable @trello/export-matches-filename */
import { PopoverProps } from '@trello/nachos/popover';
import { ButlerTab } from '../showButlerDirectory';
import { Command } from '@atlassian/butler-command-parser';
import { FormattedButlerButton } from './useButlerButtons';

export interface CardPopoverProps {
  idCard: string;
  idBoard: string;
  idOrganization: string;
  popoverProps: PopoverProps<HTMLAnchorElement, HTMLElement>;
  push: (screen: number) => void;
  pop: (depth?: number) => void;
  hide: () => void;
  goToButlerDirectory: (butlerTab?: ButlerTab, butlerCmdEdit?: string) => void;
  addCardButton?: () => void;
}
export interface EditableButlerButton extends Partial<FormattedButlerButton> {
  cmd: Command;
  label: string;
}

export enum Screen {
  Start,
  AddStart,
  Edit,
  Delete,
  AddAction,
}

export interface DeletableButlerButton extends EditableButlerButton {
  id: string;
  scope: 'boards' | 'organizations';
}
