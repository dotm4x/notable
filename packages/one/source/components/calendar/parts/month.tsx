import { motion, useIsPresent } from 'motion/react';
import type { KeyboardEvent } from 'react';
import { DURATION_BASE, EASING_STANDARD } from '../../../styles/motion.js';
import { getDateKey, isSameDay, isSameMonth } from '../helpers/date.js';
import { getWeeks, type TCalendarWeekday } from '../helpers/grid.js';
import { getDayRangeState, type TCalendarRange } from '../helpers/range.js';
import type { CalendarDayOfWeek } from '../types.js';

const MONTH_SLIDE_OFFSET = 24;

type TCalendarMonthProps = {
  month: Date;
  weekStartsOn: CalendarDayOfWeek;
  weekdays: TCalendarWeekday[];
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
  range: TCalendarRange | null;
};

/**
 * One month grid. While it is leaving during a month transition, it is hidden
 * from assistive technology and removed from the tab order so only the
 * entering month is interactive.
 */
export function CalendarMonth({
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
}: TCalendarMonthProps) {
  const isPresent = useIsPresent();
  const weeks = getWeeks(month, weekStartsOn);
  const slideOffset = reduceMotion ? 0 : MONTH_SLIDE_OFFSET;

  return (
    <motion.div
      className="one-calendar__month"
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
        className="one-calendar__grid"
        role="grid"
        aria-labelledby={titleId}
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                key={weekday.key}
                scope="col"
                className="one-calendar__weekday"
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
                    className="one-calendar__cell"
                    data-in-range={dayRange.isInRange ? '' : undefined}
                    data-range-start={dayRange.isStart ? '' : undefined}
                    data-range-end={dayRange.isEnd ? '' : undefined}
                    data-preview={
                      dayRange.isInRange && dayRange.isPreview ? '' : undefined
                    }
                  >
                    <button
                      type="button"
                      className="one-calendar__day"
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
