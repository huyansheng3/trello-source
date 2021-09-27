import React, { useMemo } from 'react';
import { Sky500 } from '@trello/colors';
import { BoardReportsViewTestIds } from '@trello/test-ids';
import { LabelColorMap } from '@trello/dashboard';

import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { useTruncatedList } from '../useTruncatedList';
import { CardCountTooltip } from '../CardCountTooltip';
import { TileContainer } from '../TileContainer';
import { BarChart, BarChartDataPoint } from '../charts/BarChart';
import { TileProps } from '../types';

import { useTileMenuOptions } from './useTileMenuOptions';
import { CardsPerLabelEmptyState } from './CardsPerLabelEmptyState';
import {
  useCardsPerLabelCurrentState,
  CardsPerLabelCurrentState,
} from './useCardsPerLabelCurrentState';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_report');

const MAX_DATA_POINTS = 10;

type LabelDataPoint = CardsPerLabelCurrentState[keyof CardsPerLabelCurrentState]['label'] &
  BarChartDataPoint;

function sortCardsPerLabelByValue(dataPoints: readonly LabelDataPoint[]) {
  return [...dataPoints].sort((label1, label2) => label2.value - label1.value);
}

function mapCardsPerLabelToDataPoints(
  cardsPerLabel: CardsPerLabelCurrentState,
): Array<LabelDataPoint> {
  return Object.values(cardsPerLabel).map((c) => ({
    ...c.label,
    name: c.label.name,
    value: c.count,
    color: c.label.color ? LabelColorMap[c.label.color] : undefined,
  }));
}

interface CardsPerLabelBarChartProps extends TileProps {}

export const CardsPerLabelBarChart: React.FC<CardsPerLabelBarChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
  navigateToBoardView,
}) => {
  const { data, loading } = useCardsPerLabelCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);

  const allDataPoints = data ? mapCardsPerLabelToDataPoints(data) : [];
  const dataPoints = useTruncatedList<LabelDataPoint>({
    list: allDataPoints,
    maxLength: MAX_DATA_POINTS,
    defaultSort: (items) => items,
    overMaxSort: (items) => sortCardsPerLabelByValue(items),
  });

  const tooltip = useMemo(() => {
    if (dataPoints.length < allDataPoints.length) {
      return (
        <MaxDataPointsTooltip
          count={dataPoints.length}
          total={dataPoints.length}
          text={format('most-popular-labels')}
        />
      );
    }
    return null;
  }, [allDataPoints.length, dataPoints.length]);

  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const anyDataPointsNonZero = useMemo(
    () => dataPoints.some((dp) => dp.value !== 0),
    [dataPoints],
  );

  const content = useMemo(() => {
    if (anyDataPointsNonZero) {
      return (
        <span data-test-id={BoardReportsViewTestIds.CardsPerLabelBarChart}>
          <BarChart
            dataPoints={dataPoints}
            color={Sky500}
            // eslint-disable-next-line react/jsx-no-bind
            tooltip={({ name, value }) => (
              <CardCountTooltip label={name} count={value} />
            )}
          />
        </span>
      );
    } else if (!loading) {
      return (
        <span data-test-id={BoardReportsViewTestIds.CardsPerLabelBarChart}>
          <CardsPerLabelEmptyState navigateToBoardView={navigateToBoardView} />
        </span>
      );
    }
  }, [anyDataPointsNonZero, dataPoints, navigateToBoardView, loading]);

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
