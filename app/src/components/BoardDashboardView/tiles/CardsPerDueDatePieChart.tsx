import React, { useMemo } from 'react';

import { forTemplate } from '@trello/i18n';

import { PieChart } from '../charts/PieChart';
import { CardCountTooltip } from '../CardCountTooltip';
import { TileContainer } from '../TileContainer';
import { TileProps } from '../types';

import { useCardsPerDueDateDataPoints } from './useCardsPerDueDateDataPoints';
import { CardsPerDueDateEmptyState } from './CardsPerDueDateEmptyState';
import { useCardsPerDueDateCurrentState } from './useCardsPerDueDateCurrentState';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

const format = forTemplate('board_report');

interface CardsPerDueDatePieChartProps extends TileProps {}

export const CardsPerDueDatePieChart: React.FC<CardsPerDueDatePieChartProps> = ({
  idBoard,
  tile,
  navigateToBoardView,
  onEdit,
  onDelete,
}) => {
  const { data, loading } = useCardsPerDueDateCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);
  const dataPoints = useCardsPerDueDateDataPoints(data);

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
        <CardsPerDueDateEmptyState navigateToBoardView={navigateToBoardView} />
      );
    }
  }, [dataPoints, navigateToBoardView, loading]);

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
