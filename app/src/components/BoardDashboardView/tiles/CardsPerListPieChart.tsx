import React, { useMemo } from 'react';
import { N40 } from '@trello/colors';
import { forTemplate } from '@trello/i18n';
import { CardCountTooltip } from '../CardCountTooltip';
import { TileContainer } from '../TileContainer';
import { useNonZeroDataPoints } from '../useNonZeroDataPoints';
import { useOtherDataPoints } from '../useOtherDataPoints';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { TileProps } from '../types';
import { PieChart, PieChartDataPoint } from '../charts/PieChart';
import { CardsPerListEmptyState } from './CardsPerListEmptyState';
import {
  useCardsPerListCurrentState,
  CardsPerListCurrentState,
} from './useCardsPerListCurrentState';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

const format = forTemplate('board_report');

const MAX_DATA_POINTS = 10;

type ListDataPoint = PieChartDataPoint &
  CardsPerListCurrentState[keyof CardsPerListCurrentState]['list'] & {
    name: string;
  };

function mapCardsPerListToDataPoints(
  cardsPerList: CardsPerListCurrentState,
): Array<ListDataPoint> {
  return Object.values(cardsPerList).map((c) => ({
    ...c.list,
    name: c.list.name,
    value: c.count,
  }));
}

interface CardsPerListPieChartProps extends TileProps {}

export const CardsPerListPieChart: React.FC<CardsPerListPieChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
  navigateToBoardView,
}) => {
  const { data, loading } = useCardsPerListCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);

  const allDataPoints = useMemo(
    () => (data ? mapCardsPerListToDataPoints(data) : []),
    [data],
  );
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
          color: N40,
        },
      ];
    }
    return individualDataPoints;
  }, [individualDataPoints, otherDataPoint]);

  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const tooltip = useMemo(() => {
    const numListDataPointsShown = individualDataPoints.length;
    if (numListDataPointsShown < allDataPoints.length) {
      return (
        <MaxDataPointsTooltip
          count={numListDataPointsShown}
          total={allDataPoints.length}
          text={format('most-populated-lists')}
        />
      );
    }
    return null;
  }, [individualDataPoints, allDataPoints]);

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
        <CardsPerListEmptyState navigateToBoardView={navigateToBoardView} />
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
