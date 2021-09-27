import React, { useMemo } from 'react';
import { AdvancedDate, DueDateColorMap } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';
import { TileContainer } from '../TileContainer';
import { TimeseriesChart } from '../charts/TimeseriesChart';
import { TileProps } from '../types';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';
import {
  useCardsPerDueDateHistoryQuery,
  CardsPerDueDateHistoryQuery,
} from './CardsPerDueDateHistoryQuery.generated';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useTimeRangeStartDate } from './useTimeRangeStartDate';
import { TimeseriesTileTooltip } from './TimeseriesTileTooltip';

const format = forTemplate('board_report');

interface DataPoint {
  date: Date;
  value: number;
}

interface CardsPerDueDateHistorical {
  complete: boolean;
  series: {
    noDueDate: DataPoint[];
    dueSoon: DataPoint[];
    dueLater: DataPoint[];
    done: DataPoint[];
    overdue: DataPoint[];
  };
}

const getCardsPerDueDateHistorical = (
  cardsPerDueDate: NonNullable<
    NonNullable<CardsPerDueDateHistoryQuery['board']>['history']
  >['cardsPerDueDateStatus'],
): CardsPerDueDateHistorical => {
  const mapSeries = (series: { value: number; dateTime: string }[]) => {
    return series.map((dataPoint) => ({
      ...dataPoint,
      date: new Date(dataPoint.dateTime),
    }));
  };

  return {
    complete: cardsPerDueDate.complete,
    series: {
      noDueDate: mapSeries(cardsPerDueDate.series.noDueDate),
      dueSoon: mapSeries(cardsPerDueDate.series.dueSoon),
      dueLater: mapSeries(cardsPerDueDate.series.dueLater),
      done: mapSeries(cardsPerDueDate.series.done),
      overdue: mapSeries(cardsPerDueDate.series.overdue),
    },
  };
};

const useCardsPerDueDateHistory = (
  idBoard: string,
  from?: AdvancedDate | null,
) => {
  const timeRangeStartDate = useTimeRangeStartDate(from);

  const { data, loading } = useCardsPerDueDateHistoryQuery({
    variables: {
      idBoard,
      ...(timeRangeStartDate && { from: timeRangeStartDate.toISOString() }),
    },
  });
  const cardsPerDueDateHistorical = useMemo(() => {
    if (!data || !data.board || !data.board.history) {
      return null;
    }

    return getCardsPerDueDateHistorical(
      data.board.history.cardsPerDueDateStatus,
    );
  }, [data]);
  return { data: cardsPerDueDateHistorical, loading };
};

interface CardsPerDueDateLineChartProps extends TileProps {}

export const CardsPerDueDateLineChart = ({
  tile,
  idBoard,
  onEdit,
  onDelete,
}: CardsPerDueDateLineChartProps) => {
  const { data, loading } = useCardsPerDueDateHistory(idBoard, tile.from);
  const error = useDerivedTileQueryError(tile, data, loading);

  const dueDateSeries = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        key: 'done',
        name: format('complete'),
        dataPoints: data.series.done,
        color: DueDateColorMap.done,
      },
      {
        key: 'dueSoon',
        name: format('due-soon'),
        dataPoints: data.series.dueSoon,
        color: DueDateColorMap.dueSoon,
      },
      {
        key: 'dueLater',
        name: format('due-later'),
        dataPoints: data.series.dueLater,
        color: DueDateColorMap.dueLater,
      },
      {
        key: 'overdue',
        name: format('overdue'),
        dataPoints: data.series.overdue,
        color: DueDateColorMap.overdue,
      },
      {
        key: 'noDueDate',
        name: format('no-due-date'),
        dataPoints: data.series.noDueDate,
        color: DueDateColorMap.na,
      },
    ];
  }, [data]);

  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const content = useMemo(() => {
    if (dueDateSeries.length > 0) {
      return (
        <TimeseriesChart
          series={dueDateSeries}
          // eslint-disable-next-line react/jsx-no-bind
          tooltip={(payload) => {
            return <TimeseriesTileTooltip payload={payload} />;
          }}
        />
      );
    }
  }, [dueDateSeries]);
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
