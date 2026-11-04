import type { TDayPeriodLabels, TimePickerFormat } from '../types.js';
import { pad, periodOf, to12 } from './time.js';

export function formatDisplay(
  dayMinutes: number,
  format: TimePickerFormat,
  dayPeriods: TDayPeriodLabels,
): string {
  const hour = Math.floor(dayMinutes / 60);
  const minute = pad(dayMinutes % 60);

  if (format === '24h') {
    return `${pad(hour)}:${minute}`;
  }

  return `${to12(hour)}:${minute} ${dayPeriods[periodOf(hour)]}`;
}

export function getDayPeriodLabels(
  locale: string | undefined,
): TDayPeriodLabels {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hour12: true,
  });
  const labelFor = (hour: number) =>
    formatter
      .formatToParts(new Date(2000, 0, 1, hour))
      .find((part) => part.type === 'dayPeriod')?.value;

  return { am: labelFor(9) ?? 'AM', pm: labelFor(21) ?? 'PM' };
}
