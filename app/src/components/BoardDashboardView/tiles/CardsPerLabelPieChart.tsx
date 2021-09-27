import React, { useMemo } from 'react';
import * as Colors from '@trello/colors/colors';
import { forTemplate } from '@trello/i18n';
import { CardCountTooltip } from '../CardCountTooltip';
import { PieChart, PieChartDataPoint } from '../charts/PieChart';
import { useNonZeroDataPoints } from '../useNonZeroDataPoints';
import { TileContainer } from '../TileContainer';
import { useOtherDataPoints } from '../useOtherDataPoints';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { TileProps } from '../types';

import { CardsPerLabelEmptyState } from './CardsPerLabelEmptyState';
import { useTileMenuOptions } from './useTileMenuOptions';
import {
  useCardsPerLabelCurrentState,
  CardsPerLabelCurrentState,
} from './useCardsPerLabelCurrentState';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

const format = forTemplate('board_report');

const MAX_DATA_POINTS = 10;

// An issue with the labels pie chart arises when two adjacent
// label data points have the same color. With our pie chart design, those
// would just appear as one big slice in the pie.
//
// We're solving this issue by rotating through a set of 10 colors for each
// possible label color. So for example the first green label in the pie will
// get Green500, the second would get displayed as Green100, and so on.

const createColorRotation = (): Record<string, string[]> => {
  const colorsOrder = [
    '500',
    '700',
    '900',
    '200',
    '400',
    '600',
    '800',
    '100',
    '300',
  ];

  const colorKeyToColor = {
    green: 'Green',
    blue: 'TrelloBlue',
    pink: 'Pink',
    lime: 'Lime',
    sky: 'Sky',
    yellow: 'Yellow',
    orange: 'Orange',
    purple: 'Purple',
    red: 'Red',
  };

  const colorRotation = Object.entries(colorKeyToColor).reduce(
    (acc, [colorKey, color]) => {
      acc[colorKey] = [];
      colorsOrder.forEach((colorNumber) => {
        acc[colorKey].push(
          (Colors as Record<string, string>)[`${color}${colorNumber}`],
        );
      });
      return acc;
    },
    {
      black: [
        Colors.N900,
        Colors.N100,
        Colors.N200,
        Colors.N300,
        Colors.N400,
        Colors.N500,
        Colors.N600,
        Colors.N700,
        Colors.N800,
      ],
    } as Record<string, string[]>,
  );
  return colorRotation;
};

// eslint-disable-next-line @trello/no-module-logic
const ColorRotation = createColorRotation();

type LabelDataPoint = PieChartDataPoint &
  CardsPerLabelCurrentState[keyof CardsPerLabelCurrentState]['label'] & {
    name: string;
  };

function mapCardsPerLabelToDataPoints(
  cardsPerLabel: CardsPerLabelCurrentState,
): Array<LabelDataPoint> {
  const currentColorIndexes: Record<string, number> = Object.keys(
    ColorRotation,
  ).reduce((acc, colorKey) => {
    acc[colorKey] = 0;
    return acc;
  }, {} as Record<string, number>);

  const getColorFromLabelColor = (labelColor: string) => {
    const currentIndex = currentColorIndexes[labelColor];
    const colorRotation = ColorRotation[labelColor];
    if (!colorRotation) {
      // Just being defensive, the label color passed to this function
      // should always exist in the color rotation map
      return undefined;
    }
    const color = colorRotation[currentIndex % colorRotation.length];
    currentColorIndexes[labelColor]++;
    return color;
  };

  return Object.values(cardsPerLabel).map((c) => ({
    ...c.label,
    name: c.label.name,
    value: c.count,
    color: c.label.color ? getColorFromLabelColor(c.label.color) : undefined,
  }));
}

interface CardsPerLabelPieChartProps extends TileProps {}

export const CardsPerLabelPieChart: React.FC<CardsPerLabelPieChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
  navigateToBoardView,
}) => {
  const { data, loading } = useCardsPerLabelCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);

  const allDataPoints = data ? mapCardsPerLabelToDataPoints(data) : [];
  const nonZeroDataPoints = useNonZeroDataPoints(allDataPoints);
  const { individualDataPoints, otherDataPoint } = useOtherDataPoints(
    MAX_DATA_POINTS,
    nonZeroDataPoints,
  );

  const dataPoints = useMemo(() => {
    if (otherDataPoint) {
      return [
        ...individualDataPoints,
        {
          ...otherDataPoint,
          color: Colors.N40,
        },
      ];
    }
    return individualDataPoints;
  }, [individualDataPoints, otherDataPoint]);

  const tooltip = useMemo(() => {
    const numLabelDataPointsShown = individualDataPoints.length;
    if (numLabelDataPointsShown < allDataPoints.length) {
      return (
        <MaxDataPointsTooltip
          count={numLabelDataPointsShown}
          total={allDataPoints.length}
          text={format('most-popular-labels')}
        />
      );
    }
    return null;
  }, [individualDataPoints.length, allDataPoints.length]);

  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const content = useMemo(() => {
    if (dataPoints.length > 0) {
      return (
        <PieChart
          data={dataPoints}
          // eslint-disable-next-line react/jsx-no-bind
          tooltip={({ name, value }) => (
            <CardCountTooltip label={name} count={value} />
          )}
        />
      );
    } else if (!loading) {
      return (
        <CardsPerLabelEmptyState navigateToBoardView={navigateToBoardView} />
      );
    }
  }, [dataPoints, loading, navigateToBoardView]);

  return (
    <TileContainer
      name={format('cards-per-label')}
      info={tooltip}
      menuOptions={menuOptions}
      loading={loading}
      error={error}
    >
      {content}
    </TileContainer>
  );
};
