/* eslint-disable @trello/export-matches-filename, @trello/disallow-filenames */
import moment, { unitOfTime } from 'moment';
import { Side } from '../types';
import { MONTH_BOUNDARIES } from '../constants';

// translate an offset (in pixels) to days
export const getDaysOffset = (
  currentXPos: number,
  initialXPos: number,
  colWidth: number,
) => {
  return Math.round((currentXPos - initialXPos) / colWidth);
};

// get the new css width and left of the item based on side and offset
export const getNewMeasurements = (
  oldWidth: number,
  oldLeft: number,
  offset: number,
  colWidth: number,
  side: Side,
) => {
  const pixelOffset = offset * colWidth;
  if (side === 'left') {
    const width = oldWidth - pixelOffset;
    if (width >= colWidth) {
      return {
        newWidth: width,
        newLeft: oldLeft + pixelOffset,
      };
    }
  } else if (side === 'right') {
    const width = oldWidth + pixelOffset;
    if (width >= colWidth) {
      return {
        newWidth: width,
        newLeft: oldLeft,
      };
    }
  }
  return null;
};

// get new start and end dates based on side and offset
export const getNewDates = (
  oldStartTime: number,
  oldEndTime: number,
  offset: number,
  offsetUnit: unitOfTime.DurationConstructor,
  side: Side,
) => {
  let newStart, newDue;
  if (side === 'left') {
    newStart = moment(oldStartTime).add(offset, offsetUnit);
    newDue = moment(oldEndTime);
    // ensure start is before due
    if (newStart.valueOf() > newDue.valueOf()) {
      newStart = newDue.clone().startOf(offsetUnit);
    }
  } else if (side === 'right') {
    newStart = moment(oldStartTime);
    newDue = moment(oldEndTime).add(offset, offsetUnit);
    // ensure due is after start
    if (newStart.valueOf() > newDue.valueOf()) {
      newDue = newStart.clone().endOf(offsetUnit);
    }
  }
  return { newStart, newDue };
};

const getStartIndexForYear = (date: number) => {
  return MONTH_BOUNDARIES.findIndex(({ end }) => date <= end);
};

const adjustResizeDateForYear = (
  offset: number,
  startIndex: number,
  endIndex: number,
  date: moment.Moment,
) => {
  if (offset > 0 && endIndex < startIndex) {
    return date.add(1, 'month');
  } else if (offset < 0 && endIndex > startIndex) {
    return date.subtract(1, 'month');
  }
  return date;
};

/**
 * Year zoom resizing logic is a little weird.
 * Because months don't have a consistent number of days,
 * the month is divided into four sections: 1 - 7, 8 - 15, 16 - 23, 24 - End of Month
 * 1. Shift the date by whole months and use the resulting date to calculate the start index.
 * 2. The date ranges of each section are stored into an array.
 * 3. Calculate the end index using the start index and decimal offset,
 *    wrapping the value around the indices of the array.
 *    For example, going back 1 decimal offset from starting index 0 would bring you to index 3.
 * 4. Make any adjustments to the current month based on the start/end indices.
 * 5. Adjust the new start or end date using the value stored in the array
 *    or in some excpetions, end of month or start of month.
 */
export const getNewDatesForYear = (
  oldStartTime: number,
  oldEndTime: number,
  offset: number,
  offsetUnit: unitOfTime.DurationConstructor,
  side: Side,
) => {
  let newStart = moment(oldStartTime);
  let newDue = moment(oldEndTime);
  const decimalOffset = (offset % 1) / 0.25;

  if (side === 'left') {
    newStart = newStart.add(Math.trunc(offset), offsetUnit);
    const startIndex = getStartIndexForYear(newStart.date());
    const endIndex = Math.abs(startIndex + decimalOffset + 4) % 4;

    newStart = adjustResizeDateForYear(offset, startIndex, endIndex, newStart);

    if (endIndex === 0) {
      newStart = newStart.startOf('month');
    } else {
      newStart = newStart
        .startOf('month')
        .add(MONTH_BOUNDARIES[endIndex].start - 1, 'days');
    }

    // ensure start is before due
    if (newStart.valueOf() > newDue.valueOf()) {
      newStart = newDue.clone().startOf(offsetUnit);
    }
  } else if (side === 'right') {
    newDue = newDue.add(Math.trunc(offset), offsetUnit);
    const startIndex = getStartIndexForYear(newDue.date());
    const endIndex = Math.abs(startIndex + decimalOffset + 4) % 4;

    newDue = adjustResizeDateForYear(offset, startIndex, endIndex, newDue);

    if (endIndex === 3) {
      newDue = newDue.endOf('month');
    } else {
      newDue = newDue
        .startOf('month')
        .add(MONTH_BOUNDARIES[endIndex].end - 1, 'days');
    }
    // ensure due is after start
    if (newStart.valueOf() > newDue.valueOf()) {
      newDue = newStart.clone().endOf(offsetUnit);
    }
  }

  return { newStart, newDue };
};
