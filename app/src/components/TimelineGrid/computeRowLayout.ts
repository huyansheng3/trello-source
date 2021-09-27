/* eslint-disable @typescript-eslint/no-use-before-define */
import moment from 'moment';
import { TimelineGroup, TimelineItem } from './types';
import { ZoomLevel } from 'app/src/components/ViewsGenerics';
import { MONTH_BOUNDARIES } from './constants';

// Build the rows by searching for items that don't overlap with each other within each group
//
// How it works:
// * Items within the group are sorted by startDate
// * timeCursor keeps track of how far into the row we are
// * pickedItems keeps track of which items have already been placed into a row
// * Given these, we can build rows by searching for the first item that starts *after* the time cursor,
//    and hasn't been picked
// * If we find an item matching those criteria, add it to the row, mark it
//    as picked, and set the timeCursor to that item's end date (because it
//    occupies the span from start to end)
// * If we don't find an item, then start a new row and reset the timeCursor back to the beginning
// * Repeat until all items have been picked
const buildItemGroups = (
  timelineGroups: Array<TimelineGroup>,
  itemsByGrouping: Map<string, Array<TimelineItem>>,
  dateCache: Map<string, { start: number; end: number }>,
  zoom: ZoomLevel,
) => {
  const itemGroups = new Map();
  timelineGroups.forEach((group) => {
    const groupItems = itemsByGrouping.get(group.id) || [];

    groupItems.sort((i1, i2) => i1.startTime - i2.startTime);

    const rows = [];
    let timeCursor: null | number = null;
    const pickedItems = new Map();
    let row: Array<TimelineItem> = [];
    while (pickedItems.size < groupItems.length) {
      const eligibleIdx = groupItems.findIndex((item, idx) => {
        const { start } = dateCache.get(item.id) || {};
        if (!start) {
          return false;
        }

        return (
          !pickedItems.has(idx) && (timeCursor === null || start > timeCursor)
        );
      });
      if (eligibleIdx >= 0) {
        const item = {
          ...groupItems[eligibleIdx],
          activeGroupId: group.id,
        };
        timeCursor = dateCache.get(item.id)?.end || null;
        if (zoom === ZoomLevel.QUARTER) {
          // Padding a day so items in quarter view don't stick together
          timeCursor = moment(dateCache.get(item.id)?.end)
            .add(1, 'day')
            .valueOf();
        }
        if (zoom === ZoomLevel.YEAR) {
          // Under a year zoom, items show up in four sections:
          // 1st - 7th; 8th - 15th; 16th - 23rd; 24th - end of month
          const itemMoment = moment(dateCache.get(item.id)?.end);
          const monthBoundary = MONTH_BOUNDARIES.find((boundary) => {
            return itemMoment.date() <= boundary.end;
          });

          if (monthBoundary && monthBoundary.end <= itemMoment.daysInMonth()) {
            timeCursor = itemMoment.date(monthBoundary.end).valueOf();
          } else {
            timeCursor = itemMoment.endOf('month').valueOf();
          }
        }
        row.push(item);
        pickedItems.set(eligibleIdx, true);
      } else {
        rows.push(row);
        row = [];
        timeCursor = null;
      }
    }

    if (row.length > 0) {
      rows.push(row);
      row = [];
    }

    itemGroups.set(group.id, { rows });
  });

  return itemGroups;
};

/**
 * Builds a data structure representing the layout of items on the grid
 *
 * To render the grid, we need to know how to put the items into groups, and
 * figure out which items to show in each row. The groups are user-defined
 * (like by list, or by member). Each group may have multiple rows of items.
 * Each row contain multiple items from that group that don't overlap by
 * start/end date.
 *
 * This function represents this as a map, where the key is the id of the
 * group, and the value is an object containing an array of rows. Each row is
 * an array of items.
 */
export const computeRowLayout = (
  groups: Array<TimelineGroup>,
  items: Array<TimelineItem>,
  zoom: ZoomLevel,
) => {
  // profiling revealed the moment calls below to be expensive, so cache them
  const dateCache = items.reduce((acc, item) => {
    acc.set(item.id, {
      start: moment(item.startTime).startOf('day').valueOf(),
      end: moment(item.endTime).endOf('day').valueOf(),
    });
    return acc;
  }, new Map());

  const itemsByGrouping = groupItems(items);
  return buildItemGroups(groups, itemsByGrouping, dateCache, zoom);
};

export const groupItems = (items: Array<TimelineItem>) =>
  items.reduce((acc, item) => {
    if (item.idGroups.length === 0) {
      if (!acc.has('no-grouping')) {
        acc.set('no-grouping', []);
      }
      const grouping = acc.get('no-grouping');
      grouping &&
        grouping.push({
          ...item,
          activeGroupId: 'no-grouping',
        });
    } else {
      item.idGroups.forEach((group) => {
        if (!acc.has(group)) {
          acc.set(group, []);
        }
        const grouping = acc.get(group);
        grouping &&
          grouping.push({
            ...item,
            activeGroupId: group,
          });
      });
    }
    return acc;
  }, new Map<string, Array<TimelineItem>>());
