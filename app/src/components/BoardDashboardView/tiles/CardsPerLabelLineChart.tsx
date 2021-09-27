import React, { useMemo } from 'react';
import { AdvancedDate, labelColorRotations } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';
import {
  useCardsPerLabelHistoryQuery,
  CardsPerLabelHistoryQuery,
} from './CardsPerLabelHistoryQuery.generated';
import { TileProps } from '../types';
import { TimeseriesChart } from '../charts/TimeseriesChart';
import { MaxDataPointsTooltip } from '../MaxDataPointsTooltip';
import { useTruncatedList } from '../useTruncatedList';
import { TileContainer } from '../TileContainer';
import { TimeseriesTileTooltip } from './TimeseriesTileTooltip';
import { useTileMenuOptions } from './useTileMenuOptions';
import { useTimeRangeStartDate } from './useTimeRangeStartDate';
import { useDerivedTileQueryError } from './useDerivedTileQueryError';

const format = forTemplate('board_report');

const MAX_LINES = 6;

type Label = NonNullable<CardsPerLabelHistoryQuery['board']>['labels'][0];

const getLabelSeriesName = (label: Label) => {
  if (label.name) {
    return label.name;
  }
  if (label.color) {
    try {
      const colorName = format(['label-colors', label.color]);
      return colorName;
    } catch (e) {
      // Act defensively if somehow a label has a color that we don't have a string for
      return '';
    }
  }
  // This should never be reached since a label cannot be both colorless and nameless, but
  // we want to act defensively instead of throwing an error if this somehow happens
  return '';
};

/*
 * Similar to how we only consider labels as "existing" on the current state
 * cards per label charts if they either have a name or have a non-zero current
 * usage count, we only consider labels as "existing" on the historical chart
 * if they have a name or have any non-zero data points in the series.
 */
const labelSeriesConsideredExisting = (
  series: CardsPerLabelHistorical['series'][0],
) => {
  const hasName = series.label.name !== '';
  const anyDataPointsNonZero = series.dataPoints.some(
    (dataPoint) => dataPoint.value !== 0,
  );
  return hasName || anyDataPointsNonZero;
};

interface CardsPerLabelHistorical {
  complete: boolean;
  series: {
    label: Label;
    dataPoints: {
      date: Date;
      value: number;
    }[];
  }[];
}

const getCardsPerLabelHistorical = (
  cardsPerLabel: NonNullable<
    NonNullable<CardsPerLabelHistoryQuery['board']>['history']
  >['cardsPerLabel'],
  labels: Label[],
): CardsPerLabelHistorical => {
  const indexedLabels = labels.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<string, Label>);

  const mappedSeries = [];
  for (const series of cardsPerLabel.series) {
    const label = indexedLabels[series.idLabel];
    if (label) {
      const labelSeries: CardsPerLabelHistorical['series'][0] = {
        label,
        dataPoints: series.dataPoints.map((dp) => {
          return {
            value: dp.value,
            date: new Date(dp.dateTime),
          };
        }),
      };
      if (labelSeriesConsideredExisting(labelSeries)) {
        mappedSeries.push(labelSeries);
      }
    }
  }

  return {
    complete: cardsPerLabel.complete,
    series: mappedSeries,
  };
};

const useCardsPerLabelHistory = (
  idBoard: string,
  from?: AdvancedDate | null,
): { data: CardsPerLabelHistorical | null; loading: boolean } => {
  const timeRangeStartDate = useTimeRangeStartDate(from);

  const { data, loading } = useCardsPerLabelHistoryQuery({
    variables: {
      idBoard,
      ...(timeRangeStartDate && { from: timeRangeStartDate.toISOString() }),
    },
  });

  const cardsPerLabelHistorical = useMemo(() => {
    if (!data || !data.board || !data.board.history) {
      return null;
    }

    return getCardsPerLabelHistorical(
      data.board.history.cardsPerLabel,
      data.board.labels,
    );
  }, [data]);
  return { data: cardsPerLabelHistorical, loading };
};

interface CardsPerLabelLineChartProps extends TileProps {}

export const CardsPerLabelLineChart: React.FC<CardsPerLabelLineChartProps> = ({
  idBoard,
  tile,
  onEdit,
  onDelete,
}) => {
  const { data, loading } = useCardsPerLabelHistory(idBoard, tile.from);
  const error = useDerivedTileQueryError(tile, data, loading);

  const labelSeries = useMemo(() => {
    if (!data) {
      return [];
    }

    const colorRotations = labelColorRotations();

    return data.series.map((series) => ({
      key: series.label.id,
      name: getLabelSeriesName(series.label),
      color: series.label.color
        ? colorRotations[series.label.color].next().value
        : null,
      label: series.label,
      dataPoints: series.dataPoints,
    }));
  }, [data]);

  const truncatedSeries = useTruncatedList({
    list: labelSeries,
    maxLength: MAX_LINES,
    overMaxSort: (series) => {
      return [...series].sort((series1, series2) => {
        const series1MostRecent = series1.dataPoints[0];
        const series2MostRecent = series2.dataPoints[0];

        return series2MostRecent.value - series1MostRecent.value;
      });
    },
  });

  const tooltip = useMemo(() => {
    if (truncatedSeries.length < labelSeries.length) {
      return (
        <MaxDataPointsTooltip
          count={truncatedSeries.length}
          total={labelSeries.length}
          text={format('most-popular-labels')}
        />
      );
    }
    return null;
  }, [truncatedSeries, labelSeries]);

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
      name={format('cards-per-label')}
      menuOptions={menuOptions}
      loading={loading}
      info={tooltip}
      error={error}
    >
      {content}
    </TileContainer>
  );
};
