import { Calendar as CalendarIcon } from 'lucide-react';
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
} from 'react';
import { Calendar } from '../calendar/calendar.js';
import { Popover } from '../popover/popover.js';
import './date-picker.css';

/** Props for {@link DatePicker}, in addition to native `button` attributes. */
export type DatePickerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'defaultValue' | 'type' | 'value'
> & {
  /** Selected date for controlled use. `null` means no date is selected. Omit it to let the picker manage its own selection. */
  value?: Date | null;
  /** Selected date when uncontrolled. Defaults to no selection. */
  defaultValue?: Date | null;
  /** Called with the newly selected date. Not called when the selected date is chosen again. */
  onValueChange?: (date: Date) => void;
  /** Controlled open state of the calendar popup. Omit it to let the picker manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Prevents interaction. The trigger is disabled and the calendar cannot open. */
  disabled?: boolean;
  /** Shows the selected date without allowing a change. The calendar cannot open. */
  readOnly?: boolean;
  /** Earliest selectable date. Only its calendar day is used. */
  minDate?: Date;
  /** Latest selectable date. Only its calendar day is used. */
  maxDate?: Date;
  /** Returns `true` for dates that cannot be selected. */
  isDateDisabled?: (date: Date) => boolean;
  /** Text shown in the trigger when no date is selected. Defaults to `Select a date`. */
  placeholder?: string;
  /** BCP 47 locale used to format the selected date and the calendar. Defaults to the runtime locale. */
  locale?: string;
  /** Formats the selected date for the trigger. Replaces the default locale-aware format. */
  formatDate?: (date: Date) => string;
};

/**
 * A date field that opens a {@link Calendar} in a {@link Popover}. Selecting an
 * enabled date updates the value, reports it, and closes the calendar.
 */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      readOnly = false,
      minDate,
      maxDate,
      isDateDisabled,
      placeholder = 'Select a date',
      locale,
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

    const isValueControlled = valueProp !== undefined;
    const value = isValueControlled ? valueProp : internalValue;
    const isInteractive = !disabled && !readOnly;
    const isOpen = isInteractive && (openProp ?? internalOpen);

    const formatter = useMemo(
      () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
      [locale],
    );
    const displayText = value
      ? (formatDate?.(value) ?? formatter.format(value))
      : placeholder;

    const setOpen = (nextOpen: boolean) => {
      if (!isInteractive) {
        return;
      }

      if (openProp === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    };

    const handleSelect = (date: Date) => {
      if (!isValueControlled) {
        setInternalValue(date);
      }
      onValueChange?.(date);
      setOpen(false);
    };

    const classes = ['notable-date-picker__trigger', className]
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
              <span className="notable-date-picker__icon" aria-hidden="true">
                <CalendarIcon />
              </span>
              <span
                id={valueId}
                className="notable-date-picker__value"
                data-placeholder={value ? undefined : ''}
              >
                {displayText}
              </span>
            </button>
          </Popover.Trigger>
          <Popover.Content aria-label="Choose date" align="start">
            <Calendar
              value={value}
              onValueChange={handleSelect}
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isDateDisabled}
              locale={locale}
            />
          </Popover.Content>
        </Popover>
      </>
    );
  },
);
