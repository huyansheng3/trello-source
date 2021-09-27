import React, { useMemo } from 'react';
import moment from 'moment';
import { itemRotation, DataPoint } from '@trello/dashboard';
import {
  Sky500,
  TrelloBlue500,
  Yellow500,
  Red500,
  Purple500,
  Pink500,
  Green500,
  Orange500,
  Lime500,
  N300,
} from '@trello/colors';
import {
  LineChart as RechartLineChart,
  XAxis,
  YAxis,
  Line as RechartLine,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { scaleUtc } from 'd3-scale';
import { utcDay } from 'd3-time';
import { CustomLegend } from './common/CustomLegend';
import { ResponsiveContainerWrapper } from './common/ResponsiveContainerWrapper';

const getTicksForSeries = (series: readonly Series[]) => {
  const sortedSeries = series.map((s) => ({
    ...s,
    dataPoints: [...s.dataPoints].sort(
      (dp1, dp2) => dp1.date.getTime() - dp2.date.getTime(),
    ),
  }));

  if (sortedSeries.length === 0) {
    return [];
  }

  const minTime = Math.min(
    ...sortedSeries.map((s) => s.dataPoints[0].date.getTime()),
  );
  const maxTime = Math.max(
    ...sortedSeries.map((s) =>
      s.dataPoints[s.dataPoints.length - 1].date.getTime(),
    ),
  );

  const domain = [minTime, maxTime];
  const scale = scaleUtc().domain(domain).range([0, 1]);
  const ticks = scale.ticks(utcDay);

  return ticks.map((entry) => Number(entry));
};

/**
 * *
 * For Rechart's line charts with multiple lines, we have two options for passing
 * the data in
 *
 * 1. Pass the entire set of data in at the top level, and have each Line component
 *    reference a different dataKey, e.g.
 *       <LineChart data={[{time: 0, id1: 2, id2: 4}, { time: 1, id1: 3, id2: 1 }]}>
 *         <Line dataKey="id1" />
 *         <Line dataKey="id2" />
 *       </LineChart>
 *
 * 2. Pass each series of data in via a separate Line component, e.g.
 *      <Line data={[{time: 0, value: 2, seriesKey: 'id1'}, { time: 1, value: 3, seriesKey: 'id1' }]}
 *            dataKey="value"/>
 *      <Line data={[{time: 0, value: 4, seriesKey: 'id1'}, { time: 1, value: 1, seriesKey: 'id2' }]}
 *            dataKey="value"/>
 *      ...
 *
 *
 * #2 was initially chosen as it seemed like the cleaner API, and more closely mapped to the
 * API chosen for the TimeseriesChart `series` prop. When implementing the chart's tooltips, however
 * a major problem arose.
 *
 * For option #1, the data passed to the chart's tooltip component (either custom or using the
 * default one provided by Recharts), looks like this
 *
 * ```
 * [
 *   {
 *      name: ...
 *      color: ...
 *      dataKey: id1,
 *      ...other info not relating to the timeseries data itself,
 *      payload: { // this is confusingly also referred to as `payload`
 *        time: 0,
 *        id1: 1,
 *        id2: 2,
 *      }
 *   },
 *   {
 *      ...
 *      dataKey: value_id2,
 *      payload: { time: 0, id1: 1, id2: 2, }
 *   },
 *   ...
 * ]
 *
 *
 * So we can take the `dataKey` at the top level of the data, and use that to
 * pull the right value out of the `payload` field.
 *
 * For Option #2, it's supposed to look like this
 * ```
 * [
 *   {
 *     ...,
 *     payload: { time: 0, value: 1, seriesKey: 'id1' }
 *   }
 *   {
 *     ...,
 *     payload: { time: 0, value: 2, seriesKey: 'id2' }
 *   }
 * ]
 * ```
 *
 * But that's not what is getting passed, and instead every one of the `payload` fields was identical,
 * matching that of the first entry in the data. e.g.
 *
 * ```
 * [
 *   {
 *     ...,
 *     payload: { time: 0, value: 1, seriesKey: 'id1' }
 *   }
 *   {
 *     ...,
 *     payload: { time: 0, value: 1, seriesKey: 'id1' }
 *   }
 * ]
 * ```
 *
 * Workarounds were explored involving manually trying to pull the correct data from the `series`
 * data passed into the component, but that resulted in a lot of complexity in an ultimately
 * hacky and brittle solution.
 *
 * So, :deep-breathe:, in conclusion, we implement Option #1 in this method by merging all of the passed
 * in `series` data into one large data array to pass into the top-level `LineChart` component.
 *
 */
const getMergedSeriesData = (series: readonly Series[]) => {
  const mergedDataMap = new Map<
    number,
    {
      series: Series;
      dataPoint: DataPoint;
    }[]
  >();

  for (const s of series) {
    for (const dp of s.dataPoints) {
      const time = dp.date.getTime();
      if (!mergedDataMap.has(time)) {
        mergedDataMap.set(time, []);
      }
      mergedDataMap.get(time)?.push({
        series: s,
        dataPoint: dp,
      });
    }
  }

  const resultData = [];
  for (const [unixTime, dataPoints] of mergedDataMap) {
    const values = dataPoints.reduce((acc, curr) => {
      acc[curr.series.key] = curr.dataPoint.value;
      return acc;
    }, {} as Record<string, number>);

    resultData.push({
      unixTime,
      ...values,
    });
  }
  return resultData;
};

interface CustomTooltipProps {
  active: boolean;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  tooltip: TimeseriesChartProps['tooltip'];
}
const CustomTooltip = ({ active, payload, tooltip }: CustomTooltipProps) => {
  if (active && tooltip) {
    const firstPayloadEntry = payload[0];
    const unixTime = firstPayloadEntry.payload.unixTime;

    const tooltipPayload: TooltipPayload = {
      date: new Date(unixTime),
      dataPoints: [],
    };

    for (const payloadEntry of payload) {
      const seriesKey = payloadEntry.dataKey;
      tooltipPayload.dataPoints.push({
        date: new Date(payloadEntry.payload.unixTime),
        value: payloadEntry.payload[seriesKey],
        name: payloadEntry.name,
        color: payloadEntry.color,
        series: {
          key: seriesKey,
        },
      });
    }

    return <div>{tooltip(tooltipPayload)}</div>;
  }
  return null;
};

interface SeriesDataPoint extends DataPoint {
  date: Date;
}

interface Series {
  name: string;
  key: string;
  dataPoints: readonly SeriesDataPoint[];
  color?: string;
}

interface TimeseriesChartProps {
  series: readonly Series[];
  tooltip?: (payload: TooltipPayload) => React.ReactNode;
}

export interface TooltipPayload {
  date: Date;
  dataPoints: ({
    name: string;
    color: string;
    series: Pick<Series, 'key'>;
  } & SeriesDataPoint)[];
}

/**
 * Wraps a Recharts LineChart to chart timeseries data.
 *
 * --Ticks--
 * Recharts doesn't actually have the concept for a time-based chart
 * natively. A consequence of this is that the ticks generated for the chart's
 * x-axis aren't optimal, e.g. you may pass a series with per-day data from June 1
 * to June 7, and Recharts may decide to use ticks at points 06/07 12:42:11 and
 * 6/06 6:34:20, where we would prefer to have ticks at 6/07 00:00:00, 6/06 00:00:00,
 * and so on.
 *
 * To get around this, we generate our own ticks, using the d3-scale and d3-time
 * libraries (these two libraries are both actually used by Recharts internally).
 * Right now, this component will only generate ticks on a per-day interval, solely as
 * a result of not needing anything else at the time of creation.  If there ever is
 * a need to utilize this component with any other date interval, this component should be
 * generalized to support that.
 *
 */
export const TimeseriesChart: React.FC<TimeseriesChartProps> = ({
  series,
  tooltip,
}) => {
  const colorGenerator = itemRotation<string>([
    TrelloBlue500,
    Orange500,
    Red500,
    Yellow500,
    Green500,
    Purple500,
    Sky500,
    Pink500,
    Lime500,
  ]);

  const ticks = useMemo(() => {
    return getTicksForSeries(series);
  }, [series]);

  const data = useMemo(() => {
    return getMergedSeriesData(series);
  }, [series]);

  return (
    <ResponsiveContainerWrapper>
      <ResponsiveContainer width="100%" debounce={100}>
        <RechartLineChart data={data}>
          <Tooltip
            isAnimationActive={false}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/jsx-no-bind
            content={(props: any) => (
              <CustomTooltip tooltip={tooltip} {...props} />
            )}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Legend
            // eslint-disable-next-line react/jsx-no-bind
            content={(props) => (
              <div style={{ marginLeft: '40px', height: '100%' }}>
                <CustomLegend {...props} />
              </div>
            )}
            layout="vertical"
            align="right"
            wrapperStyle={{
              width: '25%',
              height: '100%',
            }}
          />
          <XAxis
            type="number"
            dataKey="unixTime"
            domain={['dataMin', 'dataMax']}
            tickLine={false}
            tick={{ fontSize: 12, dy: 12, fill: N300 }}
            // eslint-disable-next-line react/jsx-no-bind
            tickFormatter={(unixTime) => moment(unixTime).utc().format('M/D')}
            ticks={ticks}
          />
          <YAxis
            tick={{ fontSize: 12, fill: N300 }}
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            allowDecimals={false}
          />
          {series.map((s) => {
            const color = s.color ?? colorGenerator.next().value ?? '#8884d8';
            return (
              <RechartLine
                key={s.name}
                name={s.name}
                type="linear"
                dataKey={`${s.key}`}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 3 }}
              />
            );
          })}
        </RechartLineChart>
      </ResponsiveContainer>
    </ResponsiveContainerWrapper>
  );
};
