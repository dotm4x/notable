import type { TPeriod, TTimeConstraints } from '../types.js';

export const HOURS_24 = Array.from({ length: 24 }, (_, hour) => hour);
export const HOURS_12 = Array.from({ length: 12 }, (_, index) => index + 1);

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseTime(value: string): number | undefined {
  const match = TIME_PATTERN.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
}

function parseBound(value: string, name: string): number {
  const minutes = parseTime(value);

  if (minutes === undefined) {
    throw new RangeError(
      `TimePicker ${name} must use the HH:mm format, received "${value}".`,
    );
  }

  return minutes;
}

export function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toValue(dayMinutes: number): string {
  return `${pad(Math.floor(dayMinutes / 60))}:${pad(dayMinutes % 60)}`;
}

/** Converts a 24-hour value to the 1 to 12 hour shown in 12h mode. */
export function to12(hour: number): number {
  return hour % 12 || 12;
}

/** Converts a 1 to 12 hour and period to a 24-hour value. */
export function to24(hour12: number, period: TPeriod): number {
  return (hour12 % 12) + (period === 'pm' ? 12 : 0);
}

export function periodOf(hour: number): TPeriod {
  return hour < 12 ? 'am' : 'pm';
}

export function periodHours(period: TPeriod): number[] {
  return period === 'am' ? HOURS_24.slice(0, 12) : HOURS_24.slice(12, 24);
}

export function minuteGrid(step: number): number[] {
  return Array.from({ length: 60 / step }, (_, index) => index * step);
}

export function isInRange(
  { min, max }: TTimeConstraints,
  dayMinutes: number,
): boolean {
  return (
    (min === undefined || dayMinutes >= min) &&
    (max === undefined || dayMinutes <= max)
  );
}

export function isHourEnabled(
  constraints: TTimeConstraints,
  hour: number,
): boolean {
  return minuteGrid(constraints.step).some((minute) =>
    isInRange(constraints, hour * 60 + minute),
  );
}

export function isMinuteEnabled(
  constraints: TTimeConstraints,
  hour: number | undefined,
  minute: number,
): boolean {
  if (hour === undefined) {
    return HOURS_24.some((candidate) =>
      isInRange(constraints, candidate * 60 + minute),
    );
  }

  return isInRange(constraints, hour * 60 + minute);
}

export function resolveConstraints(
  step: number,
  minTime: string | undefined,
  maxTime: string | undefined,
): TTimeConstraints {
  if (!Number.isInteger(step) || step < 1 || 60 % step !== 0) {
    throw new RangeError(
      `TimePicker minuteStep must be a whole number that divides 60, received ${step}.`,
    );
  }

  const min =
    minTime === undefined ? undefined : parseBound(minTime, 'minTime');
  const max =
    maxTime === undefined ? undefined : parseBound(maxTime, 'maxTime');

  if (min !== undefined && max !== undefined && min > max) {
    throw new RangeError(
      'TimePicker minTime must not be later than maxTime. Ranges that cross midnight are not supported.',
    );
  }

  const constraints: TTimeConstraints = { step, min, max };

  if (!HOURS_24.some((hour) => isHourEnabled(constraints, hour))) {
    throw new RangeError(
      'TimePicker minTime, maxTime, and minuteStep leave no selectable time.',
    );
  }

  return constraints;
}

/** Keeps the current minute when it is still allowed. Otherwise uses the first allowed minute of the hour. */
export function pickDayMinutes(
  constraints: TTimeConstraints,
  hour: number,
  minute: number | undefined,
): number | undefined {
  if (minute !== undefined && isInRange(constraints, hour * 60 + minute)) {
    return hour * 60 + minute;
  }

  const first = minuteGrid(constraints.step).find((candidate) =>
    isInRange(constraints, hour * 60 + candidate),
  );

  return first === undefined ? undefined : hour * 60 + first;
}

export function firstEnabledHour(
  constraints: TTimeConstraints,
  hours: number[],
): number | undefined {
  return hours.find((hour) => isHourEnabled(constraints, hour));
}
