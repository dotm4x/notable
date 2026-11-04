const MS_PER_DAY = 86_400_000;

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Keeps the day of the month, clamping it to the length of the target month. */
export function addMonths(date: Date, months: number) {
  const monthIndex = getMonthIndex(date) + months;
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex - year * 12;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(date.getDate(), daysInMonth));
}

export function getMonthIndex(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

/** Calendar day number in UTC, so comparisons ignore time of day and DST. */
export function getDayIndex(date: Date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY,
  );
}

export function isSameDay(a: Date | null | undefined, b: Date) {
  return a != null && getDayIndex(a) === getDayIndex(b);
}

export function isSameMonth(a: Date, b: Date) {
  return getMonthIndex(a) === getMonthIndex(b);
}

function padTwoDigits(value: number) {
  return String(value).padStart(2, '0');
}

export function getDateKey(date: Date) {
  return `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`;
}

export function clampDate(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && getDayIndex(date) < getDayIndex(minDate)) {
    return startOfDay(minDate);
  }

  if (maxDate && getDayIndex(date) > getDayIndex(maxDate)) {
    return startOfDay(maxDate);
  }

  return date;
}
