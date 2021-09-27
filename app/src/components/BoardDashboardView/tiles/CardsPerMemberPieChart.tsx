import React, { useMemo } from 'react';
import { N40 } from '@trello/colors';
import { sortDataPointsByValue } from '@trello/dashboard';

import { forTemplate } from '@trello/i18n';

import { PieChart } from '../charts/PieChart';
import { useTruncatedList } from '../useTruncatedList';
import { useNonZeroDataPoints } from '../useNonZeroDataPoints';
import { CardCountTooltip } from '../CardCountTooltip';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { TileContainer } from '../TileContainer';
import { TileProps } from '../types';

import { useCardsPerMemberDataPoints } from './useCardsPerMemberDataPoints';
import { useCardsPerMemberCurrentState } from './useCardsPerMemberCurrentState';
import { useTileMenuOptions } from './useTileMenuOptions';
import { CardsPerMemberEmptyState } from './CardsPerMemberEmptyState';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

const format = forTemplate('board_report');

const MAX_DATA_POINTS = 10;
const MAX_ASSIGNED_DATA_POINTS = MAX_DATA_POINTS - 1;

interface CardsPerMemberPieChartProps extends TileProps {}

export const CardsPerMemberPieChart: React.FC<CardsPerMemberPieChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
  navigateToBoardView,
}) => {
  const { data, loading } = useCardsPerMemberCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);
  const {
    assignedDataPoints = [],
    unassignedDataPoint = null,
  } = useCardsPerMemberDataPoints(data);

  const nonZeroAssignedDataPoints = useNonZeroDataPoints(assignedDataPoints);

  const truncatedAssignedDataPoints = useTruncatedList({
    list: nonZeroAssignedDataPoints,
    maxLength: MAX_ASSIGNED_DATA_POINTS,
    defaultSort: sortDataPointsByValue,
    overMaxSort: sortDataPointsByValue,
  });

  const dataPoints = useMemo(() => {
    if (unassignedDataPoint && unassignedDataPoint.value > 0) {
      const unassignedDataPointWithColor = {
        ...unassignedDataPoint,
        color: N40,
      };
      return [...truncatedAssignedDataPoints, unassignedDataPointWithColor];
    }
    return truncatedAssignedDataPoints;
  }, [truncatedAssignedDataPoints, unassignedDataPoint]);

  const tooltip = useMemo(() => {
    const numAssignedDataPointsShown = truncatedAssignedDataPoints.length;
    const numTotalAssignedDataPoints = assignedDataPoints.length;
    if (
      dataPoints.length !== 0 &&
      numAssignedDataPointsShown < numTotalAssignedDataPoints
    ) {
      return (
        <MaxDataPointsTooltip
          count={numAssignedDataPointsShown}
          total={numTotalAssignedDataPoints}
          text={format('most-active-members')}
        />
      );
    }
    return null;
  }, [
    truncatedAssignedDataPoints.length,
    assignedDataPoints.length,
    dataPoints.length,
  ]);

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
        <CardsPerMemberEmptyState navigateToBoardView={navigateToBoardView} />
      );
    }
  }, [dataPoints, navigateToBoardView, loading]);

  return (
    <TileContainer
      name={format('cards-per-member')}
      info={tooltip}
      menuOptions={menuOptions}
      loading={loading}
      error={error}
    >
      {content}
    </TileContainer>
  );
};
