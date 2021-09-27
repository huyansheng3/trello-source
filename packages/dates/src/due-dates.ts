import moment from 'moment';
import { forNamespace } from '@trello/i18n';
import { ClassForDueDate, Dispatcher } from './due-dates.types';

const format = forNamespace();

const firstLessThanOrEqualTo = <T>(n: number, dispatch: Dispatcher<T>): T => {
  for (const { cutoff, val } of dispatch) {
    if (cutoff === null || n <= cutoff) {
      return val;
    }
  }
  throw new Error(`no matching dispatch value for ${n}!`);
};

const makeDateDispatch = <T = string>(
  completeResult: T,
  incompleteDispatcher: Dispatcher<T>,
) => {
  return function (date: Date, isComplete = false, now = Date.now()) {
    if (isComplete) {
      return completeResult;
    }
    return firstLessThanOrEqualTo(
      moment(new Date(date)).diff(now, 'hours', true),
      incompleteDispatcher,
    );
  };
};

// eslint-disable-next-line @trello/no-module-logic
export const classForDueDate = makeDateDispatch<ClassForDueDate>(
  'is-due-complete',
  [
    { cutoff: -36, val: 'is-due-past' },
    { cutoff: 0, val: 'is-due-now' },
    { cutoff: 24, val: 'is-due-soon' },
    { cutoff: null, val: 'is-due-future' },
  ],
);

// eslint-disable-next-line @trello/no-module-logic
export const titleForDueDate = makeDateDispatch(
  format(['badge', 'due', 'complete']),
  [
    { cutoff: -36, val: format(['badge', 'due', 'overdue']) },
    { cutoff: 0, val: format(['badge', 'due', 'recently overdue']) },
    { cutoff: 1, val: format(['badge', 'due', 'less than an hour']) },
    { cutoff: 24, val: format(['badge', 'due', 'less than a day']) },
    // eslint-disable-next-line @trello/no-module-logic
    { cutoff: null, val: format(['badge', 'due', 'later']) },
  ],
);

// eslint-disable-next-line @trello/no-module-logic
export const relativeInfoForDueDate = makeDateDispatch(
  format(['badge', 'due', 'complete short']),
  [
    { cutoff: 0, val: format(['badge', 'due', 'overdue short']) },
    { cutoff: 24, val: format(['badge', 'due', 'due soon short']) },
    { cutoff: null, val: '' },
  ],
);

// eslint-disable-next-line @trello/no-module-logic
export const relativeInfoForStartDate = makeDateDispatch('', [
  { cutoff: 0, val: 'badge.start.past' },
  { cutoff: null, val: 'badge.start.future' },
]);
