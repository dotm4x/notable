import { forwardRef, useId } from 'react';
import { Clock as ClockIcon } from '../../icons';
import { Popover } from '../popover/popover.js';
import { useTimePicker } from './hooks/use-time-picker.js';
import { TimePickerPopup } from './parts/popup.js';
import type { TimePickerProps } from './types.js';
import './time-picker.css';

export type { TimePickerFormat, TimePickerProps } from './types.js';

/**
 * A time-of-day field that opens a popup with hour, minute, and optional
 * AM/PM choices. Each choice updates the value immediately, so the popup
 * stays open until the user closes it with Escape or an outside press.
 */
export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(
  function TimePicker(
    {
      value,
      defaultValue = null,
      onValueChange,
      open,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      readOnly = false,
      placeholder = 'Select a time',
      format = '24h',
      minuteStep = 1,
      minTime,
      maxTime,
      locale,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) {
    const labelId = useId();
    const picker = useTimePicker({
      value,
      defaultValue,
      onValueChange,
      open,
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
    });

    const classes = ['one-time-picker__trigger', className]
      .filter(Boolean)
      .join(' ');

    // The accessible name includes the visible value (WCAG 2.5.3).
    const labelledBy = ariaLabel
      ? `${labelId} ${picker.valueId}`
      : ariaLabelledBy
        ? `${ariaLabelledBy} ${picker.valueId}`
        : undefined;

    return (
      <>
        {ariaLabel && (
          <span id={labelId} hidden>
            {ariaLabel}
          </span>
        )}
        <Popover open={picker.isOpen} onOpenChange={picker.setOpen}>
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
              <span className="one-time-picker__icon" aria-hidden="true">
                <ClockIcon />
              </span>
              <span
                id={picker.valueId}
                className="one-time-picker__value"
                data-placeholder={
                  picker.selected === undefined ? '' : undefined
                }
              >
                {picker.displayText}
              </span>
            </button>
          </Popover.Trigger>
          <TimePickerPopup picker={picker} />
        </Popover>
      </>
    );
  },
);
