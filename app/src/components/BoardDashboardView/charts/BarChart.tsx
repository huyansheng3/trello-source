import React from 'react';
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Text,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { DataPoint } from '@trello/dashboard';
import { N300, N500 } from '@trello/colors';
import { ResponsiveContainerWrapper } from './common/ResponsiveContainerWrapper';

const DEFAULT_BAR_COLOR = N500;

function truncate(s: string, maxLength: number) {
  return s.length > maxLength ? s.substring(0, maxLength - 1) + '…' : s;
}

interface CustomAxisProps {
  x: number;
  y: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;

  visibleTicksCount: number;
}

const XAxisTick = ({
  x,
  y,
  payload,
  visibleTicksCount,
  ...props
}: CustomAxisProps) => {
  const hasManyBars = visibleTicksCount > 5;

  const angle = hasManyBars ? -45 : 0;
  const textAnchor = hasManyBars ? 'end' : 'middle';
  const dx = hasManyBars ? 5 : 0;
  const dy = hasManyBars ? 0 : 12;
  const text = truncate(payload.value, 14);
  return (
    <Text
      {...props}
      textAnchor={textAnchor}
      x={x}
      y={y}
      dx={dx}
      dy={dy}
      angle={angle}
      fontSize={12}
      fill={N300}
    >
      {text}
    </Text>
  );
};

interface CustomTooltipProps {
  active: boolean;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active) {
    const bar = payload?.[0]?.payload;
    if (bar?.tooltip) {
      return <div>{bar.tooltip(bar)}</div>;
    }
  }
  return null;
};

export type BarChartDataPoint = DataPoint & {
  name: string;
  color?: string;
  tooltip?(bar: BarChartDataPoint): React.ReactNode;
};

interface BarChartProps {
  dataPoints: readonly BarChartDataPoint[];
  color?: string;
  tooltip?(bar: BarChartDataPoint): React.ReactNode;
}

/**
 * BarChart will completely fill the container that it is rendered inside of, and
 * automatically resize.
 */
export const BarChart = ({ dataPoints, color, tooltip }: BarChartProps) => {
  const data = dataPoints.map((dp) => ({
    color: color ?? DEFAULT_BAR_COLOR,
    tooltip,
    ...dp,
  }));
  return (
    <ResponsiveContainerWrapper>
      <ResponsiveContainer width="100%" debounce={100}>
        <RechartBarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            tick={XAxisTick}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: N300 }}
            tickMargin={20}
            allowDecimals={false}
          />
          <Tooltip isAnimationActive={false} content={CustomTooltip} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={color}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </RechartBarChart>
      </ResponsiveContainer>
    </ResponsiveContainerWrapper>
  );
};
