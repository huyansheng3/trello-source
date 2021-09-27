import React from 'react';
import {
  PieChart as RechartPieChart,
  Pie,
  Legend,
  Cell,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
} from 'recharts';

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
  N900,
} from '@trello/colors';

import { CustomLegend } from './common/CustomLegend';
import { ResponsiveContainerWrapper } from './common/ResponsiveContainerWrapper';

const DEFAULT_PALETTE = [
  TrelloBlue500,
  Green500,
  Orange500,
  Red500,
  Yellow500,
  Purple500,
  Pink500,
  Sky500,
  Lime500,
  N900,
];

function applyColorPalette<T extends PieChartDataPoint>(
  dataPoints: T[],
  palette: string[],
) {
  let currentPaletteIndex = 0;

  return dataPoints.map((dp) => {
    let color = dp.color;
    if (!color) {
      color = palette[currentPaletteIndex];
      currentPaletteIndex = (currentPaletteIndex + 1) % palette.length;
      return {
        ...dp,
        color,
      };
    }
    return dp;
  });
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active) {
    const dataPoint = payload?.[0]?.payload;
    if (dataPoint?.tooltip) {
      return <div>{dataPoint.tooltip(dataPoint)}</div>;
    }
  }
  return null;
};

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: readonly PieChartDataPoint[];
  tooltip?(dataPoint: PieChartDataPoint): React.ReactNode;
  palette?: string[];
}

export const PieChart: React.FC<PieChartProps> = ({
  data: dataPoints,
  tooltip,
  palette = DEFAULT_PALETTE,
}) => {
  let data = dataPoints.map((bar) => ({
    tooltip,
    ...bar,
  }));
  data = applyColorPalette(data, palette);

  return (
    <ResponsiveContainerWrapper>
      <ResponsiveContainer debounce={100}>
        <RechartPieChart>
          <Legend
            content={CustomLegend}
            layout="vertical"
            align="right"
            wrapperStyle={{
              height: '100%',
              minWidth: '20%',
              maxWidth: '25%',
              marginRight: '3%',
            }}
          />
          <Tooltip isAnimationActive={false} content={CustomTooltip} />
          <Pie data={data} dataKey="value" blendStroke>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </RechartPieChart>
      </ResponsiveContainer>
    </ResponsiveContainerWrapper>
  );
};
