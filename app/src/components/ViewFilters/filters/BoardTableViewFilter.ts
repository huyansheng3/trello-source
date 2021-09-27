/* eslint-disable @trello/export-matches-filename */
import type { Board } from 'app/scripts/models/board';
import { BoardDueFilterString } from './DueFilter';

export interface BoardTableViewFilter {
  toUrlParams(): UrlParams;
  fromUrlParams(urlParams: UrlParams): void;
  serializeToView(): CardFilterCriteria;
  deserializeFromView(view: CardFilterCriteria): void;
  serializeToBackboneFilter?(board: Board): BackboneFilterCriteria;
  isEmpty(): boolean;
  /**
   * Return the length of the filter. Used for analytics and tracking purposes
   */
  filterLength(): number;
  // TODO ideas:
  // serializeToMBAPIparams(): {};
}

export interface UrlParams {
  [key: string]: string | null;
}

export interface AdvancedDate {
  dateType: string;
  value: number;
}

export enum DateType {
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
}

export interface DateRange {
  start?: AdvancedDate | null;
  end?: AdvancedDate | null;
  special?: 'any' | 'none';
}

export const SortFields = <const>['due'];
type validSortFieldsType = typeof SortFields[number];
export type SortType = `${'-' | ''}${validSortFieldsType}`;

export interface CardFilterCriteria {
  idBoards?: string[] | null;
  idLists?: string[] | null;
  idMembers?: string[] | null;
  labels?: string[] | null;
  due?: DateRange | null;
  dueComplete?: boolean | null;
  sort?: string[] | null;
}
export interface BackboneFilterCriteria {
  idLists?: string[] | null;
  idMembers?: string[] | null;
  idLabels?: string[] | null;
  due?: Extract<BoardDueFilterString, 'day' | 'week' | 'month' | 'notdue'>;
  overdue?: boolean;
  dueComplete?: boolean;
  title?: string;
}
