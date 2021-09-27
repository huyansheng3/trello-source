import _ from 'underscore';

import {
  MembersFilter,
  LabelsFilter,
  DueFilter,
  CompleteFilter,
  UrlParams,
  BoardsFilter,
  ListFilter,
  SortFilter,
  TitleFilter,
} from './filters';
import { CardFilterCriteria } from './filters/BoardTableViewFilter';

import {
  FilterableCard,
  FilterMode,
  CustomFields,
  Card,
  ChecklistItem,
} from './types';

import { getWords } from 'app/common/lib/util/satisfies-filter';
import { CustomFieldItem } from './CustomFieldItem';

export interface ViewFiltersParams {
  boards?: BoardsFilter;
  due?: DueFilter;
  labels?: LabelsFilter;
  list?: ListFilter;
  members?: MembersFilter;
  mode?: FilterMode;
  sort?: SortFilter;
  title?: TitleFilter;
}

// Utility for aggregation convenience functions.
// FilterMode isn't countable, so it is excluded from aggregated totals.
const COUNTABLE_VIEW_FILTER_PARAMS: Array<
  Exclude<keyof ViewFiltersParams, 'mode'>
> = ['boards', 'due', 'labels', 'list', 'members', 'sort', 'title'];
export type CountableViewFilterParams = typeof COUNTABLE_VIEW_FILTER_PARAMS;

export class ViewFilters {
  public boards: BoardsFilter;
  public due: DueFilter;
  public labels: LabelsFilter;
  public list: ListFilter;
  public members: MembersFilter;
  public mode: FilterMode;
  public calendarDateRange: `${string}...${string}`;
  public sort: SortFilter;
  public title: TitleFilter;

  constructor(params: ViewFiltersParams = {}) {
    this.boards = params.boards || new BoardsFilter();
    this.due = params.due || new DueFilter();
    this.labels = params.labels || new LabelsFilter();
    this.list = params.list || new ListFilter();
    this.members = params.members || new MembersFilter();
    this.mode = params.mode ?? FilterMode.Or;
    this.sort = params.sort || new SortFilter();
    this.title = params.title || new TitleFilter();
  }

  /**
   * Convenience function to determine whether filters are active.
   * `skip` params can be configured to omit certain filters from the check,
   * e.g. a value of ['boards'] checks whether non-boards filters are active.
   */
  isFiltering(skip: CountableViewFilterParams = []): boolean {
    const skipSet = new Set(skip);
    return COUNTABLE_VIEW_FILTER_PARAMS.some(
      (key) => !skipSet.has(key) && !this[key].isEmpty(),
    );
  }

  /**
   * Convenience function to count the total number of active filters.
   * `skip` params can be configured to omit certain filters from the check,
   * e.g. a value of ['boards'] excludes boards from the count.
   */
  totalFilterLength(skip: CountableViewFilterParams = []): number {
    const skipSet = new Set(skip);
    return COUNTABLE_VIEW_FILTER_PARAMS.reduce((acc, key) => {
      if (!skipSet.has(key)) {
        acc += this[key].filterLength();
      }
      return acc;
    }, 0);
  }

  satisfiesFilter(filterable: FilterableCard): boolean {
    const isAnd = this.mode === FilterMode.And;

    if (!this.labels.satisfiesLabelsFilter(filterable.labels, isAnd)) {
      return false;
    }

    if (!this.members.satisfiesMembersFilter(filterable.idMembers, isAnd)) {
      return false;
    }

    if (
      !this.due.satisfiesDueFilter({
        due: filterable.due,
        complete: filterable.complete,
      })
    ) {
      return false;
    }

    if (!this.title.satisfiesTitleFilter(filterable.words)) {
      return false;
    }

    return true;
  }

  checkAdvancedChecklistItem({
    name,
    state,
    due,
    idMember,
  }: ChecklistItem): boolean {
    const filterableChecklistItem = {
      idMembers: idMember ? [idMember] : [],
      labels: [],
      due: due ? new Date(due) : null,
      complete:
        state === 'complete'
          ? CompleteFilter.Complete
          : CompleteFilter.Incomplete,
      words: getWords(name),
    };

    return this.satisfiesFilter(filterableChecklistItem);
  }

  checkFilterableCard(
    card: Pick<
      Card,
      'idMembers' | 'labels' | 'due' | 'dueComplete' | 'name' | 'idShort'
    > &
      Partial<Pick<Card, 'customFieldItems'>>,
    customFields: CustomFields,
    isCustomFieldsEnabled: boolean,
  ): boolean {
    const {
      idMembers,
      labels,
      due,
      dueComplete,
      name,
      idShort,
      customFieldItems,
    } = card;
    const filterableCustomFieldWords = customFieldItems?.map(
      (customFieldItem) => {
        const filterableCustomFieldItem = new CustomFieldItem(customFieldItem);

        const mappedCustomField = filterableCustomFieldItem.getCustomField(
          customFields,
        );

        if (!mappedCustomField) {
          return undefined;
        }

        return filterableCustomFieldItem.getFilterableWords(mappedCustomField);
      },
    );

    const filterableCard = {
      idMembers,
      labels: labels?.map(({ color, name }) => ({ color, name })),
      due: due ? new Date(due) : null,
      complete: dueComplete
        ? CompleteFilter.Complete
        : CompleteFilter.Incomplete,
      words: _.chain([
        getWords(name),
        getWords(idShort?.toString()),
        isCustomFieldsEnabled ? filterableCustomFieldWords : undefined,
      ])
        .compact()
        .flatten()
        .value(),
    };

    return this.satisfiesFilter(filterableCard);
  }

  toQueryParams(): UrlParams {
    if (this.isFiltering()) {
      const queryParams: UrlParams = {};

      const { labels } = this.labels.toUrlParams();
      const { idMembers } = this.members.toUrlParams();
      const { due, dueComplete } = this.due.toUrlParams();
      const { title } = this.title.toUrlParams();
      const { idBoards } = this.boards.toUrlParams();

      if (labels) {
        queryParams.labels = labels;
      }
      if (idMembers) {
        queryParams.idMembers = idMembers;
      }
      if (due) {
        queryParams.due = due;
      }
      if (dueComplete) {
        queryParams.dueComplete = dueComplete;
      }
      if (title) {
        queryParams.title = title;
      }
      if (this.mode === FilterMode.And) {
        queryParams.mode = 'and';
      }
      if (idBoards) {
        queryParams.idBoards = idBoards;
      }

      return queryParams;
    }

    return {};
  }

  static fromQueryParams(urlParams: UrlParams) {
    const viewsFilter: ViewFilters = new ViewFilters();

    if (urlParams.mode) {
      if (urlParams.mode.toLowerCase() === 'and') {
        viewsFilter.mode = FilterMode.And;
      }
    }

    viewsFilter.due.fromUrlParams(urlParams);
    viewsFilter.members.fromUrlParams(urlParams);
    viewsFilter.labels.fromUrlParams(urlParams);
    viewsFilter.title.fromUrlParams(urlParams);
    viewsFilter.boards.fromUrlParams(urlParams);
    viewsFilter.sort.fromUrlParams(urlParams);
    viewsFilter.list.fromUrlParams(urlParams);

    return viewsFilter;
  }

  static fromSavedView(cardFilterCriteria: CardFilterCriteria): ViewFilters {
    const viewFilters: ViewFilters = new ViewFilters();

    viewFilters.boards.deserializeFromView(cardFilterCriteria);
    viewFilters.due.deserializeFromView(cardFilterCriteria);
    viewFilters.members.deserializeFromView(cardFilterCriteria);
    viewFilters.list.deserializeFromView(cardFilterCriteria);
    viewFilters.labels.deserializeFromView(cardFilterCriteria);
    viewFilters.sort.deserializeFromView(cardFilterCriteria);
    viewFilters.title.deserializeFromView(cardFilterCriteria);

    return viewFilters;
  }
}
