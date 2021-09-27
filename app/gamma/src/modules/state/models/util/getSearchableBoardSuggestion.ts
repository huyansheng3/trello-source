/* eslint-disable @trello/disallow-filenames */
import { getWordFromCaretPos } from './getWordFromCaretPos';

/*
 * Given a search query, will return the name of the board to search for
 * if the query matches a board search pattern. If not, returns empty string
 * Ex: "board:stuff" => "stuff", "stuff" => ""
 */
export const getSearchableBoardSuggestion = (
  query: string,
  caretPos: number,
): string => {
  const boardRegex = /^board:\S*$/;
  const word = getWordFromCaretPos(query, caretPos);
  if (boardRegex.test(word)) {
    return word.replace(/^board:/, '');
  }

  return '';
};
