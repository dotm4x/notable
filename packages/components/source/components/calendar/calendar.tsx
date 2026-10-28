import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from 'motion/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import { AutoSize } from '../../internal/primitives/auto-size/auto-size.js';
import { DURATION_BASE, EASING_STANDARD } from '../../styles/motion.js';
import { Button } from '../button/button.js';
import './calendar.css';

/** Day of the week, where `0` is Sunday and `6` is Saturday. */
export type CalendarDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Props for {@link Calendar}, in addition to native `div` attributes. */
export type CalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue'
> & {
  /** Selected date for controlled use. `null` means no date is selected. Omit it to let the calendar manage its own selection. */
  value?: Date | null;
  /** Selected date when uncontrolled. Defaults to no selection. */
  defaultValue?: Date | null;
  /** Called with the newly selected date. Not called when the selected date is chosen again. */
  onValueChange?: (date: Date) => void;
  /** Visible month for controlled use. Only its year and month are used. */
  month?: Date;
  /** Visible month when uncontrolled. Defaults to the month of `defaultValue`, or the current month. */
  defaultMonth?: Date;
  /** Called with the first day of the newly visible month. */
  onMonthChange?: (month: Date) => void;
  /** Earliest selectable date. Earlier dates are disabled and navigation stops before its month. */
  minDate?: Date;
  /** Latest selectable date. Later dates are disabled and navigation stops after its month. */
  maxDate?: Date;
  /** Prevents any interaction with the calendar. Defaults to `false`. */
  disabled?: boolean;
  /** Returns `true` for dates that cannot be selected. */
  isDateDisabled?: (date: Date) => boolean;
  /** First day of each week. Defaults to `0` (Sunday). */
  weekStartsOn?: CalendarDayOfWeek;
  /** BCP 47 locale for month, weekday, and date labels. Defaults to the user's locale. */
  locale?: string;
  /**
   * First day of a range to highlight. The highlight is separate from `value`,
   * so a range picker can pass `value={null}` and handle each day press itself.
   */
  rangeStart?: Date | null;
  /**
   * Last day of a range to highlight. While it is `null` and `rangeStart` is
   * set, hovering an enabled day on or after `rangeStart` previews the range.
   */
  rangeEnd?: Date | null;
};

type CalendarWeekday = {
  key: CalendarDayOfWeek;
  short: string;
  long: string;
};

const MS_PER_DAY = 86_400_000;
const MONTH_SLIDE_OFFSET = 24;
const WEEKS_PER_MONTH = 6;
const DAYS_PER_WEEK = 7;
// Sunday, 7 January 2024. Its formatted weekdays provide localized names without hardcoded English.
const REFERENCE_SUNDAY = new Date(2024, 0, 7);

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Keeps the day of the month, clamping it to the length of the target month. */
function addMonths(date: Date, months: number) {
  const monthIndex = getMonthIndex(date) + months;
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex - year * 12;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(date.getDate(), daysInMonth));
}

function getMonthIndex(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

/** Calendar day number in UTC, so comparisons ignore time of day and DST. */
function getDayIndex(date: Date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY,
  );
}

function isSameDay(a: Date | null | undefined, b: Date) {
  return a != null && getDayIndex(a) === getDayIndex(b);
}

function isSameMonth(a: Date, b: Date) {
  return getMonthIndex(a) === getMonthIndex(b);
}

function padTwoDigits(value: number) {
  return String(value).padStart(2, '0');
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`;
}

function clampDate(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && getDayIndex(date) < getDayIndex(minDate)) {
    return startOfDay(minDate);
  }

  if (maxDate && getDayIndex(date) > getDayIndex(maxDate)) {
    return startOfDay(maxDate);
  }

  return date;
}

type CalendarRange = {
  start: Date;
  /** `null` while only the start is chosen. */
  end: Date | null;
  isPreview: boolean;
};

type DayRangeState = {
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isPreview: boolean;
};

const NO_DAY_RANGE_STATE: DayRangeState = {
  isStart: false,
  isEnd: false,
  isInRange: false,
  isPreview: false,
};

function getDayRangeState(
  day: Date,
  range: CalendarRange | null,
): DayRangeState {
  if (!range) {
    return NO_DAY_RANGE_STATE;
  }

  const index = getDayIndex(day);
  const startIndex = getDayIndex(range.start);
  const endIndex = range.end === null ? null : getDayIndex(range.end);

  return {
    isStart: index === startIndex,
    isEnd: index === endIndex,
    isInRange: endIndex !== null && index >= startIndex && index <= endIndex,
    isPreview: range.isPreview,
  };
}

function isEnabledSpan(
  start: Date,
  end: Date,
  isDayDisabled: (date: Date) => boolean,
) {
  for (
    let day = start;
    getDayIndex(day) <= getDayIndex(end);
    day = addDays(day, 1)
  ) {
    if (isDayDisabled(day)) {
      return false;
    }
  }

  return true;
}

function getCalendarRange({
  rangeStart,
  rangeEnd,
  hoveredDay,
  isDayDisabled,
}: {
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoveredDay: Date | null;
  isDayDisabled: (date: Date) => boolean;
}): CalendarRange | null {
  if (!rangeStart) {
    return null;
  }

  const start = startOfDay(rangeStart);
  if (rangeEnd) {
    return { start, end: startOfDay(rangeEnd), isPreview: false };
  }

  if (
    hoveredDay &&
    getDayIndex(hoveredDay) >= getDayIndex(start) &&
    isEnabledSpan(start, startOfDay(hoveredDay), isDayDisabled)
  ) {
    return { start, end: startOfDay(hoveredDay), isPreview: true };
  }

  return { start, end: null, isPreview: false };
}

function getWeekOffset(date: Date, weekStartsOn: CalendarDayOfWeek) {
  return (date.getDay() - weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK;
}

/** Always six weeks, so the grid height does not change between months. */
function getWeeks(month: Date, weekStartsOn: CalendarDayOfWeek) {
  const firstDay = startOfMonth(month);
  const gridStart = addDays(firstDay, -getWeekOffset(firstDay, weekStartsOn));
  const days = Array.from(
    { length: WEEKS_PER_MONTH * DAYS_PER_WEEK },
    (_, index) => addDays(gridStart, index),
  );

  return Array.from({ length: WEEKS_PER_MONTH }, (_, week) =>
    days.slice(week * DAYS_PER_WEEK, (week + 1) * DAYS_PER_WEEK),
  );
}

function getWeekdays(
  weekStartsOn: CalendarDayOfWeek,
  locale: string | undefined,
): CalendarWeekday[] {
  const shortFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const longFormat = new Intl.DateTimeFormat(locale, { weekday: 'long' });

  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => {
    const day = addDays(
      REFERENCE_SUNDAY,
      (weekStartsOn + index) % DAYS_PER_WEEK,
    );

    return {
      key: day.getDay() as CalendarDayOfWeek,
      short: shortFormat.format(day),
      long: longFormat.format(day),
    };
  });
}

function getFocusDate({
  focusedDate,
  selected,
  today,
  visibleMonth,
  minDate,
  maxDate,
}: {
  focusedDate: Date | null;
  selected: Date | null;
  today: Date;
  visibleMonth: Date;
  minDate?: Date;
  maxDate?: Date;
}) {
  if (focusedDate && isSameMonth(focusedDate, visibleMonth)) {
    return focusedDate;
  }

  if (selected && isSameMonth(selected, visibleMonth)) {
    return selected;
  }

  if (isSameMonth(today, visibleMonth)) {
    return today;
  }

  return clampDate(startOfMonth(visibleMonth), minDate, maxDate);
}

type CalendarMonthProps = {
  month: Date;
  weekStartsOn: CalendarDayOfWeek;
  weekdays: CalendarWeekday[];
  dayFormatter: Intl.DateTimeFormat;
  titleId: string;
  /** Day that receives the tab stop. `null` removes every tab stop. */
  focusDate: Date | null;
  selected: Date | null;
  today: Date;
  direction: number;
  reduceMotion: boolean;
  isDayDisabled: (date: Date) => boolean;
  onSelectDay: (date: Date) => void;
  onFocusDay: (date: Date) => void;
  onDayKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
  hoveredDay: Date | null;
  onHoverDay: (day: Date) => void;
  range: CalendarRange | null;
};

/**
 * One month grid. While it is leaving during a month transition, it is hidden
 * from assistive technology and removed from the tab order so only the
 * entering month is interactive.
 */
function CalendarMonth({
  month,
  weekStartsOn,
  weekdays,
  dayFormatter,
  titleId,
  focusDate,
  selected,
  today,
  direction,
  reduceMotion,
  isDayDisabled,
  onSelectDay,
  onFocusDay,
  onDayKeyDown,
  hoveredDay,
  onHoverDay,
  range,
}: CalendarMonthProps) {
  const isPresent = useIsPresent();
  const weeks = getWeeks(month, weekStartsOn);
  const slideOffset = reduceMotion ? 0 : MONTH_SLIDE_OFFSET;

  return (
    <motion.div
      className="notable-calendar__month"
      data-active={isPresent ? '' : undefined}
      aria-hidden={isPresent ? undefined : true}
      custom={direction}
      variants={{
        enter: (step: number) => ({ x: step * slideOffset, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (step: number) => ({ x: step * -slideOffset, opacity: 0 }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        duration: reduceMotion ? 0 : DURATION_BASE,
        ease: EASING_STANDARD,
      }}
    >
      <table
        className="notable-calendar__grid"
        role="grid"
        aria-labelledby={titleId}
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                key={weekday.key}
                scope="col"
                className="notable-calendar__weekday"
              >
                <abbr title={weekday.long}>{weekday.short}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={getDateKey(week[0])}>
              {week.map((day) => {
                const dayKey = getDateKey(day);
                const isOutside = !isSameMonth(day, month);
                const isSelected = isSameDay(selected, day);
                const isToday = isSameDay(today, day);
                const isDisabled = isDayDisabled(day);
                const isTabStop =
                  isPresent && focusDate !== null && isSameDay(focusDate, day);
                const dayRange = getDayRangeState(day, range);
                const isEndpoint = dayRange.isStart || dayRange.isEnd;
                const isRangeMember = dayRange.isInRange && !dayRange.isPreview;

                return (
                  <td
                    key={dayKey}
                    role="gridcell"
                    aria-selected={
                      isSelected || dayRange.isStart || isRangeMember
                    }
                    className="notable-calendar__cell"
                    data-in-range={dayRange.isInRange ? '' : undefined}
                    data-range-start={dayRange.isStart ? '' : undefined}
                    data-range-end={dayRange.isEnd ? '' : undefined}
                    data-preview={
                      dayRange.isInRange && dayRange.isPreview ? '' : undefined
                    }
                  >
                    <button
                      type="button"
                      className="notable-calendar__day"
                      data-date={dayKey}
                      aria-label={dayFormatter.format(day)}
                      aria-current={isToday ? 'date' : undefined}
                      aria-disabled={isDisabled || undefined}
                      tabIndex={isTabStop ? 0 : -1}
                      data-selected={isSelected || isEndpoint ? '' : undefined}
                      data-today={isToday ? '' : undefined}
                      data-outside={isOutside ? '' : undefined}
                      data-disabled={isDisabled ? '' : undefined}
                      data-preview={
                        dayRange.isPreview && isEndpoint ? '' : undefined
                      }
                      data-highlighted={
                        isSameDay(hoveredDay, day) && !isDisabled
                          ? ''
                          : undefined
                      }
                      onPointerEnter={() => onHoverDay(day)}
                      onClick={() => onSelectDay(day)}
                      onFocus={() => onFocusDay(day)}
                      onKeyDown={(event) => onDayKeyDown(event, day)}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

/**
 * Month grid for choosing one date. Supports controlled and uncontrolled
 * selection and visible month, minimum and maximum dates, and individually
 * disabled dates. Use the arrow keys, Home, End, and Page Up/Down to move
 * focus between dates.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
    {
      className,
      value,
      defaultValue,
      onValueChange,
      month,
      defaultMonth,
      onMonthChange,
      minDate,
      maxDate,
      disabled = false,
      isDateDisabled,
      weekStartsOn = 0,
      locale,
      rangeStart = null,
      rangeEnd = null,
      ...props
    },
    ref,
  ) {
    const shouldReduceMotion = useReducedMotion() ?? false;
    const titleId = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const pendingFocusKey = useRef<string | null>(null);
    const today = startOfDay(new Date());

    const [internalValue, setInternalValue] = useState<Date | null>(() =>
      defaultValue ? startOfDay(defaultValue) : null,
    );
    const selected =
      value === undefined ? internalValue : value ? startOfDay(value) : null;

    const [internalMonth, setInternalMonth] = useState(() =>
      startOfMonth(defaultMonth ?? value ?? defaultValue ?? new Date()),
    );
    const visibleMonth = startOfMonth(
      clampDate(month ?? internalMonth, minDate, maxDate),
    );

    const [focusedDate, setFocusedDate] = useState<Date | null>(null);
    const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
    const focusDate = disabled
      ? null
      : getFocusDate({
          focusedDate,
          selected,
          today,
          visibleMonth,
          minDate,
          maxDate,
        });

    const [renderedMonth, setRenderedMonth] = useState(visibleMonth);
    const [direction, setDirection] = useState(1);
    if (!isSameMonth(renderedMonth, visibleMonth)) {
      setDirection(
        getMonthIndex(visibleMonth) > getMonthIndex(renderedMonth) ? 1 : -1,
      );
      setRenderedMonth(visibleMonth);
    }

    const weekdays = useMemo(
      () => getWeekdays(weekStartsOn, locale),
      [weekStartsOn, locale],
    );
    const dayFormatter = useMemo(
      () => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
      [locale],
    );
    const titleFormatter = useMemo(
      () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      [locale],
    );

    useEffect(() => {
      const key = pendingFocusKey.current;
      if (key === null) {
        return;
      }

      pendingFocusKey.current = null;
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-active] [data-date="${key}"]`)
        ?.focus();
    });

    const setRootRef = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        assignRef(ref, node);
      },
      [ref],
    );

    const isDayDisabled = (date: Date) =>
      disabled ||
      (minDate !== undefined && getDayIndex(date) < getDayIndex(minDate)) ||
      (maxDate !== undefined && getDayIndex(date) > getDayIndex(maxDate)) ||
      (isDateDisabled?.(date) ?? false);

    const range = getCalendarRange({
      rangeStart,
      rangeEnd,
      hoveredDay,
      isDayDisabled,
    });

    const canGoPrevious =
      !disabled &&
      (minDate === undefined ||
        getMonthIndex(visibleMonth) > getMonthIndex(minDate));
    const canGoNext =
      !disabled &&
      (maxDate === undefined ||
        getMonthIndex(visibleMonth) < getMonthIndex(maxDate));

    const commitMonth = (next: Date) => {
      const nextMonth = startOfMonth(next);
      if (isSameMonth(nextMonth, visibleMonth)) {
        return;
      }

      if (month === undefined) {
        setInternalMonth(nextMonth);
      }
      onMonthChange?.(nextMonth);
    };

    const commitValue = (next: Date) => {
      if (isSameDay(selected, next)) {
        return;
      }

      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    };

    const moveFocusTo = (day: Date) => {
      setFocusedDate(day);
      commitMonth(day);
      pendingFocusKey.current = getDateKey(day);
    };

    const selectDay = (day: Date) => {
      if (isDayDisabled(day)) {
        return;
      }

      const next = startOfDay(day);
      commitValue(next);
      moveFocusTo(next);
    };

    const shiftMonth = (monthDelta: number) => {
      const target = clampDate(
        addMonths(focusDate ?? visibleMonth, monthDelta),
        minDate,
        maxDate,
      );
      setFocusedDate(target);
      commitMonth(target);
    };

    const handleDayKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      date: Date,
    ) => {
      const weekOffset = getWeekOffset(date, weekStartsOn);
      let target: Date;

      switch (event.key) {
        case 'ArrowLeft':
          target = addDays(date, -1);
          break;
        case 'ArrowRight':
          target = addDays(date, 1);
          break;
        case 'ArrowUp':
          target = addDays(date, -DAYS_PER_WEEK);
          break;
        case 'ArrowDown':
          target = addDays(date, DAYS_PER_WEEK);
          break;
        case 'Home':
          target = addDays(date, -weekOffset);
          break;
        case 'End':
          target = addDays(date, DAYS_PER_WEEK - 1 - weekOffset);
          break;
        case 'PageUp':
          target = addMonths(date, event.shiftKey ? -12 : -1);
          break;
        case 'PageDown':
          target = addMonths(date, event.shiftKey ? 12 : 1);
          break;
        default:
          return;
      }

      event.preventDefault();
      moveFocusTo(clampDate(target, minDate, maxDate));
    };

    const classes = [
      'notable-calendar',
      disabled ? 'notable-calendar--disabled' : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        {...props}
        ref={setRootRef}
        className={classes}
        data-disabled={disabled ? '' : undefined}
      >
        <div className="notable-calendar__header">
          <Button
            variant="ghost"
            size="icon"
            className="notable-calendar__nav"
            aria-label="Previous month"
            disabled={disabled || !canGoPrevious}
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft
              className="notable-calendar__nav-icon"
              aria-hidden="true"
            />
          </Button>
          <AutoSize
            axis="horizontal"
            className="notable-calendar__title-container"
          >
            <span
              id={titleId}
              className="notable-calendar__title"
              aria-live="polite"
            >
              {titleFormatter.format(visibleMonth)}
            </span>
          </AutoSize>
          <Button
            variant="ghost"
            size="icon"
            className="notable-calendar__nav"
            aria-label="Next month"
            disabled={disabled || !canGoNext}
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight
              className="notable-calendar__nav-icon"
              aria-hidden="true"
            />
          </Button>
        </div>

        <div
          className="notable-calendar__viewport"
          onPointerLeave={() => setHoveredDay(null)}
        >
          <AnimatedHighlight followTargetShape />
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <CalendarMonth
              key={getDateKey(startOfMonth(visibleMonth))}
              month={visibleMonth}
              weekStartsOn={weekStartsOn}
              weekdays={weekdays}
              dayFormatter={dayFormatter}
              titleId={titleId}
              focusDate={focusDate}
              selected={selected}
              today={today}
              direction={direction}
              reduceMotion={shouldReduceMotion}
              isDayDisabled={isDayDisabled}
              onSelectDay={selectDay}
              onFocusDay={setFocusedDate}
              onDayKeyDown={handleDayKeyDown}
              hoveredDay={hoveredDay}
              onHoverDay={setHoveredDay}
              range={range}
            />
          </AnimatePresence>
        </div>

        <span className="notable-calendar__sr-only" aria-live="polite">
          {selected ? dayFormatter.format(selected) : ''}
        </span>
      </div>
    );
  },
);

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}
