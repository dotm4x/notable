import { Clock as ClockIcon } from 'lucide-react';
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { Popover } from '../popover/popover.js';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import './time-picker.css';

/** Display format for the trigger and the popup. */
export type TimePickerFormat = '12h' | '24h';

/**
 * Props for {@link TimePicker}, in addition to native `button` attributes.
 *
 * Values use the normalized `HH:mm` 24-hour string format, for example
 * `"09:30"` or `"23:05"`, regardless of `format`.
 */
export type TimePickerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'defaultValue' | 'type' | 'value'
> & {
  /** Selected time as `HH:mm` for controlled use. `null` or an invalid string shows the placeholder. Omit it to let the picker manage its own selection. */
  value?: string | null;
  /** Selected time as `HH:mm` when uncontrolled. Defaults to no selection. */
  defaultValue?: string | null;
  /** Called with the newly selected time as `HH:mm`. Not called when the selection is unchanged. */
  onValueChange?: (time: string) => void;
  /** Controlled open state of the popup. Omit it to let the picker manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the popup opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Prevents interaction. The trigger is disabled and the popup cannot open. */
  disabled?: boolean;
  /** Shows the selected time without allowing a change. The popup cannot open. */
  readOnly?: boolean;
  /** Text shown in the trigger when no time is selected. Defaults to `Select a time`. */
  placeholder?: string;
  /** Hour display. `24h` shows 00 to 23 without a period column. `12h` shows 1 to 12 with an AM/PM column. Defaults to `24h`. */
  format?: TimePickerFormat;
  /** Minute increment offered in the popup. Must be a whole number that divides 60. Defaults to `1`. */
  minuteStep?: number;
  /** Earliest selectable time as `HH:mm`, inclusive. */
  minTime?: string;
  /** Latest selectable time as `HH:mm`, inclusive. Must not be earlier than `minTime`. Ranges that cross midnight are not supported. */
  maxTime?: string;
  /** BCP 47 locale used for the AM and PM labels. Defaults to the runtime locale. */
  locale?: string;
};

type Period = 'am' | 'pm';

type Constraints = {
  step: number;
  min?: number;
  max?: number;
};

type DayPeriodLabels = Record<Period, string>;

const HOURS_24 = Array.from({ length: 24 }, (_, hour) => hour);
const HOURS_12 = Array.from({ length: 12 }, (_, index) => index + 1);
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseTime(value: string): number | undefined {
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

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toValue(dayMinutes: number): string {
  return `${pad(Math.floor(dayMinutes / 60))}:${pad(dayMinutes % 60)}`;
}

/** Converts a 24-hour value to the 1 to 12 hour shown in 12h mode. */
function to12(hour: number): number {
  return hour % 12 || 12;
}

/** Converts a 1 to 12 hour and period to a 24-hour value. */
function to24(hour12: number, period: Period): number {
  return (hour12 % 12) + (period === 'pm' ? 12 : 0);
}

function periodOf(hour: number): Period {
  return hour < 12 ? 'am' : 'pm';
}

function periodHours(period: Period): number[] {
  return period === 'am' ? HOURS_24.slice(0, 12) : HOURS_24.slice(12, 24);
}

function minuteGrid(step: number): number[] {
  return Array.from({ length: 60 / step }, (_, index) => index * step);
}

function isInRange({ min, max }: Constraints, dayMinutes: number): boolean {
  return (
    (min === undefined || dayMinutes >= min) &&
    (max === undefined || dayMinutes <= max)
  );
}

function isHourEnabled(constraints: Constraints, hour: number): boolean {
  return minuteGrid(constraints.step).some((minute) =>
    isInRange(constraints, hour * 60 + minute),
  );
}

function isMinuteEnabled(
  constraints: Constraints,
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

function resolveConstraints(
  step: number,
  minTime: string | undefined,
  maxTime: string | undefined,
): Constraints {
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

  const constraints: Constraints = { step, min, max };

  if (!HOURS_24.some((hour) => isHourEnabled(constraints, hour))) {
    throw new RangeError(
      'TimePicker minTime, maxTime, and minuteStep leave no selectable time.',
    );
  }

  return constraints;
}

/** Keeps the current minute when it is still allowed. Otherwise uses the first allowed minute of the hour. */
function pickDayMinutes(
  constraints: Constraints,
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

function firstEnabledHour(
  constraints: Constraints,
  hours: number[],
): number | undefined {
  return hours.find((hour) => isHourEnabled(constraints, hour));
}

function formatDisplay(
  dayMinutes: number,
  format: TimePickerFormat,
  dayPeriods: DayPeriodLabels,
): string {
  const hour = Math.floor(dayMinutes / 60);
  const minute = pad(dayMinutes % 60);

  if (format === '24h') {
    return `${pad(hour)}:${minute}`;
  }

  return `${to12(hour)}:${minute} ${dayPeriods[periodOf(hour)]}`;
}

function getDayPeriodLabels(locale: string | undefined): DayPeriodLabels {
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

/** Scrolls a column so its selected option is visible when the popup opens. */
function revealSelection(list: HTMLDivElement | null) {
  const checked = list?.querySelector('input:checked')?.closest('label');

  if (list && checked) {
    list.scrollTop =
      checked.offsetTop - list.clientHeight / 2 + checked.offsetHeight / 2;
  }
}

type TimeColumnProps = {
  legend: string;
  children: ReactNode;
};

function TimeColumn({ legend, children }: TimeColumnProps) {
  return (
    <fieldset className="notable-time-picker__column">
      <legend className="notable-time-picker__legend">{legend}</legend>
      <div className="notable-time-picker__list" ref={revealSelection}>
        {children}
      </div>
    </fieldset>
  );
}

type TimeOptionProps = {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  highlighted: boolean;
  onHover: (hovering: boolean) => void;
  onSelect: () => void;
};

function TimeOption({
  name,
  value,
  label,
  checked,
  disabled,
  highlighted,
  onHover,
  onSelect,
}: TimeOptionProps) {
  return (
    <label
      className="notable-time-picker__option"
      data-selected={checked ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-highlighted={highlighted ? '' : undefined}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <input
        className="notable-time-picker__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
      />
      <span>{label}</span>
    </label>
  );
}

/**
 * A time-of-day field that opens a popup with hour, minute, and optional
 * AM/PM choices. Each choice updates the value immediately, so the popup
 * stays open until the user closes it with Escape or an outside press.
 */
export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(
  function TimePicker(
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      open: openProp,
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
    if (
      selectedMinute !== undefined &&
      !minuteChoices.includes(selectedMinute)
    ) {
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

    const selectPeriod = (period: Period) => {
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

    const classes = ['notable-time-picker__trigger', className]
      .filter(Boolean)
      .join(' ');

    // The accessible name includes the visible value (WCAG 2.5.3).
    const labelledBy = ariaLabel
      ? `${labelId} ${valueId}`
      : ariaLabelledBy
        ? `${ariaLabelledBy} ${valueId}`
        : undefined;

    const hourName = `${groupId}-hour`;
    const minuteName = `${groupId}-minute`;
    const periodName = `${groupId}-period`;

    // One hovered key is shared by all columns, so a single highlight moves between them.
    const hoverProps = (key: string) => ({
      highlighted: hovered === key,
      onHover: (hovering: boolean) => setHovered(hovering ? key : null),
    });

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
              <span className="notable-time-picker__icon" aria-hidden="true">
                <ClockIcon />
              </span>
              <span
                id={valueId}
                className="notable-time-picker__value"
                data-placeholder={selected === undefined ? '' : undefined}
              >
                {displayText}
              </span>
            </button>
          </Popover.Trigger>
          <Popover.Content
            aria-label="Choose time"
            align="start"
            className="notable-time-picker__popup"
          >
            <div className="notable-time-picker__panel">
              <AnimatedHighlight followTargetShape />
              <TimeColumn legend="Hour">
                {format === '24h'
                  ? HOURS_24.map((hour) => (
                      <TimeOption
                        key={hour}
                        name={hourName}
                        value={String(hour)}
                        label={pad(hour)}
                        checked={selectedHour === hour}
                        disabled={!isHourEnabled(constraints, hour)}
                        {...hoverProps(`hour-${hour}`)}
                        onSelect={() => selectHour(hour)}
                      />
                    ))
                  : HOURS_12.map((hour12) => (
                      <TimeOption
                        key={hour12}
                        name={hourName}
                        value={String(hour12)}
                        label={pad(hour12)}
                        checked={
                          selectedHour !== undefined &&
                          to12(selectedHour) === hour12
                        }
                        disabled={!isHour12Enabled(hour12)}
                        {...hoverProps(`hour-${hour12}`)}
                        onSelect={() => selectHour12(hour12)}
                      />
                    ))}
              </TimeColumn>
              <TimeColumn legend="Minute">
                {minuteChoices.map((minute) => (
                  <TimeOption
                    key={minute}
                    name={minuteName}
                    value={String(minute)}
                    label={pad(minute)}
                    checked={selectedMinute === minute}
                    disabled={
                      !isMinuteEnabled(constraints, selectedHour, minute)
                    }
                    {...hoverProps(`minute-${minute}`)}
                    onSelect={() => selectMinute(minute)}
                  />
                ))}
              </TimeColumn>
              {format === '12h' && (
                <TimeColumn legend="AM/PM">
                  {(['am', 'pm'] as const).map((period) => (
                    <TimeOption
                      key={period}
                      name={periodName}
                      value={period}
                      label={dayPeriods[period]}
                      checked={selectedPeriod === period}
                      disabled={
                        firstEnabledHour(constraints, periodHours(period)) ===
                        undefined
                      }
                      {...hoverProps(`period-${period}`)}
                      onSelect={() => selectPeriod(period)}
                    />
                  ))}
                </TimeColumn>
              )}
            </div>
          </Popover.Content>
        </Popover>
      </>
    );
  },
);
