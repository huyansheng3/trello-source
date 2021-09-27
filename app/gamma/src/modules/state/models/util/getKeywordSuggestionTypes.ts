/* eslint-disable @trello/disallow-filenames */
import { SearchSuggestionType } from 'app/gamma/src/types/models';
import { escapeForRegex } from '@trello/strings';
import { getWordFromCaretPos } from './getWordFromCaretPos';

interface KeywordSuggestion {
  variants: string[];
  containsRegex: RegExp;
}

const KeywordMap: Map<SearchSuggestionType, KeywordSuggestion> = new Map([
  [
    SearchSuggestionType.IsArchived,
    {
      variants: ['archived', 'is:closed', 'closed'],
      containsRegex: /\bis:archived\b/,
    },
  ],
  [
    SearchSuggestionType.IsOpen,
    {
      variants: ['open'],
      containsRegex: /\bis:open\b/,
    },
  ],
  [
    SearchSuggestionType.IsStarred,
    {
      variants: ['starred'],
      containsRegex: /\bis:starred\b/,
    },
  ],
  [
    SearchSuggestionType.HasAttachments,
    {
      variants: ['attachments'],
      containsRegex: /\bhas:attachments\b/,
    },
  ],
  [
    SearchSuggestionType.HasCover,
    {
      variants: ['cover'],
      containsRegex: /\bhas:cover\b/,
    },
  ],
  [
    SearchSuggestionType.HasDescription,
    {
      variants: ['description'],
      containsRegex: /\bhas:description\b/,
    },
  ],
  [
    SearchSuggestionType.HasStickers,
    {
      variants: ['stickers'],
      containsRegex: /\bhas:stickers\b/,
    },
  ],
  [
    SearchSuggestionType.HasMembers,
    {
      variants: ['members'],
      containsRegex: /\bhas:members\b/,
    },
  ],
  [
    SearchSuggestionType.At,
    {
      variants: [],
      containsRegex: /(\b@\S*\b)/,
    },
  ],
  [
    SearchSuggestionType.Me,
    {
      variants: ['me'],
      containsRegex: /^@me\b/,
    },
  ],
  [
    SearchSuggestionType.Member,
    {
      variants: [],
      containsRegex: /(\bmember:\S*\b)/,
    },
  ],
  [
    SearchSuggestionType.Label,
    {
      variants: [],
      containsRegex: /(\blabel:\S*\b)/,
    },
  ],
  [
    SearchSuggestionType.Hash,
    {
      variants: [],
      containsRegex: /(\b#\S*\b)/,
    },
  ],
  [
    SearchSuggestionType.Board,
    {
      variants: [],
      containsRegex: /\bboard:\S*\b/,
    },
  ],
  [
    SearchSuggestionType.List,
    {
      variants: [],
      containsRegex: /\blist:\S*\b/,
    },
  ],
  [
    SearchSuggestionType.Name,
    {
      variants: [],
      containsRegex: /\bname:\S*\b/,
    },
  ],
  [
    SearchSuggestionType.Comment,
    {
      variants: [],
      containsRegex: /\bcomment:\S*\b/,
    },
  ],
  [
    SearchSuggestionType.Checklist,
    {
      variants: [],
      containsRegex: /\bchecklist:\S*\b/,
    },
  ],
  [
    SearchSuggestionType.Description,
    {
      variants: [],
      containsRegex: /\bdescription:\S*\b/,
    },
  ],
  [
    SearchSuggestionType.DueDay,
    {
      variants: ['day', 'today'],
      containsRegex: /\bdue:day\b/,
    },
  ],
  [
    SearchSuggestionType.DueWeek,
    {
      variants: [],
      containsRegex: /\bdue:week\b/,
    },
  ],
  [
    SearchSuggestionType.DueMonth,
    {
      variants: [],
      containsRegex: /\bdue:month\b/,
    },
  ],
  [
    SearchSuggestionType.Overdue,
    {
      variants: ['overdue'],
      containsRegex: /\bdue:overdue\b/,
    },
  ],
  [
    SearchSuggestionType.Incomplete,
    {
      variants: ['incomplete', 'notcomplete', 'stilldue'],
      containsRegex: /\bdue:incomplete\b/,
    },
  ],
  [
    SearchSuggestionType.Complete,
    {
      variants: ['complete', 'completed'],
      containsRegex: /\bdue:complete\b/,
    },
  ],
  [
    SearchSuggestionType.CreatedDay,
    {
      variants: [],
      containsRegex: /\bcreated:day\b/,
    },
  ],
  [
    SearchSuggestionType.CreatedWeek,
    {
      variants: [],
      containsRegex: /\bcreated:week\b/,
    },
  ],
  [
    SearchSuggestionType.CreatedMonth,
    {
      variants: [],
      containsRegex: /\bcreated:month\b/,
    },
  ],
  [
    SearchSuggestionType.EditedDay,
    {
      variants: [],
      containsRegex: /\bedited:day\b/,
    },
  ],
  [
    SearchSuggestionType.EditedWeek,
    {
      variants: [],
      containsRegex: /\bedited:week\b/,
    },
  ],
  [
    SearchSuggestionType.EditedMonth,
    {
      variants: [],
      containsRegex: /\bedited:month\b/,
    },
  ],
  [
    SearchSuggestionType.SortCreated,
    {
      variants: [],
      containsRegex: /\bsort:created\b/,
    },
  ],
  [
    SearchSuggestionType.SortEdited,
    {
      variants: [],
      containsRegex: /\bsort:edited\b/,
    },
  ],
  [
    SearchSuggestionType.SortDue,
    {
      variants: [],
      containsRegex: /\bsort:due\b/,
    },
  ],
]);

/*
 * Returns a unique array of matching SearchSuggestionTypes given a search query if:
 *   1. There is some variant of the SearchSuggestionType that regex matches the query text
 *   2. The search query does not already contain the SearchSuggestionType exactly
 */
export const getKeywordSuggestionTypes = (
  query: string = '',
  caretPos: number,
): SearchSuggestionType[] => {
  const word = getWordFromCaretPos(query, caretPos);
  if (!word.length) {
    return [];
  }
  const regex = new RegExp(`^${escapeForRegex(word)}`);

  const matches = [...KeywordMap.entries()].reduce(
    (result, [type, suggestion]) => {
      if (!suggestion.containsRegex.test(query)) {
        if (!result.directMatches.has(type) && regex.test(type)) {
          result.directMatches.add(type);
        }
        suggestion.variants.forEach((variant) => {
          if (
            regex.test(variant) &&
            !result.directMatches.has(type) &&
            !result.variantMatches.has(type)
          ) {
            result.variantMatches.add(type);
          }
        });
      }

      return result;
    },
    {
      directMatches: new Set<SearchSuggestionType>(),
      variantMatches: new Set<SearchSuggestionType>(),
    },
  );

  return [...matches.directMatches, ...matches.variantMatches];
};
