import moment from 'moment';
import { FilterableCard } from 'app/src/components/ViewFilters/types';
import {
  BackboneFilterCriteria,
  BoardTableViewFilter,
  CardFilterCriteria,
  DateType,
} from './BoardTableViewFilter';

import { BoardFilter } from 'app/scripts/models/board';
import { DueFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';

export enum SortingOption {
  Ascending,
  Descending,
}

export const DAY_MILLIS = 86400000;

export enum RangeFilter {
  None = 0,
  NextDay = DAY_MILLIS,
  NextWeek = DAY_MILLIS * 7,
  NextMonth = DAY_MILLIS * 30,
  HasNoDueDate = 4,
}

export enum CompleteFilter {
  None,
  Complete,
  Incomplete,
}

export type DueFilterValue =
  | RangeFilter
  | CompleteFilter
  | boolean
  | SortingOption;

export const DUE_FILTER_OPTIONS = [
  'notdue',
  'day',
  'week',
  'month',
  'overdue',
  'complete',
  'incomplete',
] as const;

export type BoardDueFilterString = typeof DUE_FILTER_OPTIONS[number] | null;

const dueMap = {
  [RangeFilter.NextDay]: 1,
  [RangeFilter.NextWeek]: 7,
  [RangeFilter.NextMonth]: 28,
};

interface DueFilterParameters {
  range?: RangeFilter;
  complete?: CompleteFilter;
  overdue?: boolean;
}

export class DueFilter implements BoardTableViewFilter {
  public rangeFilter: RangeFilter;
  public completeFilter: CompleteFilter;
  public overdue: boolean;

  constructor({
    range = RangeFilter.None,
    complete = CompleteFilter.None,
    overdue = false,
  }: DueFilterParameters = {}) {
    this.rangeFilter = range;
    this.completeFilter = complete;
    this.overdue = overdue;
  }

  filterLength(): number {
    const urlParams = this.toUrlParams();
    const dueLength = urlParams['due']?.split(',').length;
    const dueCompleteLength = urlParams['dueComplete'] ? 1 : 0;
    return (dueLength ? dueLength : 0) + dueCompleteLength;
  }

  isEmpty(): boolean {
    return (
      this.rangeFilter === RangeFilter.None &&
      this.completeFilter === CompleteFilter.None &&
      !this.overdue
    );
  }

  clear() {
    this.setRangeFilter(RangeFilter.None);
    this.setCompleteFilter(CompleteFilter.None);
    this.setOverdue(false);
  }

  setRangeFilter(value: RangeFilter) {
    this.rangeFilter = value;

    if (this.rangeFilter === RangeFilter.HasNoDueDate) {
      this.overdue = false;
      this.completeFilter = CompleteFilter.None;
    }

    return this;
  }

  setCompleteFilter(value: CompleteFilter) {
    this.completeFilter = value;

    if (this.completeFilter === CompleteFilter.Complete && this.overdue) {
      this.overdue = false;
    }

    if (
      this.completeFilter !== CompleteFilter.None &&
      this.rangeFilter === RangeFilter.HasNoDueDate
    ) {
      this.rangeFilter = RangeFilter.None;
    }

    return this;
  }

  setOverdue(value: boolean) {
    this.overdue = value;

    if (this.overdue) {
      if (this.completeFilter === CompleteFilter.Complete) {
        this.completeFilter = CompleteFilter.None;
      }

      if (this.rangeFilter === RangeFilter.HasNoDueDate) {
        this.rangeFilter = RangeFilter.None;
      }
    }

    return this;
  }

  getMinDue() {
    switch (this.rangeFilter) {
      case RangeFilter.NextDay:
      case RangeFilter.NextWeek:
      case RangeFilter.NextMonth:
        return moment().toISOString();
      case RangeFilter.HasNoDueDate:
      case RangeFilter.None:
      default:
        return null;
    }
  }

  getMaxDue() {
    switch (this.rangeFilter) {
      case RangeFilter.NextDay:
        return moment().add(1, 'days').toISOString();
      case RangeFilter.NextWeek:
        return moment().add(7, 'days').toISOString();
      case RangeFilter.NextMonth:
        return moment().add(30, 'days').toISOString();
      case RangeFilter.HasNoDueDate:
      case RangeFilter.None:
      default:
        return null;
    }
  }

  getDueComplete(): boolean | null {
    if (this.overdue && this.completeFilter === CompleteFilter.None) {
      return null;
    }

    if (this.completeFilter === CompleteFilter.None) {
      return null;
    }

    return this.completeFilter === CompleteFilter.Complete;
  }

  getOverdue(): boolean {
    return Boolean(this.overdue);
  }

  satisfiesDueFilter({
    due,
    complete,
  }: {
    due: FilterableCard['due'];
    complete: FilterableCard['complete'];
  }): boolean {
    if (this.isEmpty()) {
      return true;
    }

    const isCardComplete = complete === CompleteFilter.Complete;
    const isCardIncomplete = complete === CompleteFilter.Incomplete;

    if (this.getDueComplete() && !isCardComplete) {
      return false;
    }

    if (this.getDueComplete() === false && !isCardIncomplete) {
      return false;
    }

    if (this.rangeFilter !== RangeFilter.None) {
      switch (this.rangeFilter) {
        case RangeFilter.HasNoDueDate:
          if (due !== null) return false;
          break;

        default: {
          if (!due) {
            return false;
          } else {
            const maxDate = moment().add(dueMap[this.rangeFilter], 'day');
            const cardDueMoment = moment(due);

            const failsDateCheck = this.overdue
              ? cardDueMoment.isAfter(maxDate) || isCardComplete
              : !cardDueMoment.isBetween(Date.now(), maxDate);

            if (failsDateCheck) {
              return false;
            }
          }

          return true;
        }
      }
    }

    if (
      this.overdue &&
      (!due || isCardComplete || moment(due).isAfter(Date.now()))
    ) {
      return false;
    }

    return true;
  }

  toUrlParams(): {
    [key: string]: string | null;
  } {
    const rangeString = (() => {
      // eslint-disable-next-line default-case
      switch (this.rangeFilter) {
        case RangeFilter.NextDay:
          return 'day';
        case RangeFilter.NextWeek:
          return 'week';
        case RangeFilter.NextMonth:
          return 'month';
        case RangeFilter.HasNoDueDate:
          return 'none'; // <-- this is a little weird, compared to the enum naming
        case RangeFilter.None:
          return null;
      }
    })();

    const overdueString = this.overdue ? 'overdue' : null;
    const dueArray = [rangeString, overdueString].filter((s) => s !== null);
    const due = dueArray.join(',') || null;

    const dueComplete = (() => {
      // eslint-disable-next-line default-case
      switch (this.completeFilter) {
        case CompleteFilter.None:
          return null;
        case CompleteFilter.Complete:
          return 'true';
        case CompleteFilter.Incomplete:
          return 'false';
      }
    })();

    return {
      due,
      dueComplete,
    };
  }

  fromBoardString(boardString: BoardDueFilterString) {
    this.clear();
    switch (boardString) {
      case 'day':
        this.setRangeFilter(RangeFilter.NextDay);
        break;
      case 'week':
        this.setRangeFilter(RangeFilter.NextWeek);
        break;
      case 'month':
        this.setRangeFilter(RangeFilter.NextMonth);
        break;
      case 'notdue':
        this.setRangeFilter(RangeFilter.HasNoDueDate);
        break;
      default:
        break;
    }
  }

  fromUrlParams({ due, dueComplete }: { [key: string]: string | null }) {
    const [first, second] = due?.split(',') || [];
    const overdue = second === 'overdue' || (!second && first === 'overdue');
    const rangeString = first !== 'overdue' ? first : null;

    switch (rangeString) {
      case 'day':
        this.setRangeFilter(RangeFilter.NextDay);
        break;
      case 'week':
        this.setRangeFilter(RangeFilter.NextWeek);
        break;
      case 'month':
        this.setRangeFilter(RangeFilter.NextMonth);
        break;
      case 'none':
        this.setRangeFilter(RangeFilter.HasNoDueDate);
        break;
      default:
        this.setRangeFilter(RangeFilter.None);
        break;
    }

    this.setOverdue(overdue);

    switch (dueComplete) {
      case 'true':
      case '1':
        this.setCompleteFilter(CompleteFilter.Complete);
        break;
      case 'false':
      case '0':
        this.setCompleteFilter(CompleteFilter.Incomplete);
        break;
      default:
        this.setCompleteFilter(CompleteFilter.None);
        break;
    }
  }

  serializeToView() {
    const overdue = this.getOverdue();
    const rangeFilter = this.rangeFilter;
    let start,
      end = null;

    if (
      [
        RangeFilter.NextDay,
        RangeFilter.NextWeek,
        RangeFilter.NextMonth,
      ].includes(rangeFilter)
    ) {
      start = { dateType: DateType.RELATIVE, value: 0 };
      end = { dateType: DateType.RELATIVE, value: rangeFilter };
    }

    if (overdue) {
      start = null;
      // Only set the end range if not already set by the rangeFilter
      end = end
        ? end
        : {
            dateType: DateType.RELATIVE,
            value: 0,
          };
    }

    const due =
      start || end
        ? {
            start,
            end,
          }
        : null;

    return {
      due,
      dueComplete: this.getDueComplete(),
    };
  }

  deserializeFromView(cardFilterCriteria: CardFilterCriteria) {
    if (cardFilterCriteria.due?.start === null) {
      this.setOverdue(true);
    }
    switch (cardFilterCriteria.due?.end?.value) {
      case RangeFilter.NextDay:
        this.setRangeFilter(RangeFilter.NextDay);
        break;
      case RangeFilter.NextWeek:
        this.setRangeFilter(RangeFilter.NextWeek);
        break;
      case RangeFilter.NextMonth:
        this.setRangeFilter(RangeFilter.NextMonth);
        break;
      default:
        this.setRangeFilter(RangeFilter.None);
        break;
    }

    switch (cardFilterCriteria.dueComplete) {
      case true:
        this.setCompleteFilter(CompleteFilter.Complete);
        break;
      case false:
        this.setCompleteFilter(CompleteFilter.Incomplete);
        break;
      default:
        this.setCompleteFilter(CompleteFilter.None);
    }
  }

  serializeToBackboneFilter() {
    const rangeFilter = this.rangeFilter;

    let due: BackboneFilterCriteria['due'];

    switch (rangeFilter) {
      case RangeFilter.NextDay:
        due = 'day';
        break;
      case RangeFilter.NextWeek:
        due = 'week';
        break;
      case RangeFilter.NextMonth:
        due = 'month';
        break;
      case RangeFilter.HasNoDueDate:
        due = 'notdue';
        break;
      default:
        break;
    }

    return {
      due,
      overdue: this.getOverdue() || undefined,
      dueComplete: this.getDueComplete() ?? undefined,
    };
  }

  /**
   * Parse a DueFilter into valid MBAPI query parameters
   *
   * If "notdue" is selected, due will be "none"; otherwise:
   * due will be of the form 2021-07-26T20:24:00.182Z...2021-08-01T20:24:00.182Z
   * where up to two ISOStrings are separated by ...
   *
   * @returns {due: string, dueComplete: boolean|null}
   */
  toMbapiFormat(): { due: string; dueComplete: boolean | null } {
    if (this.rangeFilter === RangeFilter.HasNoDueDate) {
      return { due: 'none', dueComplete: null };
    }

    if (this.getOverdue()) {
      const endOfRange = this.getMaxDue() || new Date().toISOString();
      return { due: `...${endOfRange}`, dueComplete: false };
    }

    const startOfRange = this.getMinDue();
    const endOfRange = this.getMaxDue();
    const due =
      startOfRange || endOfRange ? `${startOfRange || ''}...${endOfRange}` : '';
    return { due, dueComplete: this.getDueComplete() };
  }

  // These are functions used by the board filtering, which uses different url parameter formatting and
  // mutates the legacy board filter backbone model. If we deprecate the board filtering in favor of
  // view filtering, we can delete these functions
  isDueOptionActive(value: DueFilterCriteriaOption['value']) {
    switch (value) {
      case 'complete':
        return this.completeFilter === CompleteFilter.Complete;
      case 'incomplete':
        return this.completeFilter === CompleteFilter.Incomplete;
      case 'overdue':
        return this.getOverdue() === true;
      case 'notdue':
        return this.rangeFilter === RangeFilter.HasNoDueDate;
      case 'day':
        return this.rangeFilter === RangeFilter.NextDay;
      case 'week':
        return this.rangeFilter === RangeFilter.NextWeek;
      case 'month':
        return this.rangeFilter === RangeFilter.NextMonth;
      default:
        return false;
    }
  }

  static setBoardDueFilter(
    dueType: string,
    newValue: BoardDueFilterString | boolean,
    filter: BoardFilter,
  ) {
    // To catch the case where you can't simultaneously have overdue and
    // dueComplete selected

    if (
      dueType === 'overdue' &&
      newValue &&
      filter.get('dueComplete') === true
    ) {
      filter.set('dueComplete', null);
    }

    if (dueType === 'dueComplete' && newValue && filter.get('overdue')) {
      filter.set('overdue', null);
    }

    // Also catch case where Not Due can only stand on its own
    if ((dueType === 'overdue' && newValue) || dueType === 'dueComplete') {
      if (filter.get('due') === 'notdue') {
        filter.set('due', null);
      }
    }

    if (newValue === 'notdue') {
      filter.set('overdue', null);
      filter.set('dueComplete', null);
    }

    if (filter.get(dueType) === newValue) {
      filter.set(dueType, null);
    } else {
      filter.set(dueType, newValue);
    }
  }
}
