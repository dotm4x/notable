import { useId, useMemo, useState } from 'react';
import { formatDisplay, getDayPeriodLabels } from '../helpers/format.js';
import {
  firstEnabledHour,
  HOURS_24,
  isHourEnabled,
  isInRange,
  isMinuteEnabled,
  minuteGrid,
  parseTime,
  periodHours,
  periodOf,
  pickDayMinutes,
  resolveConstraints,
  to24,
  toValue,
} from '../helpers/time.js';
import type { TPeriod, TimePickerFormat } from '../types.js';

type TUseTimePickerOptions = {
  value: string | null | undefined;
  defaultValue: string | null;
  onValueChange: ((time: string) => void) | undefined;
  open: boolean | undefined;
  defaultOpen: boolean;
  onOpenChange: ((open: boolean) => void) | undefined;
  disabled: boolean;
  readOnly: boolean;
  placeholder: string;
  format: TimePickerFormat;
  minuteStep: number;
  minTime: string | undefined;
  maxTime: string | undefined;
  locale: string | undefined;
};

export function useTimePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled,
  readOnly,
  placeholder,
  format,
  minuteStep,
  minTime,
  maxTime,
  locale,
}: TUseTimePickerOptions) {
  const valueId = useId();
  const groupId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState<string | null>(null);

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;
  const isInteractive = !disabled && !readOnly;
  const isOpen = isInteractive && (openProp ?? internalOpen);

  const constraints = useMemo(
    () => resolveConstraints(minuteStep, minTime, maxTime),
    [minuteStep, minTime, maxTime],
  );
  const dayPeriods = useMemo(() => getDayPeriodLabels(locale), [locale]);

  const selected = value ? parseTime(value) : undefined;
  const selectedHour =
    selected === undefined ? undefined : Math.floor(selected / 60);
  const selectedMinute = selected === undefined ? undefined : selected % 60;
  const selectedPeriod =
    selectedHour === undefined ? undefined : periodOf(selectedHour);

  const displayText =
    selected === undefined
      ? placeholder
      : formatDisplay(selected, format, dayPeriods);

  // Keeps an off-grid value (for example, from a controlled value) selectable so it stays visible.
  const minuteChoices = minuteGrid(constraints.step);
  if (selectedMinute !== undefined && !minuteChoices.includes(selectedMinute)) {
    minuteChoices.push(selectedMinute);
    minuteChoices.sort((a, b) => a - b);
  }

  const setOpen = (nextOpen: boolean) => {
    if (!isInteractive) {
      return;
    }

    if (openProp === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const commit = (dayMinutes: number | undefined) => {
    if (dayMinutes === undefined || dayMinutes === selected) {
      return;
    }

    const next = toValue(dayMinutes);
    if (!isValueControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const selectHour = (hour: number) =>
    commit(pickDayMinutes(constraints, hour, selectedMinute));

  const selectHour12 = (hour12: number) => {
    const period =
      selectedPeriod ??
      (isHourEnabled(constraints, to24(hour12, 'am')) ? 'am' : 'pm');

    selectHour(to24(hour12, period));
  };

  const selectMinute = (minute: number) => {
    const hour =
      selectedHour ??
      HOURS_24.find((candidate) =>
        isInRange(constraints, candidate * 60 + minute),
      );

    if (hour !== undefined) {
      commit(hour * 60 + minute);
    }
  };

  const selectPeriod = (period: TPeriod) => {
    const preferred =
      selectedHour === undefined
        ? undefined
        : (selectedHour % 12) + (period === 'pm' ? 12 : 0);
    const hour =
      preferred !== undefined && isHourEnabled(constraints, preferred)
        ? preferred
        : firstEnabledHour(constraints, periodHours(period));

    if (hour !== undefined) {
      commit(pickDayMinutes(constraints, hour, selectedMinute));
    }
  };

  const isHour12Enabled = (hour12: number) =>
    selectedPeriod === undefined
      ? isHourEnabled(constraints, to24(hour12, 'am')) ||
        isHourEnabled(constraints, to24(hour12, 'pm'))
      : isHourEnabled(constraints, to24(hour12, selectedPeriod));

  const hourName = `${groupId}-hour`;
  const minuteName = `${groupId}-minute`;
  const periodName = `${groupId}-period`;

  return {
    valueId,
    groupId,
    isOpen,
    setOpen,
    format,
    constraints,
    dayPeriods,
    selected,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    displayText,
    minuteChoices,
    hovered,
    setHovered,
    selectHour,
    selectHour12,
    selectMinute,
    selectPeriod,
    isHourEnabled: (hour: number) => isHourEnabled(constraints, hour),
    isHour12Enabled,
    isMinuteEnabled: (minute: number) =>
      isMinuteEnabled(constraints, selectedHour, minute),
    hourName,
    minuteName,
    periodName,
  };
}

export type TTimePickerState = ReturnType<typeof useTimePicker>;
