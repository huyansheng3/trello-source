/* eslint-disable @trello/disallow-filenames */
/*
 * Get last word in the string from the current caret position.
 * Trims obvious punctuation from the start of the word, excluding
 * @ so it doesn't interfere with @mentions
 */
export const getWordFromCaretPos = (text: string, index: number) => {
  let start = text.lastIndexOf(' ', index - 1) + 1;
  while (/[()[\]/\\;"'&]|:@/.test(text[start])) {
    start++;
  }

  return text.slice(start, index);
};
