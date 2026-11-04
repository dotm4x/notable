import type { DateRange } from '../types.js';

export const EMPTY_RANGE: DateRange = { start: null, end: null };

const DAY_MS = 86_400_000;

/** Compares calendar days, ignoring time of day and DST shifts. */
export function compareDays(a: Date, b: Date) {
  return (
    Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) -
    Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  );
}

/** Returns `true` when no day from `start` through `end` is blocked. */
export function isSpanOpen(
  start: Date,
  end: Date,
  isBlocked: (day: Date) => boolean,
) {
  const dayCount = Math.round(compareDays(end, start) / DAY_MS);

  for (let offset = 0; offset <= dayCount; offset++) {
    const day = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + offset,
    );

    if (isBlocked(day)) {
      return false;
    }
  }

  return true;
}
