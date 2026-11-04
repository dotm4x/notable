import type { ButtonHTMLAttributes } from 'react';
import type { CalendarDayOfWeek } from '../calendar/calendar.js';

/** A selected date range. Either bound is `null` while it is not chosen. */
export type DateRange = {
  start: Date | null;
  end: Date | null;
};

/** Props for {@link DateRangePicker}, in addition to native `button` attributes. */
export type DateRangePickerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'defaultValue' | 'type' | 'value'
> & {
  /** Selected range for controlled use. Omit it to let the picker manage its own selection. */
  value?: DateRange;
  /** Selected range when uncontrolled. Defaults to no selection. */
  defaultValue?: DateRange;
  /** Called with the new range each time a range is completed or cleared. */
  onValueChange?: (range: DateRange) => void;
  /** Controlled open state of the calendar popup. Omit it to let the picker manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Prevents interaction. The trigger is disabled and the calendar cannot open. */
  disabled?: boolean;
  /** Shows the selected range without allowing a change. The calendar cannot open. */
  readOnly?: boolean;
  /** Shows a button that clears the selected range. */
  clearable?: boolean;
  /** Earliest selectable date. Only its calendar day is used. */
  minDate?: Date;
  /** Latest selectable date. Only its calendar day is used. */
  maxDate?: Date;
  /** Returns `true` for dates that cannot be selected. A range cannot span them. */
  isDateDisabled?: (date: Date) => boolean;
  /** Text shown in the trigger when no range is selected. Defaults to `Select a date range`. */
  placeholder?: string;
  /** BCP 47 locale used to format the dates and the calendar. Defaults to the runtime locale. */
  locale?: string;
  /** First day of the week in the calendar, from `0` (Sunday) to `6` (Saturday). */
  weekStartsOn?: CalendarDayOfWeek;
  /** Formats each date in the trigger. Replaces the default locale-aware format. */
  formatDate?: (date: Date) => string;
};
