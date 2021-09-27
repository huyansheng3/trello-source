/* eslint-disable @typescript-eslint/no-use-before-define */
import { Tile } from './tiles';

const tileTypeToDataKeyMap: Record<string, string> = {
  cardsPerMember: 'member',
  cardsPerList: 'list',
  cardsPerLabel: 'label',
  cardsPerDueDate: 'duedate',
  cardsPerListHistory: 'listHistory',
  cardsPerLabelHistory: 'labelHistory',
  cardsPerMemberHistory: 'memberHistory',
  cardsPerDueDateHistory: 'dueDateHistory',
};

export const getTileTypeCounts = (tiles: Pick<Tile, 'type' | 'graph'>[]) => {
  const initialCounts: Record<string, number> = {};

  return tiles.reduce((acc, curr) => {
    const type = getTileType(curr);
    if (!(type in acc)) {
      acc[type] = 0;
    }
    acc[type]++;
    return acc;
  }, initialCounts as Record<string, number>);
};

export const getTileType = (tile: Pick<Tile, 'type' | 'graph'>) => {
  const data = tileTypeToDataKeyMap[tile.type];
  const graph = tile.graph.type;
  return [graph, data].join('-');
};
