import { addDays, getDayIndex, startOfDay } from './date.js';

export type TCalendarRange = {
  start: Date;
  /** `null` while only the start is chosen. */
  end: Date | null;
  isPreview: boolean;
};

export type TDayRangeState = {
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isPreview: boolean;
};

const NO_DAY_RANGE_STATE: TDayRangeState = {
  isStart: false,
  isEnd: false,
  isInRange: false,
  isPreview: false,
};

export function getDayRangeState(
  day: Date,
  range: TCalendarRange | null,
): TDayRangeState {
  if (!range) {
    return NO_DAY_RANGE_STATE;
  }

  const index = getDayIndex(day);
  const startIndex = getDayIndex(range.start);
  const endIndex = range.end === null ? null : getDayIndex(range.end);

  return {
    isStart: index === startIndex,
    isEnd: index === endIndex,
    isInRange: endIndex !== null && index >= startIndex && index <= endIndex,
    isPreview: range.isPreview,
  };
}

function isEnabledSpan(
  start: Date,
  end: Date,
  isDayDisabled: (date: Date) => boolean,
) {
  for (
    let day = start;
    getDayIndex(day) <= getDayIndex(end);
    day = addDays(day, 1)
  ) {
    if (isDayDisabled(day)) {
      return false;
    }
  }

  return true;
}

export function getCalendarRange({
  rangeStart,
  rangeEnd,
  hoveredDay,
  isDayDisabled,
}: {
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoveredDay: Date | null;
  isDayDisabled: (date: Date) => boolean;
}): TCalendarRange | null {
  if (!rangeStart) {
    return null;
  }

  const start = startOfDay(rangeStart);
  if (rangeEnd) {
    return { start, end: startOfDay(rangeEnd), isPreview: false };
  }

  if (
    hoveredDay &&
    getDayIndex(hoveredDay) >= getDayIndex(start) &&
    isEnabledSpan(start, startOfDay(hoveredDay), isDayDisabled)
  ) {
    return { start, end: startOfDay(hoveredDay), isPreview: true };
  }

  return { start, end: null, isPreview: false };
}
