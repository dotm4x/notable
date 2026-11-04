import { CalendarRange, X } from '../../icons';
import { forwardRef, useId, useMemo, useState } from 'react';
import { Calendar } from '../calendar/calendar.js';
import { Popover } from '../popover/popover.js';
import { compareDays, EMPTY_RANGE, isSpanOpen } from './helpers/range.js';
import type { DateRange, DateRangePickerProps } from './types.js';
import './date-range-picker.css';

export type { DateRange, DateRangePickerProps } from './types.js';

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

  const classes = ['one-date-range-picker__trigger', className]
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
      <div className="one-date-range-picker">
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
              <span className="one-date-range-picker__icon" aria-hidden="true">
                <CalendarRange />
              </span>
              <span
                id={valueId}
                className="one-date-range-picker__value"
                data-placeholder={hasSelection ? undefined : ''}
              >
                {displayStart && displayEnd ? (
                  <>
                    {formatDay(displayStart)}
                    <span className="one-date-range-picker__separator">
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
            className="one-date-range-picker__clear"
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
