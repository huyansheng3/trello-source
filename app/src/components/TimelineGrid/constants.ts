/* eslint-disable @trello/export-matches-filename */
import { ZoomLevel } from 'app/src/components/ViewsGenerics';

export const GROUP_HEADER_WIDTH = 200;

export const COL_WIDTH_BY_ZOOM: Record<ZoomLevel, number> = {
  [ZoomLevel.MONTH]: 50,
  [ZoomLevel.DAY]: 500,
  [ZoomLevel.WEEK]: 100,
  [ZoomLevel.QUARTER]: 350,
  [ZoomLevel.YEAR]: 110,
};

export const MONTH_BOUNDARIES = [
  { start: 1, end: 7 },
  { start: 8, end: 15 },
  { start: 16, end: 23 },
  { start: 24, end: 31 },
];

export const AVATAR_SIZE = 30;
export const MAX_AVATAR_COUNT = 2;
export const TITLE_ONLY_WIDTH = 80;
export const SINGLE_FACEPILE_MAX = 150;
export const MIN_WIDTH_FOR_RESIZING = 23;
export const MAX_WIDTH_FOR_SIDE_TITLE = 40;
export const MIN_SPACE_BETWEEN_FOR_SIDE_TITLE = 65;
export const SIDE_TITLE_PADDING = 4;
export const RESIZE_NARROW_HANDLE_MAX = 32;
