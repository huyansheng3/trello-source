import { DataPoint } from '@trello/dashboard';

export const useNonZeroDataPoints = <T extends DataPoint>(
  dataPoints: readonly T[],
) => {
  return dataPoints.reduce((acc, curr) => {
    if (curr.value > 0) {
      acc.push(curr);
    }
    return acc;
  }, [] as T[]);
};
