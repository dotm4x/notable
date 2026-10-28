import { CalendarRange, X } from 'lucide-react';
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
} from 'react';
import { Calendar, type CalendarDayOfWeek } from '../calendar/calendar.js';
import { Popover } from '../popover/popover.js';
import './date-range-picker.css';

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

const EMPTY_RANGE: DateRange = { start: null, end: null };
const DAY_MS = 86_400_000;

/** Compares calendar days, ignoring time of day and DST shifts. */
function compareDays(a: Date, b: Date) {
  return (
    Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) -
    Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  );
}

/** Returns `true` when no day from `start` through `end` is blocked. */
function isSpanOpen(start: Date, end: Date, isBlocked: (day: Date) => boolean) {
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

/**
 * A date range field that opens a range {@link Calendar} in a {@link Popover}.
 * The first click picks the start date and the second picks the end date. The
 * range is reported and the calendar closes once both dates are chosen.
 */
export const DateRangePicker = forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(function DateRangePicker(
  {
    value: valueProp,
    defaultValue = EMPTY_RANGE,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    readOnly = false,
    clearable = false,
    minDate,
    maxDate,
    isDateDisabled,
    placeholder = 'Select a date range',
    locale,
    weekStartsOn,
    formatDate,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...props
  },
  ref,
) {
  const labelId = useId();
  const valueId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  // The start chosen by the first click, before the end is picked.
  const [pendingStart, setPendingStart] = useState<Date | null>(null);

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;
  const isInteractive = !disabled && !readOnly;
  const isOpen = isInteractive && (openProp ?? internalOpen);

  const formatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale],
  );
  const formatDay = (day: Date) => formatDate?.(day) ?? formatter.format(day);

  // While a start is pending, it replaces the committed range in the display.
  const displayStart = pendingStart ?? value.start;
  const displayEnd = pendingStart ? null : value.end;
  // The date the next click completes. A lone committed start also continues.
  const anchor = pendingStart ?? (value.end ? null : value.start);
  const hasSelection =
    pendingStart !== null || value.start !== null || value.end !== null;

  const displayText = displayStart
    ? displayEnd
      ? `${formatDay(displayStart)} – ${formatDay(displayEnd)}`
      : formatDay(displayStart)
    : placeholder;

  const isBlocked = (day: Date) =>
    (minDate !== undefined && compareDays(day, minDate) < 0) ||
    (maxDate !== undefined && compareDays(day, maxDate) > 0) ||
    isDateDisabled?.(day) === true;

  const setOpen = (nextOpen: boolean) => {
    if (!isInteractive) {
      return;
    }

    if (!nextOpen) {
      setPendingStart(null);
    }
    if (openProp === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const commit = (range: DateRange) => {
    if (!isValueControlled) {
      setInternalValue(range);
    }
    setPendingStart(null);
    onValueChange?.(range);
  };

  const handlePick = (day: Date) => {
    // A day before the anchor, or a span crossing a blocked day, restarts from the clicked day.
    if (
      anchor === null ||
      compareDays(day, anchor) < 0 ||
      !isSpanOpen(anchor, day, isBlocked)
    ) {
      setPendingStart(day);
      return;
    }

    commit({ start: anchor, end: day });
    setOpen(false);
  };

  const handleClear = () => {
    commit(EMPTY_RANGE);
  };

  const classes = ['notable-date-range-picker__trigger', className]
    .filter(Boolean)
    .join(' ');

  // The accessible name must include the visible value (WCAG 2.5.3).
  const labelledBy = ariaLabel
    ? `${labelId} ${valueId}`
    : ariaLabelledBy
      ? `${ariaLabelledBy} ${valueId}`
      : undefined;

  return (
    <>
      {ariaLabel && (
        <span id={labelId} hidden>
          {ariaLabel}
        </span>
      )}
      <div className="notable-date-range-picker">
        <Popover open={isOpen} onOpenChange={setOpen}>
          <Popover.Trigger>
            <button
              {...props}
              ref={ref}
              type="button"
              disabled={disabled}
              className={classes}
              aria-labelledby={labelledBy}
              data-readonly={readOnly || undefined}
            >
              <span
                className="notable-date-range-picker__icon"
                aria-hidden="true"
              >
                <CalendarRange />
              </span>
              <span
                id={valueId}
                className="notable-date-range-picker__value"
                data-placeholder={hasSelection ? undefined : ''}
              >
                {displayStart && displayEnd ? (
                  <>
                    {formatDay(displayStart)}
                    <span className="notable-date-range-picker__separator">
                      {' – '}
                    </span>
                    {formatDay(displayEnd)}
                  </>
                ) : (
                  displayText
                )}
              </span>
            </button>
          </Popover.Trigger>
          <Popover.Content aria-label="Choose date range" align="start">
            <Calendar
              value={null}
              onValueChange={handlePick}
              rangeStart={displayStart}
              rangeEnd={displayEnd}
              defaultMonth={displayStart ?? undefined}
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isDateDisabled}
              locale={locale}
              weekStartsOn={weekStartsOn}
            />
          </Popover.Content>
        </Popover>
        {clearable && isInteractive && hasSelection && (
          <button
            type="button"
            className="notable-date-range-picker__clear"
            aria-label="Clear date range"
            onClick={handleClear}
          >
            <X aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  );
});
