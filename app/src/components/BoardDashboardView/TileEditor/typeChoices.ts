import { TileInput } from './types';

export type TypeChoiceKind = 'bar' | 'pie' | 'line';

export interface TypeChoice {
  type: TypeChoiceKind;
  isAvailable?: () => boolean;
  isSelected(tile: TileInput): boolean;
  select(tile: TileInput): TileInput;
  imgSrc: {
    color: string;
    neutral: string;
  };
}

const ensureCurrentStateTile = (tile: TileInput) => {
  const resultTile = { ...tile };
  if (tile.type.includes('History')) {
    resultTile.type = 'cardsPerList';
  }
  resultTile.from = null;
  return resultTile;
};

const ensureHistoryTile = (tile: TileInput) => {
  const resultTile = { ...tile };
  if (!tile.type.includes('History')) {
    resultTile.type = 'cardsPerListHistory';
  }
  resultTile.from = {
    dateType: 'relative',
    value: -604800000,
  };
  return resultTile;
};

export const typeChoices: Record<string, TypeChoice> = {
  Bar: {
    type: 'bar',
    isSelected: (tile: TileInput) => tile.graph.type === 'bar',
    select: (tile: TileInput) => ({
      ...ensureCurrentStateTile(tile),
      graph: {
        ...tile.graph,
        type: 'bar',
      },
    }),
    imgSrc: {
      color: require('resources/images/dashboard/bar-graph-vibrant.svg'),
      neutral: require('resources/images/dashboard/bar-graph-neutral.svg'),
    },
  },
  Pie: {
    type: 'pie',
    isSelected: (tile: TileInput) => tile.graph.type === 'pie',
    select: (tile: TileInput) => ({
      ...ensureCurrentStateTile(tile),
      graph: {
        ...tile.graph,
        type: 'pie',
      },
    }),
    imgSrc: {
      color: require('resources/images/dashboard/pie-chart-vibrant.svg'),
      neutral: require('resources/images/dashboard/pie-chart-neutral.svg'),
    },
  },
  Line: {
    type: 'line',
    isSelected: (tile: TileInput) => tile.graph.type === 'line',
    select: (tile: TileInput) => ({
      ...ensureHistoryTile(tile),
      type: 'cardsPerListHistory',
      graph: {
        ...tile.graph,
        type: 'line',
      },
    }),
    imgSrc: {
      color: require('resources/images/dashboard/line-chart-vibrant.svg'),
      neutral: require('resources/images/dashboard/line-chart-neutral.svg'),
    },
  },
};

export const getAvailableChoices = () => {
  return Object.values(typeChoices).filter((choice) =>
    choice.isAvailable ? choice.isAvailable() : true,
  );
};
