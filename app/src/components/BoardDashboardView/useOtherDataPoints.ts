import { useMemo } from 'react';
import { DataPoint } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('board_report');

export function useOtherDataPoints<T extends DataPoint & { name: string }>(
  maxLength: number,
  dataPoints: T[],
) {
  return useMemo(() => {
    const sorted = [...dataPoints].sort((dp1, dp2) => dp2.value - dp1.value);
    if (dataPoints.length <= maxLength) {
      return {
        dataPoints: sorted,
        individualDataPoints: sorted,
        otherDataPoint: null,
      };
    } else {
      // Leaving room for the "Other" data point
      const numIndividualDataPoints = maxLength - 1;
      const individualDataPoints = sorted.slice(0, numIndividualDataPoints);
      const otherDataPoints = sorted.slice(numIndividualDataPoints);
      const otherDataPoint = otherDataPoints.reduce(
        (acc, curr) => {
          acc.value += curr.value;
          return acc;
        },
        {
          name: format('other'),
          value: 0,
        } as T,
      );

      if (otherDataPoint.value === 0) {
        return {
          dataPoints: individualDataPoints,
          individualDataPoints,
          otherDataPoint: null,
        };
      } else {
        return {
          dataPoints: [...individualDataPoints, otherDataPoint],
          individualDataPoints,
          otherDataPoint,
        };
      }
    }
  }, [dataPoints, maxLength]);
}
