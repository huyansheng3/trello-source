/* eslint-disable @trello/disallow-filenames */
import { Feature } from 'app/scripts/debug/constants';

import {
  DropdownOption,
  Label,
  Member,
} from 'app/src/components/ViewsGenerics/types';

export interface List {
  id: string;
  name: string;
  fullName?: never;
}

export interface AddCardState {
  title: string;
  startTime?: number;
  dueTime?: number;
  startEnabled: boolean;
  dueEnabled: boolean;
  listOptions: DropdownOption[];
  labelOptions: DropdownOption[];
  memberOptions: DropdownOption[];
  listDisplayText: string;
  labelDisplayText: string;
  memberDisplayText: string;
}

export type AddCardAction =
  | { type: 'title_updated'; payload: { title: string } }
  | { type: 'start_date_updated'; payload: { time: number } }
  | { type: 'toggle_start' }
  | { type: 'due_date_updated'; payload: { time: number } }
  | { type: 'toggle_due' }
  | { type: 'list_selected'; payload: { item: DropdownOption } }
  | { type: 'member_selected'; payload: { item: DropdownOption } }
  | { type: 'label_selected'; payload: { item: DropdownOption } };

export enum DateType {
  START = 'start',
  DUE = 'due',
}

export interface AddCardData {
  start: number | undefined;
  due: number | undefined;
  idCard: string | undefined;
  idLabels: Array<string>;
  idMembers: Array<string>;
  idList: string | undefined;
  traceId: string;
}

export interface ViewsAddCardPopoverProps {
  onHide: () => void;
  isVisible: boolean;
  popoverTargetRef: React.RefObject<HTMLButtonElement>;
  lists: Array<List>;
  selectedListId?: string;
  startTime?: number;
  dueTime?: number;
  labels?: Array<Label>;
  selectedLabelId?: string;
  members?: Array<Member>;
  selectedMemberId?: string;
  addCardSubmit: (data: AddCardData) => void;
  colorBlind?: boolean;
  feature: Feature;
}
