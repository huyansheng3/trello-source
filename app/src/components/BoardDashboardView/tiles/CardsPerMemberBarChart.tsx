import React, { useMemo } from 'react';
import { sortDataPointsByAZ, sortDataPointsByValue } from '@trello/dashboard';

import { CardCountTooltip } from '../CardCountTooltip';
import { BarChart } from '../charts/BarChart';
import { TileContainer } from '../TileContainer';
import { useTruncatedList } from '../useTruncatedList';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { TileProps } from '../types';

import {
  useCardsPerMemberDataPoints,
  MemberDataPoint,
} from './useCardsPerMemberDataPoints';
import { useCardsPerMemberCurrentState } from './useCardsPerMemberCurrentState';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_report');

const MAX_DATA_POINTS = 10;

interface CardsPerMemberBarChartProps extends TileProps {}
export const CardsPerMemberBarChart: React.FC<CardsPerMemberBarChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
}) => {
  const { data, loading } = useCardsPerMemberCurrentState(idBoard);
  const error = useDerivedTileQueryError(tile, data, loading);

  const {
    assignedDataPoints = [],
    unassignedDataPoint = null,
  } = useCardsPerMemberDataPoints(data);

  const dataPoints = useTruncatedList<MemberDataPoint>({
    list: assignedDataPoints,
    // Leaving space at the end for the unassigned bar
    maxLength: MAX_DATA_POINTS - 1,
    defaultSort: sortDataPointsByAZ,
    overMaxSort: sortDataPointsByValue,
  });

  const dataPointsWithUnassigned = useMemo(() => {
    if (unassignedDataPoint) {
      return [...dataPoints, unassignedDataPoint];
    }
    return dataPoints;
  }, [dataPoints, unassignedDataPoint]);

  const tooltip = useMemo(() => {
    const allAssignedDataPoints = assignedDataPoints.filter(
      (b) => b.kind === 'assigned',
    );
    const shownAssignedDataPoints = dataPoints.filter(
      (b) => b.kind === 'assigned',
    );
    if (shownAssignedDataPoints.length < allAssignedDataPoints.length) {
      return (
        <MaxDataPointsTooltip
          count={shownAssignedDataPoints.length}
          total={allAssignedDataPoints.length}
          text={format('most-active-members')}
        />
      );
    }
  }, [assignedDataPoints, dataPoints]);

  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const content = useMemo(() => {
    if (dataPointsWithUnassigned.length > 0) {
      return (
        <BarChart
          dataPoints={dataPointsWithUnassigned}
          // eslint-disable-next-line react/jsx-no-bind
          tooltip={({ name, value }) => (
            <CardCountTooltip label={name} count={value} />
          )}
        />
      );
    }
  }, [dataPointsWithUnassigned]);

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
