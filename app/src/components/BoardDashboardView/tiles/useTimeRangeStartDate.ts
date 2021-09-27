import { useMemo } from 'react';
import { AdvancedDate, getDateFromAdvancedDate } from '@trello/dashboard';
import moment from 'moment';

export const useTimeRangeStartDate = (date?: AdvancedDate | null) => {
  // Optimally we'd just be able to pass `from` through to
  // `getDateFromAdvancedDate`, but that would create a useMemo
  // dependency on `from`. This is an issue because for whatever reason,
  // the `from` reference on tiles changes even when that tile hasn't been
  // updated, so `timeRangeStartDate` would be get re-calculated
  // unnecessarily and cause a re-fetch of the history data.
  //
  // The exact cause of the object reference changes should be investigated
  // further at some point, but for now we're just going to write this logic
  // in a way that just creates dependencies on the individual primitive
  // `from` fields.
  return useMemo(() => {
    return moment(
      getDateFromAdvancedDate({
        dateType: date?.dateType ?? 'relative',
        value: date?.value ?? -604800000,
      }),
    )
      .utc()
      .startOf('day')
      .toDate();
  }, [date?.value, date?.dateType]);
};
