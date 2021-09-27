import React, { useMemo } from 'react';
import { AdvancedDate } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';
import { TileProps } from '../types';
import { TimeseriesChart } from '../charts/TimeseriesChart';
import { TileContainer } from '../TileContainer';
import {
  useCardsPerListHistoryQuery,
  CardsPerListHistoryQuery,
} from './CardsPerListHistoryQuery.generated';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { useTruncatedList } from '../useTruncatedList';
import { TimeseriesTileTooltip } from './TimeseriesTileTooltip';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';
import { useTimeRangeStartDate } from './useTimeRangeStartDate';

const format = forTemplate('board_report');

const MAX_LINES = 6;

type List = NonNullable<CardsPerListHistoryQuery['board']>['lists'][0];

interface CardsPerListHistorical {
  complete: boolean;
  series: {
    list: List;
    dataPoints: {
      date: Date;
      value: number;
    }[];
  }[];
}

const getCardsPerListHistorical = (
  cardsPerList: NonNullable<
    NonNullable<CardsPerListHistoryQuery['board']>['history']
  >['cardsPerList'],
  lists: List[],
): CardsPerListHistorical => {
  const indexedLists = lists.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<string, List>);

  const mappedSeries = [];
  for (const series of cardsPerList.series) {
    const list = indexedLists[series.idList];
    if (list) {
      mappedSeries.push({
        list,
        dataPoints: series.dataPoints.map((dp) => {
          return {
            value: dp.value,
            date: new Date(dp.dateTime),
          };
        }),
      });
    }
  }

  return {
    complete: cardsPerList.complete,
    series: mappedSeries,
  };
};

const useCardsPerListHistory = (
  idBoard: string,
  from?: AdvancedDate | null,
): {
  data: CardsPerListHistorical | null;
  loading: boolean;
} => {
  const timeRangeStartDate = useTimeRangeStartDate(from);

  const { data, loading } = useCardsPerListHistoryQuery({
    variables: {
      idBoard,
      ...(timeRangeStartDate && { from: timeRangeStartDate.toISOString() }),
    },
  });

  const cardsPerListHistorical = useMemo(() => {
    if (!data || !data.board || !data.board.history) {
      return null;
    }

    return getCardsPerListHistorical(
      data.board.history.cardsPerList,
      data.board.lists,
    );
  }, [data]);
  return { data: cardsPerListHistorical, loading };
};

interface CardsPerListLineChartProps extends TileProps {}

export const CardsPerListLineChart: React.FC<CardsPerListLineChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
}) => {
  const { data, loading } = useCardsPerListHistory(idBoard, tile.from);
  const error = useDerivedTileQueryError(tile, data, loading);

  const listSeries = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.series.map((series) => ({
      key: series.list.id,
      name: series.list.name,
      list: series.list,
      dataPoints: series.dataPoints,
    }));
  }, [data]);

  const truncatedSeries = useTruncatedList({
    list: listSeries,
    maxLength: MAX_LINES,
    overMaxSort: (series) => {
      return [...series].sort((l1, l2) => {
        const l1MostRecent = l1.dataPoints[0];
        const l2MostRecent = l2.dataPoints[0];

        return l2MostRecent.value - l1MostRecent.value;
      });
    },
  });

  const tooltip = useMemo(() => {
    if (truncatedSeries.length < listSeries.length) {
      return (
        <MaxDataPointsTooltip
          count={truncatedSeries.length}
          total={listSeries.length}
          text={format('most-populated-lists')}
        />
      );
    }
    return null;
  }, [truncatedSeries, listSeries]);

  const menuOptions = useTileMenuOptions(tile, {
    onEdit,
    onDelete,
  });

  const content = useMemo(() => {
    if (truncatedSeries.length > 0) {
      return (
        <TimeseriesChart
          series={truncatedSeries}
          // eslint-disable-next-line react/jsx-no-bind
          tooltip={(payload) => {
            return <TimeseriesTileTooltip payload={payload} />;
          }}
        />
      );
    }
  }, [truncatedSeries]);

  return (
    <TileContainer
      name={format('cards-per-list')}
      menuOptions={menuOptions}
      loading={loading}
      info={tooltip}
      error={error}
    >
      {content}
    </TileContainer>
  );
};
