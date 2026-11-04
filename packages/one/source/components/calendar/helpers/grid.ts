import type { CalendarDayOfWeek } from '../types.js';
import { addDays, clampDate, isSameMonth, startOfMonth } from './date.js';

export type TCalendarWeekday = {
  key: CalendarDayOfWeek;
  short: string;
  long: string;
};

export const DAYS_PER_WEEK = 7;
const WEEKS_PER_MONTH = 6;
// Sunday, 7 January 2024. Its formatted weekdays provide localized names without hardcoded English.
const REFERENCE_SUNDAY = new Date(2024, 0, 7);

export function getWeekOffset(date: Date, weekStartsOn: CalendarDayOfWeek) {
  return (date.getDay() - weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK;
}

/** Always six weeks, so the grid height does not change between months. */
export function getWeeks(month: Date, weekStartsOn: CalendarDayOfWeek) {
  const firstDay = startOfMonth(month);
  const gridStart = addDays(firstDay, -getWeekOffset(firstDay, weekStartsOn));
  const days = Array.from(
    { length: WEEKS_PER_MONTH * DAYS_PER_WEEK },
    (_, index) => addDays(gridStart, index),
  );

  return Array.from({ length: WEEKS_PER_MONTH }, (_, week) =>
    days.slice(week * DAYS_PER_WEEK, (week + 1) * DAYS_PER_WEEK),
  );
}

export function getWeekdays(
  weekStartsOn: CalendarDayOfWeek,
  locale: string | undefined,
): TCalendarWeekday[] {
  const shortFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const longFormat = new Intl.DateTimeFormat(locale, { weekday: 'long' });

  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => {
    const day = addDays(
      REFERENCE_SUNDAY,
      (weekStartsOn + index) % DAYS_PER_WEEK,
    );

    return {
      key: day.getDay() as CalendarDayOfWeek,
      short: shortFormat.format(day),
      long: longFormat.format(day),
    };
  });
}

export function getFocusDate({
  focusedDate,
  selected,
  today,
  visibleMonth,
  minDate,
  maxDate,
}: {
  focusedDate: Date | null;
  selected: Date | null;
  today: Date;
  visibleMonth: Date;
  minDate?: Date;
  maxDate?: Date;
}) {
  if (focusedDate && isSameMonth(focusedDate, visibleMonth)) {
    return focusedDate;
  }

  if (selected && isSameMonth(selected, visibleMonth)) {
    return selected;
  }

  if (isSameMonth(today, visibleMonth)) {
    return today;
  }

  return clampDate(startOfMonth(visibleMonth), minDate, maxDate);
}
