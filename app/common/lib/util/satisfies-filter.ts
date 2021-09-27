/* eslint-disable @trello/disallow-filenames */
import moment from 'moment';

const dueMap = {
  day: 1,
  week: 7,
  month: 28,
};

export const ID_NONE = 'none';
// Value used to filter for cards with no labels; maps to a translation.
export const NO_LABELS = 'no labels';

export interface Filterable {
  idMembers: string[];
  idLabels: string[];
  due: Date | null;
  complete: boolean;
  words: string[];
}

export interface Filter {
  idMembers?: string[];
  idLabels?: string[];
  mode?: 'and' | 'or';
  due?: 'notdue' | keyof typeof dueMap;
  overdue?: boolean;
  dueComplete?: boolean;
  title?: string;
}

// Treat all whitespace an punctuation as word separators, except...
// # (for searches like #123)
// % (for searches like 100%)
// ' (for searches like can't)
// - (for searches like RMK-123)
// . and @ (for searches like taco@trello.com)
export const reWordSeparators = /[\s!"$&()*+,/:;<=>?[\\\]^_`{|}~]/;

export function getWords(s: string | undefined): string[] {
  return s
    ? s
        .toLowerCase()
        .split(reWordSeparators)
        .filter((word) => word)
    : [];
}

/**
 * Compare a given word against a set of filterable words. For example, the word
 * "super" should match a card named "Superman" and cards labeled "superhero".
 * Breaks the given word into tokens and returns a function that returns true
 * if the tokens match anything in the filterableWords input. Note that this
 * returns void if the initial word cannot be tokenized; this is meaningfully
 * not a noop in order to indicate that there isn't a need to run the filter.
 */
export function getSatisfiesWordFilter(
  word: string,
): ((filterableWords: string[]) => boolean) | void {
  // Want to match at least one word from our search
  const searchWords = getWords(word);

  if (searchWords.length === 0) {
    return;
  }

  const endsWithPartialWord = !reWordSeparators.test(word[word.length - 1]);

  const completeWords = endsWithPartialWord
    ? searchWords.slice(0, searchWords.length - 1)
    : searchWords;
  const partialWord = endsWithPartialWord
    ? searchWords[searchWords.length - 1]
    : undefined;

  return (filterableWords: string[]) => {
    const actualWordsSet = new Set(filterableWords);
    const matchesAnyWord =
      completeWords.some((word) => actualWordsSet.has(word)) ||
      (partialWord &&
        filterableWords.some((word) => word.startsWith(partialWord)));
    return !!matchesAnyWord;
  };
}

export function satisfiesFilter(
  filterable: Filterable,
  filter: Filter,
): boolean {
  const matchesLabelsAndMembers = [
    { required: filter.idLabels, actual: filterable.idLabels || [] },
    { required: filter.idMembers, actual: filterable.idMembers || [] },
  ].every(({ required, actual }) => {
    if (!required || required.length === 0) {
      return true;
    }

    const effective = actual.length === 0 ? [ID_NONE] : actual;

    if (filter.mode === 'and') {
      // Account for no labels/members if they are the only active filters
      if (required.length === 1 && required[0] === ID_NONE) {
        return actual.length === 0;
      }

      // We need all of the required values
      const actualSet = new Set(actual);
      return required.every((value) => actualSet.has(value));
    } else {
      // We need at least one of the required values
      const requiredSet = new Set(required);
      return effective.some((value) => requiredSet.has(value));
    }
  });

  if (!matchesLabelsAndMembers) {
    return false;
  }

  if (filter.title) {
    const satisfiesWordFilter = getSatisfiesWordFilter(filter.title);
    if (satisfiesWordFilter && !satisfiesWordFilter(filterable.words)) {
      return false;
    }
  }

  if (
    filter.dueComplete !== undefined &&
    filter.dueComplete === !filterable.complete
  ) {
    return false;
  }

  if (filter.due) {
    switch (filter.due) {
      case 'notdue':
        if (filterable.due !== null) return false;
        break;

      default: {
        if (!filterable.due) {
          return false;
        } else {
          const maxDate = moment().add(dueMap[filter.due], 'day');
          const cardDueMoment = moment(filterable.due);

          const failsDateCheck = filter.overdue
            ? cardDueMoment.isAfter(maxDate) || filterable.complete
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
    filter.overdue &&
    (!filterable.due ||
      filterable.complete ||
      moment(filterable.due).isAfter(Date.now()))
  ) {
    return false;
  }

  return true;
}
