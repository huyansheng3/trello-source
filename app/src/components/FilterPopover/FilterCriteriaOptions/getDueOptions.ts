import { forNamespace } from '@trello/i18n';
import { getWords } from 'app/common/lib/util/satisfies-filter';
import type { BoardDueFilterString } from 'app/src/components/ViewFilters/filters';
import type { DueFilterCriteriaOption } from './types';

const format = forNamespace('due date filter');

// Ordered as defined in the FilterPopover designs today.
const ORDERED_DUE_FILTER_OPTIONS: readonly NonNullable<BoardDueFilterString>[] = [
  'overdue',
  'day',
  'week',
  'month',
  'complete',
  'incomplete',
];

let dueOptions: DueFilterCriteriaOption[];
/**
 * Generate due filter criteria options, which are static and not tied to query.
 */
export const getDueOptions = (): DueFilterCriteriaOption[] => {
  if (!dueOptions) {
    dueOptions = ORDERED_DUE_FILTER_OPTIONS.map((value) => {
      const label = format(value);
      return { value, label, filterableWords: getWords(label) };
    });
  }
  return dueOptions;
};
