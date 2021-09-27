import React, { useMemo } from 'react';
import { AdvancedDate } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';
import { TileProps } from '../types';
import { TimeseriesChart } from '../charts/TimeseriesChart';
import { TileContainer } from '../TileContainer';
import {
  useCardsPerMemberHistoryQuery,
  CardsPerMemberHistoryQuery,
} from './CardsPerMemberHistoryQuery.generated';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { useTruncatedList } from '../useTruncatedList';
import { TimeseriesTileTooltip } from './TimeseriesTileTooltip';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';
import { useTimeRangeStartDate } from './useTimeRangeStartDate';

const format = forTemplate('board_report');

const MAX_LINES = 6;

type Member = NonNullable<CardsPerMemberHistoryQuery['board']>['members'][0];

interface CardsPerMemberHistorical {
  complete: boolean;
  series: {
    member: Member;
    dataPoints: {
      date: Date;
      value: number;
    }[];
  }[];
}

const getCardsPerMemberHistorical = (
  cardsPerMember: NonNullable<
    NonNullable<CardsPerMemberHistoryQuery['board']>['history']
  >['cardsPerMember'],
  members: Member[],
): CardsPerMemberHistorical => {
  const indexedMembers = members.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<string, Member>);

  const mappedSeries = [];
  for (const series of cardsPerMember.series) {
    const member = indexedMembers[series.idMember];
    if (member) {
      mappedSeries.push({
        member,
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
    complete: cardsPerMember.complete,
    series: mappedSeries,
  };
};

const useCardsPerMemberHistory = (
  idBoard: string,
  from?: AdvancedDate | null,
): {
  data: CardsPerMemberHistorical | null;
  loading: boolean;
} => {
  const timeRangeStartDate = useTimeRangeStartDate(from);

  const { data, loading } = useCardsPerMemberHistoryQuery({
    variables: {
      idBoard,
      ...(timeRangeStartDate && { from: timeRangeStartDate.toISOString() }),
    },
  });

  const cardsPerMemberHistorical = useMemo(() => {
    if (!data || !data.board || !data.board.history) {
      return null;
    }

    return getCardsPerMemberHistorical(
      data.board.history.cardsPerMember,
      data.board.members,
    );
  }, [data]);
  return { data: cardsPerMemberHistorical, loading };
};

interface CardsPerMemberLineChartProps extends TileProps {}

export const CardsPerMemberLineChart: React.FC<CardsPerMemberLineChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
}) => {
  const { data, loading } = useCardsPerMemberHistory(idBoard, tile.from);
  const error = useDerivedTileQueryError(tile, data, loading);

  const memberSeries = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.series.map((series) => ({
      key: series.member.id,
      name: series.member.fullName ?? series.member.username,
      member: series.member,
      dataPoints: series.dataPoints,
    }));
  }, [data]);

  const truncatedSeries = useTruncatedList({
    list: memberSeries,
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
    if (truncatedSeries.length < memberSeries.length) {
      return (
        <MaxDataPointsTooltip
          count={truncatedSeries.length}
          total={memberSeries.length}
          text={format('most-active-members')}
        />
      );
    }
    return null;
  }, [truncatedSeries, memberSeries]);

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
      name={format('cards-per-member')}
      menuOptions={menuOptions}
      loading={loading}
      info={tooltip}
      error={error}
    >
      {content}
    </TileContainer>
  );
};
