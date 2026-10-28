import { act, createRef, useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Calendar, type CalendarProps } from './calendar.js';

const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });
const monthTitle = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

function renderCalendar(props: Partial<CalendarProps> = {}) {
  return render(
    <Calendar locale="en-US" defaultMonth={new Date(2025, 2, 1)} {...props} />,
  );
}

function dayButton(date: Date, scope: HTMLElement = document.body) {
  return within(scope).getByRole('button', {
    name: fullDate.format(date),
  });
}

function gridcellOf(date: Date) {
  return dayButton(date).closest('[role="gridcell"]') as HTMLElement;
}

function previousButton() {
  return screen.getByRole('button', { name: 'Previous month' });
}

function nextButton() {
  return screen.getByRole('button', { name: 'Next month' });
}

function grid() {
  return screen.getByRole('grid');
}

describe('Calendar', () => {
  describe('month grid', () => {
    it('renders the visible month title and a 6 by 7 grid of days', () => {
      renderCalendar();

      expect(
        screen.getByRole('grid', {
          name: monthTitle.format(new Date(2025, 2)),
        }),
      ).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(7);
      expect(screen.getAllByRole('gridcell')).toHaveLength(42);
    });

    it('starts weeks on Sunday by default', () => {
      renderCalendar();

      expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Sun');
    });

    it('starts weeks on the configured weekday', () => {
      renderCalendar({ weekStartsOn: 1 });

      expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Mon');
      expect(screen.getAllByRole('columnheader')[6]).toHaveTextContent('Sun');
    });

    it('renders leap day in leap years', () => {
      renderCalendar({
        defaultMonth: new Date(2024, 1, 1),
      });

      expect(dayButton(new Date(2024, 1, 29))).toBeInTheDocument();
    });

    it('shows outside-month days with the outside marker', () => {
      renderCalendar();

      // March 1, 2025 is a Saturday, so the first row starts on February 23.
      expect(dayButton(new Date(2025, 1, 23))).toHaveAttribute('data-outside');
      expect(dayButton(new Date(2025, 2, 14))).not.toHaveAttribute(
        'data-outside',
      );
    });

    it('labels the grid with the visible month title', () => {
      renderCalendar({ defaultMonth: new Date(2025, 6, 1) });

      expect(
        screen.getByRole('grid', { name: 'July 2025' }),
      ).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('selects a day when clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({ onValueChange });

      await user.click(dayButton(new Date(2025, 2, 20)));

      expect(gridcellOf(new Date(2025, 2, 20))).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 2, 20));
    });

    it('starts with defaultValue selected', () => {
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      expect(gridcellOf(new Date(2025, 2, 14))).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('does not call onValueChange when the selected day is chosen again', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({
        defaultValue: new Date(2025, 2, 14),
        onValueChange,
      });

      await user.click(dayButton(new Date(2025, 2, 14)));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('keeps the controlled value owned by the parent', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({
        value: new Date(2025, 2, 14),
        onValueChange,
      });

      await user.click(dayButton(new Date(2025, 2, 20)));

      expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 2, 20));
      expect(gridcellOf(new Date(2025, 2, 14))).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(gridcellOf(new Date(2025, 2, 20))).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('clears a controlled selection when value is null', () => {
      renderCalendar({ value: null });

      const selected = screen
        .getAllByRole('gridcell')
        .filter((cell) => cell.getAttribute('aria-selected') === 'true');
      expect(selected).toHaveLength(0);
    });

    it('normalizes time of day to the start of the selected day', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({
        value: new Date(2025, 2, 14, 23, 30),
        onValueChange,
      });

      await user.click(dayButton(new Date(2025, 2, 15)));

      const [selected] = onValueChange.mock.calls[0] as [Date];
      expect(selected.getDate()).toBe(15);
      expect(selected.getHours()).toBe(0);
      expect(selected.getMinutes()).toBe(0);
    });

    it('announces the selected date to screen readers', async () => {
      const user = userEvent.setup();
      renderCalendar();

      await user.click(dayButton(new Date(2025, 2, 20)));

      expect(
        screen.getByText(fullDate.format(new Date(2025, 2, 20))),
      ).toBeInTheDocument();
    });

    it('selects an adjacent-month day and navigates to its month', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onMonthChange = vi.fn();
      renderCalendar({ onValueChange, onMonthChange });

      await user.click(dayButton(new Date(2025, 1, 23)));

      expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 1, 23));
      expect(onMonthChange).toHaveBeenCalledWith(new Date(2025, 1, 1));
      expect(
        screen.getByRole('grid', { name: 'February 2025' }),
      ).toBeInTheDocument();
    });
  });

  describe('visible month', () => {
    it('navigates to the next and previous month (uncontrolled)', async () => {
      const user = userEvent.setup();
      renderCalendar();

      await user.click(nextButton());
      expect(
        screen.getByRole('grid', { name: 'April 2025' }),
      ).toBeInTheDocument();

      await user.click(previousButton());
      await user.click(previousButton());
      expect(
        screen.getByRole('grid', { name: 'February 2025' }),
      ).toBeInTheDocument();
    });

    it('wraps across the year boundary', async () => {
      const user = userEvent.setup();
      renderCalendar({ defaultMonth: new Date(2025, 11, 1) });

      await user.click(nextButton());

      expect(
        screen.getByRole('grid', { name: 'January 2026' }),
      ).toBeInTheDocument();
    });

    it('calls onMonthChange with the first day of the new month', async () => {
      const user = userEvent.setup();
      const onMonthChange = vi.fn();
      renderCalendar({ onMonthChange });

      await user.click(nextButton());

      expect(onMonthChange).toHaveBeenCalledWith(new Date(2025, 3, 1));
    });

    it('keeps a controlled month when the parent does not update it', async () => {
      const user = userEvent.setup();
      const onMonthChange = vi.fn();
      renderCalendar({
        month: new Date(2025, 0, 1),
        onMonthChange,
      });

      await user.click(nextButton());

      expect(onMonthChange).toHaveBeenCalledWith(new Date(2025, 1, 1));
      expect(
        screen.getByRole('grid', { name: 'January 2025' }),
      ).toBeInTheDocument();
    });

    it('follows a controlled month updated by the parent', async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [month, setMonth] = useState(new Date(2025, 0, 1));
        return (
          <Calendar locale="en-US" month={month} onMonthChange={setMonth} />
        );
      }

      render(<Controlled />);
      await user.click(nextButton());

      expect(
        screen.getByRole('grid', { name: 'February 2025' }),
      ).toBeInTheDocument();
    });

    it('keeps the navigation focus on the navigation button', async () => {
      const user = userEvent.setup();
      renderCalendar();

      await user.click(nextButton());

      expect(nextButton()).toHaveFocus();
    });
  });

  describe('date limits', () => {
    it('disables dates before minDate and after maxDate', () => {
      renderCalendar({
        minDate: new Date(2025, 2, 10),
        maxDate: new Date(2025, 2, 20),
      });

      expect(dayButton(new Date(2025, 2, 9))).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(dayButton(new Date(2025, 2, 10))).not.toHaveAttribute(
        'aria-disabled',
      );
      expect(dayButton(new Date(2025, 2, 20))).not.toHaveAttribute(
        'aria-disabled',
      );
      expect(dayButton(new Date(2025, 2, 21))).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('does not select a day before minDate', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({ minDate: new Date(2025, 2, 10), onValueChange });

      await user.click(dayButton(new Date(2025, 2, 5)));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('disables previous navigation in the minDate month', () => {
      renderCalendar({ minDate: new Date(2025, 2, 10) });

      expect(previousButton()).toBeDisabled();
      expect(nextButton()).toBeEnabled();
    });

    it('disables next navigation in the maxDate month', () => {
      renderCalendar({ maxDate: new Date(2025, 2, 20) });

      expect(nextButton()).toBeDisabled();
      expect(previousButton()).toBeEnabled();
    });

    it('clamps keyboard movement to the allowed range', async () => {
      const user = userEvent.setup();
      renderCalendar({
        defaultValue: new Date(2025, 2, 14),
        maxDate: new Date(2025, 2, 16),
      });

      act(() => dayButton(new Date(2025, 2, 14)).focus());
      await user.keyboard('{ArrowDown}');

      expect(dayButton(new Date(2025, 2, 16))).toHaveFocus();
    });
  });

  describe('hover highlight', () => {
    it('highlights the hovered day and clears it when the pointer leaves', async () => {
      const user = userEvent.setup();
      renderCalendar();

      const day = dayButton(new Date(2025, 2, 10));
      await user.hover(day);
      expect(day).toHaveAttribute('data-highlighted');

      await user.unhover(day);
      expect(day).not.toHaveAttribute('data-highlighted');
    });

    it('does not highlight disabled days', async () => {
      const user = userEvent.setup();
      renderCalendar({ isDateDisabled: (date) => date.getDate() === 15 });

      const day = dayButton(new Date(2025, 2, 15));
      await user.hover(day);
      expect(day).not.toHaveAttribute('data-highlighted');
    });
  });

  describe('disabled dates', () => {
    it('disables individual dates with isDateDisabled', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({
        isDateDisabled: (date) => date.getDate() === 15,
        onValueChange,
      });

      expect(dayButton(new Date(2025, 2, 15))).toHaveAttribute(
        'aria-disabled',
        'true',
      );

      await user.click(dayButton(new Date(2025, 2, 15)));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('moves focus onto a disabled date but does not select it with Enter', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({
        defaultValue: new Date(2025, 2, 14),
        isDateDisabled: (date) => date.getDate() === 15,
        onValueChange,
      });

      act(() => dayButton(new Date(2025, 2, 14)).focus());
      await user.keyboard('{ArrowRight}');
      expect(dayButton(new Date(2025, 2, 15))).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled calendar', () => {
    it('disables every day and both navigation buttons', () => {
      renderCalendar({ disabled: true });

      expect(dayButton(new Date(2025, 2, 14))).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(previousButton()).toBeDisabled();
      expect(nextButton()).toBeDisabled();
    });

    it('does not select or navigate on click', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onMonthChange = vi.fn();
      renderCalendar({ disabled: true, onValueChange, onMonthChange });

      await user.click(dayButton(new Date(2025, 2, 14)));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(onMonthChange).not.toHaveBeenCalled();
    });

    it('marks the root as disabled', () => {
      const { container } = renderCalendar({ disabled: true });

      expect(container.firstChild).toHaveAttribute('data-disabled');
      expect(container.firstChild).toHaveClass('notable-calendar--disabled');
    });

    it('removes every day from the tab order', () => {
      renderCalendar({ disabled: true });

      const tabStops = Array.from(
        document.querySelectorAll<HTMLButtonElement>('[data-date]'),
      ).filter((button) => button.tabIndex === 0);
      expect(tabStops).toHaveLength(0);
    });

    it('disables month navigation', () => {
      renderCalendar({ disabled: true });

      expect(
        screen.getByRole('button', { name: 'Previous month' }),
      ).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    });
  });

  describe('keyboard', () => {
    it('gives exactly one day a tab stop, the selected day', () => {
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      expect(dayButton(new Date(2025, 2, 14))).toHaveAttribute('tabindex', '0');
      expect(dayButton(new Date(2025, 2, 13))).toHaveAttribute(
        'tabindex',
        '-1',
      );
    });

    it('moves focus with the arrow keys', async () => {
      const user = userEvent.setup();
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      act(() => dayButton(new Date(2025, 2, 14)).focus());

      await user.keyboard('{ArrowRight}');
      expect(dayButton(new Date(2025, 2, 15))).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(dayButton(new Date(2025, 2, 14))).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(dayButton(new Date(2025, 2, 13))).toHaveFocus();
    });

    it('moves focus by week with Up and Down', async () => {
      const user = userEvent.setup();
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      act(() => dayButton(new Date(2025, 2, 14)).focus());

      await user.keyboard('{ArrowDown}');
      expect(dayButton(new Date(2025, 2, 21))).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      await user.keyboard('{ArrowUp}');
      expect(dayButton(new Date(2025, 2, 7))).toHaveFocus();
    });

    it('moves focus to the start and end of the week with Home and End', async () => {
      const user = userEvent.setup();
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      act(() => dayButton(new Date(2025, 2, 14)).focus());

      await user.keyboard('{Home}');
      expect(dayButton(new Date(2025, 2, 9))).toHaveFocus();

      await user.keyboard('{End}');
      expect(dayButton(new Date(2025, 2, 15))).toHaveFocus();
    });

    it('respects the week start for Home and End', async () => {
      const user = userEvent.setup();
      renderCalendar({
        defaultValue: new Date(2025, 2, 14),
        weekStartsOn: 1,
      });

      act(() => dayButton(new Date(2025, 2, 14)).focus());

      await user.keyboard('{Home}');
      expect(dayButton(new Date(2025, 2, 10))).toHaveFocus();

      await user.keyboard('{End}');
      expect(dayButton(new Date(2025, 2, 16))).toHaveFocus();
    });

    it('moves focus one month with PageUp and PageDown', async () => {
      const user = userEvent.setup();
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      act(() => dayButton(new Date(2025, 2, 14)).focus());

      await user.keyboard('{PageDown}');
      await waitFor(() =>
        expect(dayButton(new Date(2025, 3, 14))).toHaveFocus(),
      );
      expect(
        screen.getByRole('grid', { name: 'April 2025' }),
      ).toBeInTheDocument();

      await user.keyboard('{PageUp}');
      await waitFor(() =>
        expect(dayButton(new Date(2025, 2, 14))).toHaveFocus(),
      );
    });

    it('moves focus one year with Shift and PageUp or PageDown', async () => {
      const user = userEvent.setup();
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      act(() => dayButton(new Date(2025, 2, 14)).focus());

      await user.keyboard('{Shift>}{PageDown}{/Shift}');
      await waitFor(() =>
        expect(dayButton(new Date(2026, 2, 14))).toHaveFocus(),
      );

      await user.keyboard('{Shift>}{PageUp}{/Shift}');
      await user.keyboard('{Shift>}{PageUp}{/Shift}');
      await waitFor(() =>
        expect(dayButton(new Date(2024, 2, 14))).toHaveFocus(),
      );
    });

    it('clamps the month end when moving by month', async () => {
      const user = userEvent.setup();
      renderCalendar({
        defaultMonth: new Date(2025, 0, 1),
        defaultValue: new Date(2025, 0, 31),
      });

      act(() => dayButton(new Date(2025, 0, 31)).focus());
      await user.keyboard('{PageDown}');

      await waitFor(() =>
        expect(dayButton(new Date(2025, 1, 28))).toHaveFocus(),
      );
    });

    it('selects the focused day with Enter and Space', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCalendar({
        defaultValue: new Date(2025, 2, 14),
        onValueChange,
      });

      act(() => dayButton(new Date(2025, 2, 14)).focus());
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Enter}');

      expect(onValueChange).toHaveBeenLastCalledWith(new Date(2025, 2, 15));

      await user.keyboard('{ArrowRight}');
      await user.keyboard(' ');

      expect(onValueChange).toHaveBeenLastCalledWith(new Date(2025, 2, 16));
    });

    it('keeps focus on the day after the visible month changes', async () => {
      const user = userEvent.setup();
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      act(() => dayButton(new Date(2025, 2, 14)).focus());
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
      await user.keyboard('{ArrowDown}{ArrowDown}');

      await waitFor(() =>
        expect(dayButton(new Date(2025, 3, 18))).toHaveFocus(),
      );
    });
  });

  describe('today', () => {
    it('marks today with aria-current', () => {
      const today = new Date();
      renderCalendar({
        defaultMonth: new Date(today.getFullYear(), today.getMonth(), 1),
      });

      expect(dayButton(today)).toHaveAttribute('aria-current', 'date');
      expect(dayButton(today)).toHaveAttribute('data-today');
    });

    it('keeps the selected day distinct from today', () => {
      const today = new Date();
      const other = new Date(today.getFullYear(), today.getMonth(), 1);
      if (other.getDate() === today.getDate()) {
        other.setDate(2);
      }

      renderCalendar({
        defaultMonth: new Date(today.getFullYear(), today.getMonth(), 1),
        defaultValue: other,
      });

      expect(dayButton(other)).toHaveAttribute('data-selected');
      expect(dayButton(today)).not.toHaveAttribute('data-selected');
    });
  });

  describe('accessibility', () => {
    it('labels the grid with its title and gives every day an accessible name', () => {
      renderCalendar();

      expect(grid()).toHaveAccessibleName('March 2025');
      expect(dayButton(new Date(2025, 2, 14))).toHaveAccessibleName(
        fullDate.format(new Date(2025, 2, 14)),
      );
    });

    it('exposes the selected state on gridcells', () => {
      renderCalendar({ defaultValue: new Date(2025, 2, 14) });

      expect(gridcellOf(new Date(2025, 2, 14))).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(gridcellOf(new Date(2025, 2, 13))).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('labels the navigation buttons', () => {
      renderCalendar();

      expect(previousButton()).toBeInTheDocument();
      expect(nextButton()).toBeInTheDocument();
    });

    it('uses button type="button" for every day', () => {
      renderCalendar();

      for (const button of screen.getAllByRole('button', {
        name: /2025/,
      })) {
        expect(button).toHaveAttribute('type', 'button');
      }
    });
  });

  describe('multiple instances', () => {
    it('keeps selection and focus independent between calendars', async () => {
      const user = userEvent.setup();
      const onFirst = vi.fn();
      const onSecond = vi.fn();

      render(
        <>
          <div data-testid="first">
            <Calendar
              locale="en-US"
              defaultMonth={new Date(2025, 2, 1)}
              onValueChange={onFirst}
            />
          </div>
          <div data-testid="second">
            <Calendar
              locale="en-US"
              defaultMonth={new Date(2025, 2, 1)}
              onValueChange={onSecond}
            />
          </div>
        </>,
      );

      const first = screen.getByTestId('first');
      const second = screen.getByTestId('second');

      await user.click(dayButton(new Date(2025, 2, 14), first));

      expect(onFirst).toHaveBeenCalledWith(new Date(2025, 2, 14));
      expect(onSecond).not.toHaveBeenCalled();
      expect(
        dayButton(new Date(2025, 2, 14), first).closest('[role="gridcell"]'),
      ).toHaveAttribute('aria-selected', 'true');
      expect(
        within(second)
          .getAllByRole('gridcell')
          .some((cell) => cell.getAttribute('aria-selected') === 'true'),
      ).toBe(false);
    });

    it('gives each calendar its own title association', () => {
      render(
        <>
          <Calendar locale="en-US" defaultMonth={new Date(2025, 2, 1)} />
          <Calendar locale="en-US" defaultMonth={new Date(2025, 6, 1)} />
        </>,
      );

      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(2);
      expect(grids[0]).toHaveAccessibleName('March 2025');
      expect(grids[1]).toHaveAccessibleName('July 2025');
    });
  });

  describe('props and refs', () => {
    it('merges className and forwards native attributes to the root', () => {
      const { container } = renderCalendar({
        className: 'custom-calendar',
        'data-testid': 'calendar-root',
      } as Partial<CalendarProps>);

      expect(container.firstChild).toHaveClass(
        'notable-calendar',
        'custom-calendar',
      );
      expect(screen.getByTestId('calendar-root')).toBe(container.firstChild);
    });

    it('forwards the ref to the root element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Calendar ref={ref} locale="en-US" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('notable-calendar');
    });

    it('uses the locale for weekday and month labels', () => {
      render(<Calendar locale="es-ES" defaultMonth={new Date(2025, 2, 1)} />);

      expect(
        screen.getByRole('grid', { name: 'marzo de 2025' }),
      ).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('dom');
    });
  });

  describe('range', () => {
    it('marks start, end, and in-between days', () => {
      renderCalendar({
        rangeStart: new Date(2025, 2, 10),
        rangeEnd: new Date(2025, 2, 13),
      });

      expect(gridcellOf(new Date(2025, 2, 10))).toHaveAttribute(
        'data-range-start',
      );
      expect(gridcellOf(new Date(2025, 2, 13))).toHaveAttribute(
        'data-range-end',
      );

      const middle = gridcellOf(new Date(2025, 2, 11));
      expect(middle).toHaveAttribute('data-in-range');
      expect(middle).not.toHaveAttribute('data-range-start');
      expect(middle).not.toHaveAttribute('data-range-end');

      expect(gridcellOf(new Date(2025, 2, 9))).not.toHaveAttribute(
        'data-in-range',
      );
      expect(gridcellOf(new Date(2025, 2, 14))).not.toHaveAttribute(
        'data-in-range',
      );
    });

    it('selects endpoints and in-between days for assistive technology', () => {
      renderCalendar({
        rangeStart: new Date(2025, 2, 10),
        rangeEnd: new Date(2025, 2, 13),
      });

      expect(gridcellOf(new Date(2025, 2, 10))).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(gridcellOf(new Date(2025, 2, 11))).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(gridcellOf(new Date(2025, 2, 9))).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('marks only the start day when the range has no end yet', () => {
      renderCalendar({ rangeStart: new Date(2025, 2, 10), rangeEnd: null });

      expect(gridcellOf(new Date(2025, 2, 10))).toHaveAttribute(
        'data-range-start',
      );
      expect(gridcellOf(new Date(2025, 2, 11))).not.toHaveAttribute(
        'data-in-range',
      );
      expect(dayButton(new Date(2025, 2, 10))).toHaveAttribute('data-selected');
    });

    it('does not draw a band for a single-day range', () => {
      renderCalendar({
        rangeStart: new Date(2025, 2, 10),
        rangeEnd: new Date(2025, 2, 10),
      });

      const cell = gridcellOf(new Date(2025, 2, 10));
      expect(cell).toHaveAttribute('data-in-range');
      expect(cell).toHaveAttribute('data-range-start');
      expect(cell).toHaveAttribute('data-range-end');
    });

    it('previews the range while hovering a later day', async () => {
      const user = userEvent.setup();
      renderCalendar({ rangeStart: new Date(2025, 2, 10), rangeEnd: null });

      await user.hover(dayButton(new Date(2025, 2, 12)));

      expect(gridcellOf(new Date(2025, 2, 11))).toHaveAttribute('data-preview');
      expect(gridcellOf(new Date(2025, 2, 12))).toHaveAttribute(
        'data-range-end',
      );
      expect(gridcellOf(new Date(2025, 2, 12))).toHaveAttribute('data-preview');
      expect(dayButton(new Date(2025, 2, 12))).toHaveAttribute('data-preview');
      expect(gridcellOf(new Date(2025, 2, 12))).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(gridcellOf(new Date(2025, 2, 10))).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('does not preview a range that passes a disabled day', async () => {
      const user = userEvent.setup();
      renderCalendar({
        rangeStart: new Date(2025, 2, 10),
        rangeEnd: null,
        isDateDisabled: (date) => date.getDate() === 11,
      });

      await user.hover(dayButton(new Date(2025, 2, 12)));

      expect(gridcellOf(new Date(2025, 2, 11))).not.toHaveAttribute(
        'data-in-range',
      );
      expect(gridcellOf(new Date(2025, 2, 12))).not.toHaveAttribute(
        'data-in-range',
      );
    });

    it('does not preview days before the range start', async () => {
      const user = userEvent.setup();
      renderCalendar({ rangeStart: new Date(2025, 2, 10), rangeEnd: null });

      await user.hover(dayButton(new Date(2025, 2, 8)));

      expect(gridcellOf(new Date(2025, 2, 9))).not.toHaveAttribute(
        'data-in-range',
      );
      expect(gridcellOf(new Date(2025, 2, 8))).not.toHaveAttribute(
        'data-in-range',
      );
    });

    it('renders no range state when range props are omitted', () => {
      renderCalendar();

      expect(document.querySelector('[data-in-range]')).toBeNull();
      expect(document.querySelector('[data-range-start]')).toBeNull();
    });
  });
});
