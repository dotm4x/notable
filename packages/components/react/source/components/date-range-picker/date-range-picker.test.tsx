import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DateRangePicker,
  type DateRange,
  type DateRangePickerProps,
} from './date-range-picker.js';

const mediumEn = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const fullEn = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });

function renderPicker(props: Partial<DateRangePickerProps> = {}) {
  return render(
    <DateRangePicker locale="en-US" aria-label="Travel dates" {...props} />,
  );
}

function trigger() {
  return screen.getByRole('button', { name: /^Travel dates/ });
}

function dayButton(date: Date) {
  return within(popup()).getByRole('button', { name: fullEn.format(date) });
}

function popup() {
  return screen.getByRole('dialog', { name: 'Choose date range' });
}

function clearButton() {
  return screen.queryByRole('button', { name: 'Clear date range' });
}

describe('DateRangePicker', () => {
  // Pins "today" so the calendar opens on March 2025, where the test dates fall.
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2025, 2, 1, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('display', () => {
    it('shows the placeholder when no range is selected', () => {
      renderPicker();

      expect(trigger()).toHaveTextContent('Select a date range');
    });

    it('shows a custom placeholder', () => {
      renderPicker({ placeholder: 'Pick a stay' });

      expect(trigger()).toHaveTextContent('Pick a stay');
    });

    it('shows both dates of a complete range', () => {
      const start = new Date(2025, 2, 10);
      const end = new Date(2025, 2, 14);
      renderPicker({ defaultValue: { start, end } });

      expect(trigger()).toHaveTextContent(
        `${mediumEn.format(start)} – ${mediumEn.format(end)}`,
      );
    });

    it('shows only the start of a partial range', () => {
      const start = new Date(2025, 2, 10);
      renderPicker({ defaultValue: { start, end: null } });

      expect(trigger()).toHaveTextContent(mediumEn.format(start));
      expect(trigger()).not.toHaveTextContent('–');
    });

    it('formats dates with the formatDate prop', () => {
      renderPicker({
        defaultValue: {
          start: new Date(2025, 2, 10),
          end: new Date(2025, 2, 14),
        },
        formatDate: (date) => `${date.getDate()}/${date.getMonth() + 1}`,
      });

      expect(trigger()).toHaveTextContent('10/3 – 14/3');
    });

    it('includes the visible value in the accessible name', () => {
      renderPicker({
        defaultValue: { start: new Date(2025, 2, 10), end: null },
      });

      expect(trigger()).toHaveAccessibleName(
        `Travel dates ${mediumEn.format(new Date(2025, 2, 10))}`,
      );
    });
  });

  describe('selection', () => {
    it('keeps the popup open after the first click and shows the pending start', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ onValueChange });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));

      expect(popup()).toBeInTheDocument();
      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 10)),
      );
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('completes the range on the second click and closes', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ onValueChange });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));
      await user.click(dayButton(new Date(2025, 2, 14)));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith({
        start: new Date(2025, 2, 10),
        end: new Date(2025, 2, 14),
      });
      expect(trigger()).toHaveTextContent(
        `${mediumEn.format(new Date(2025, 2, 10))} – ${mediumEn.format(new Date(2025, 2, 14))}`,
      );
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('allows a single-day range', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ onValueChange });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 12)));
      await user.click(dayButton(new Date(2025, 2, 12)));

      expect(onValueChange).toHaveBeenCalledWith({
        start: new Date(2025, 2, 12),
        end: new Date(2025, 2, 12),
      });
    });

    it('restarts from the clicked day when the end is before the start', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ onValueChange });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 14)));
      await user.click(dayButton(new Date(2025, 2, 10)));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(popup()).toBeInTheDocument();
      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 10)),
      );
      expect(trigger()).not.toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 14)),
      );
    });

    it('restarts from the clicked day when the span crosses a disabled date', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const blocked = new Date(2025, 2, 12);
      renderPicker({
        onValueChange,
        isDateDisabled: (date) => date.getTime() === blocked.getTime(),
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));
      await user.click(dayButton(new Date(2025, 2, 15)));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 15)),
      );

      await user.click(dayButton(new Date(2025, 2, 16)));

      expect(onValueChange).toHaveBeenCalledWith({
        start: new Date(2025, 2, 15),
        end: new Date(2025, 2, 16),
      });
    });

    it('cancels a pending start when the popup closes', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ onValueChange });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));
      await user.keyboard('{Escape}');

      expect(onValueChange).not.toHaveBeenCalled();
      expect(trigger()).toHaveTextContent('Select a date range');
    });

    it('continues from a committed start-only value', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: { start: new Date(2025, 2, 10), end: null },
        onValueChange,
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 13)));

      expect(onValueChange).toHaveBeenCalledWith({
        start: new Date(2025, 2, 10),
        end: new Date(2025, 2, 13),
      });
    });

    it('does not select days outside minDate and maxDate', async () => {
      const user = userEvent.setup();
      renderPicker({
        minDate: new Date(2025, 2, 5),
        maxDate: new Date(2025, 2, 20),
      });

      await user.click(trigger());

      expect(dayButton(new Date(2025, 2, 4))).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(dayButton(new Date(2025, 2, 21))).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(dayButton(new Date(2025, 2, 5))).not.toHaveAttribute(
        'aria-disabled',
      );
    });

    it('reopens with the committed range and can start a new selection', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: {
          start: new Date(2025, 2, 10),
          end: new Date(2025, 2, 14),
        },
        onValueChange,
      });

      await user.click(trigger());
      expect(dayButton(new Date(2025, 2, 10))).toHaveAttribute('data-selected');
      expect(dayButton(new Date(2025, 2, 14))).toHaveAttribute('data-selected');

      await user.click(dayButton(new Date(2025, 2, 20)));
      await user.click(dayButton(new Date(2025, 2, 22)));

      expect(onValueChange).toHaveBeenCalledWith({
        start: new Date(2025, 2, 20),
        end: new Date(2025, 2, 22),
      });
    });
  });

  describe('controlled and uncontrolled', () => {
    it('updates an uncontrolled range without a parent', async () => {
      const user = userEvent.setup();
      renderPicker();

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));
      await user.click(dayButton(new Date(2025, 2, 14)));

      expect(trigger()).toHaveTextContent(
        `${mediumEn.format(new Date(2025, 2, 10))} – ${mediumEn.format(new Date(2025, 2, 14))}`,
      );
    });

    it('keeps a controlled value until the parent updates it', async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [range, setRange] = useState<DateRange>({
          start: null,
          end: null,
        });
        return (
          <>
            <DateRangePicker
              locale="en-US"
              aria-label="Travel dates"
              value={range}
              onValueChange={(next) => {
                setRange(next);
              }}
            />
            <output>{range.end ? 'complete' : 'open'}</output>
          </>
        );
      }

      render(<Controlled />);

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));
      await user.click(dayButton(new Date(2025, 2, 14)));

      expect(trigger()).toHaveTextContent(
        `${mediumEn.format(new Date(2025, 2, 10))} – ${mediumEn.format(new Date(2025, 2, 14))}`,
      );
      expect(screen.getByRole('status')).toHaveTextContent('complete');
    });

    it('does not change the displayed range when a controlled parent ignores the change', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        value: { start: null, end: null },
        onValueChange,
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));
      await user.click(dayButton(new Date(2025, 2, 14)));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(trigger()).toHaveTextContent('Select a date range');
    });

    it('reports open changes through onOpenChange', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderPicker({ onOpenChange });

      await user.click(trigger());

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('stays closed when the controlled open prop is false', async () => {
      const user = userEvent.setup();
      renderPicker({ open: false });

      await user.click(trigger());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('clear', () => {
    it('is hidden when clearable and nothing is selected', () => {
      renderPicker({ clearable: true });

      expect(clearButton()).not.toBeInTheDocument();
    });

    it('is hidden when not clearable', () => {
      renderPicker({
        defaultValue: { start: new Date(2025, 2, 10), end: null },
      });

      expect(clearButton()).not.toBeInTheDocument();
    });

    it('clears the range and reports an empty range', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        clearable: true,
        defaultValue: {
          start: new Date(2025, 2, 10),
          end: new Date(2025, 2, 14),
        },
        onValueChange,
      });

      await user.click(clearButton() as HTMLElement);

      expect(onValueChange).toHaveBeenCalledWith({ start: null, end: null });
      expect(trigger()).toHaveTextContent('Select a date range');
      expect(clearButton()).not.toBeInTheDocument();
    });

    it('clears a pending start', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ clearable: true, onValueChange });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));
      await user.keyboard('{Escape}');

      expect(clearButton()).toBeNull();
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled and readOnly', () => {
    it('disables the trigger and prevents opening', async () => {
      const user = userEvent.setup();
      renderPicker({ disabled: true });

      expect(trigger()).toBeDisabled();

      await user.click(trigger());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows the range but prevents opening when readOnly', async () => {
      const user = userEvent.setup();
      renderPicker({
        readOnly: true,
        clearable: true,
        defaultValue: {
          start: new Date(2025, 2, 10),
          end: new Date(2025, 2, 14),
        },
      });

      expect(trigger()).toHaveAttribute('data-readonly');
      expect(trigger()).toHaveTextContent(
        `${mediumEn.format(new Date(2025, 2, 10))} – ${mediumEn.format(new Date(2025, 2, 14))}`,
      );
      expect(clearButton()).not.toBeInTheDocument();

      await user.click(trigger());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('props and refs', () => {
    it('applies className to the trigger', () => {
      renderPicker({ className: 'custom-range' });

      expect(trigger()).toHaveClass('custom-range');
    });

    it('forwards the ref to the trigger button', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(
        <DateRangePicker ref={ref} locale="en-US" aria-label="Travel dates" />,
      );

      expect(ref.current).toBe(trigger());
    });
  });
});
