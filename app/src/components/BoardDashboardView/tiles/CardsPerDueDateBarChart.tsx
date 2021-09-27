import React, { useMemo } from 'react';
import { BoardReportsViewTestIds } from '@trello/test-ids';

import { forTemplate } from '@trello/i18n';

import { BarChart } from '../charts/BarChart';
import { TileContainer } from '../TileContainer';
import { CardCountTooltip } from '../CardCountTooltip';
import { TileProps } from '../types';

import { useCardsPerDueDateDataPoints } from './useCardsPerDueDateDataPoints';
import { CardsPerDueDateEmptyState } from './CardsPerDueDateEmptyState';
import { useCardsPerDueDateCurrentState } from './useCardsPerDueDateCurrentState';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

const format = forTemplate('board_report');

interface CardsPerDueDateBarChartProps extends TileProps {}

export const CardsPerDueDateBarChart: React.FC<CardsPerDueDateBarChartProps> = ({
  idBoard,
  tile,
  navigateToBoardView,
  onEdit,
  onDelete,
}) => {
  const { data, loading } = useCardsPerDueDateCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);
  const dataPoints = useCardsPerDueDateDataPoints(data);
  const anyDataPointsNonZero = useMemo(
    () => dataPoints.some((b) => b.value !== 0),
    [dataPoints],
  );
  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const content = useMemo(() => {
    if (anyDataPointsNonZero) {
      return (
        <span data-test-id={BoardReportsViewTestIds.CardsPerDueDateBarChart}>
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
        <span data-test-id={BoardReportsViewTestIds.CardsPerDueDateEmptyState}>
          <CardsPerDueDateEmptyState
            navigateToBoardView={navigateToBoardView}
          />
        </span>
      );
    }
  }, [anyDataPointsNonZero, dataPoints, loading, navigateToBoardView]);

  return (
    <TileContainer
      name={format('cards-per-due-date')}
      menuOptions={menuOptions}
      loading={loading}
      error={error}
    >
      {content}
    </TileContainer>
  );
};
