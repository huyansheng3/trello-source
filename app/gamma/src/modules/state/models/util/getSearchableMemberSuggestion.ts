/* eslint-disable @trello/disallow-filenames */
import { getWordFromCaretPos } from './getWordFromCaretPos';

/*
 * Given a search query, will return the name of the member to search for
 * if the query matches a member search pattern. If not, returns empty string
 * Ex: "member:phil" => "phil", "@phil" => "phil", "phil" => ""
 */
export const getSearchableMemberSuggestion = (
  query: string,
  caretPos: number,
): string => {
  const memberRegex = /(^@\S*$)|(^member:\S*$)/;
  const word = getWordFromCaretPos(query, caretPos);
  if (memberRegex.test(word)) {
    return word.replace(/^@/, '').replace(/^member:/, '');
  }

  return '';
};
