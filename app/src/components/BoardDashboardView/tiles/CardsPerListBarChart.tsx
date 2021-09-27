import React, { useMemo } from 'react';
import { BoardReportsViewTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
import { TileProps } from '../types';
import { BarChart, BarChartDataPoint } from '../charts/BarChart';
import { TileContainer } from '../TileContainer';
import { useTruncatedList } from '../useTruncatedList';
import { CardCountTooltip } from '../CardCountTooltip';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { CardsPerListEmptyState } from './CardsPerListEmptyState';
import {
  useCardsPerListCurrentState,
  CardsPerListCurrentState,
} from './useCardsPerListCurrentState';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

const format = forTemplate('board_report');

const MAX_DATA_POINTS = 10;

type ListDataPoint = BarChartDataPoint &
  CardsPerListCurrentState[keyof CardsPerListCurrentState]['list'];

function sortDataPointsByValue(dataPoints: readonly ListDataPoint[]) {
  return [...dataPoints].sort((list1, list2) => list2.value - list1.value);
}

function sortDataPointsByPosition(dataPoints: readonly ListDataPoint[]) {
  return [...dataPoints].sort((list1, list2) => list1.pos - list2.pos);
}

function mapCardsPerListToDataPoints(
  cardsPerList: CardsPerListCurrentState,
): ListDataPoint[] {
  return Object.values(cardsPerList).map((c) => ({
    ...c.list,
    name: c.list.name,
    value: c.count,
  }));
}

interface CardsPerListBarChartProps extends TileProps {}

export const CardsPerListBarChart: React.FC<CardsPerListBarChartProps> = ({
  idBoard,
  tile,
  navigateToBoardView,
  onEdit,
  onDelete,
}) => {
  const { data, loading } = useCardsPerListCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);

  const allDataPoints = useMemo(
    () => (data ? mapCardsPerListToDataPoints(data) : []),
    [data],
  );
  const dataPoints = useTruncatedList<ListDataPoint>({
    list: allDataPoints,
    maxLength: MAX_DATA_POINTS,
    defaultSort: (items) => sortDataPointsByPosition(items),
    overMaxSort: (items) => sortDataPointsByValue(items),
  });

  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const tooltip = useMemo(() => {
    if (dataPoints.length < allDataPoints.length) {
      return (
        <MaxDataPointsTooltip
          count={dataPoints.length}
          total={allDataPoints.length}
          text={format('most-populated-lists')}
        />
      );
    }
    return null;
  }, [dataPoints, allDataPoints]);

  const content = useMemo(() => {
    if (dataPoints.length > 0) {
      return (
        <span data-test-id={BoardReportsViewTestIds.CardsPerListBarChart}>
          <BarChart
            dataPoints={dataPoints}
            // eslint-disable-next-line react/jsx-no-bind
            tooltip={({ name, value }) => (
              <CardCountTooltip label={name} count={value} />
            )}
          />
        </span>
      );
    } else if (!loading) {
      return (
        <span data-test-id={BoardReportsViewTestIds.CardsPerListEmptyState}>
          <CardsPerListEmptyState navigateToBoardView={navigateToBoardView} />
        </span>
      );
    }
  }, [dataPoints, loading, navigateToBoardView]);

  return (
    <TileContainer
      name={format('cards-per-list')}
      menuOptions={menuOptions}
      info={tooltip}
      loading={loading}
      error={error}
    >
      {content}
    </TileContainer>
  );
};
