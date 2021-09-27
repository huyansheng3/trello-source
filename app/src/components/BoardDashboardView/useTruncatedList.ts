import { useMemo } from 'react';

interface UseTruncatedListOptions<T> {
  list: readonly T[];
  maxLength: number;
  defaultSort?(list: readonly T[]): readonly T[];
  overMaxSort(list: readonly T[]): readonly T[];
}

export const useTruncatedList = <T>({
  list,
  maxLength,
  defaultSort = (list) => list,
  overMaxSort,
}: UseTruncatedListOptions<T>): readonly T[] => {
  return useMemo(() => {
    const isOverMaxLength = list.length > maxLength;
    if (!isOverMaxLength) {
      return defaultSort([...list]);
    }
    return overMaxSort([...list]).slice(0, maxLength);
  }, [list, maxLength, defaultSort, overMaxSort]);
};
