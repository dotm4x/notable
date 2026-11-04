import { AnimatePresence, useReducedMotion } from 'motion/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { ChevronLeft, ChevronRight } from '../../icons';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import { AutoSize } from '../../internal/primitives/auto-size/auto-size.js';
import { Button } from '../button/button.js';
import {
  addDays,
  addMonths,
  clampDate,
  getDateKey,
  getDayIndex,
  getMonthIndex,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from './helpers/date.js';
import {
  DAYS_PER_WEEK,
  getFocusDate,
  getWeekdays,
  getWeekOffset,
} from './helpers/grid.js';
import { getCalendarRange } from './helpers/range.js';
import { CalendarMonth } from './parts/month.js';
import type { CalendarProps } from './types.js';
import './calendar.css';

export type { CalendarDayOfWeek, CalendarProps } from './types.js';

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
      'one-calendar',
      disabled ? 'one-calendar--disabled' : undefined,
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
        <div className="one-calendar__header">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            disabled={disabled || !canGoPrevious}
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft
              className="one-calendar__nav-icon"
              aria-hidden="true"
            />
          </Button>
          <AutoSize axis="horizontal" className="one-calendar__title-container">
            <span
              id={titleId}
              className="one-calendar__title"
              aria-live="polite"
            >
              {titleFormatter.format(visibleMonth)}
            </span>
          </AutoSize>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next month"
            disabled={disabled || !canGoNext}
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight
              className="one-calendar__nav-icon"
              aria-hidden="true"
            />
          </Button>
        </div>

        <div
          className="one-calendar__viewport"
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

        <span className="one-calendar__sr-only" aria-live="polite">
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
