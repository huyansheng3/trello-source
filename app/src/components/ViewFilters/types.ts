/* eslint-disable @trello/disallow-filenames */
import { LabelColor, LabelName } from 'app/src/components/BoardTableView/types';
import {
  ViewCard,
  Checklist,
  ViewBoard,
} from 'app/src/components/BoardViewContext/BoardViewContext';

import {
  CompleteFilter,
  DueFilter,
  MembersFilter,
  LabelsFilter,
  TitleFilter,
} from './filters';

type Board = ViewBoard;
export type BoardPlugins = Board['boardPlugins'];
export type Card = ViewCard;
export type CalendarCard = ViewCard;

export type ChecklistItem = Checklist['checkItems'][number];
export type CustomFields = Board['customFields'];
export type CustomField = CustomFields[number];
export type CustomFieldItem = NonNullable<Card['customFieldItems']>[number];

export interface LabelType {
  color: LabelColor;
  name: LabelName;
}

export enum FilterMode {
  And,
  Or,
}

export interface FilterableCard {
  idMembers: string[];
  labels: LabelType[];
  due: Date | null;
  complete: CompleteFilter;
  words: string[];
}

export interface ViewsFilters {
  members: MembersFilter;
  labels: LabelsFilter;
  due: DueFilter;
  title: TitleFilter;
  mode?: FilterMode;
}
