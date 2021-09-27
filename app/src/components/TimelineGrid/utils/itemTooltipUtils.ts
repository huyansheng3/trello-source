/* eslint-disable @trello/export-matches-filename, @trello/disallow-filenames */

export const reformatTooltipTitle = (title: string) => {
  if (title.length > 200) {
    return title.substring(0, 200) + '...';
  }
  return title;
};
