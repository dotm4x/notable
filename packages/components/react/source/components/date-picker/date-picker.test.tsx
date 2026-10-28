import { createRef, useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker, type DatePickerProps } from './date-picker.js';

const mediumEn = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const fullEn = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });

function renderPicker(props: Partial<DatePickerProps> = {}) {
  return render(
    <DatePicker locale="en-US" aria-label="Start date" {...props} />,
  );
}

function trigger() {
  return screen.getByRole('button', { name: /^Start date/ });
}

function dayButton(date: Date) {
  return screen.getByRole('button', { name: fullEn.format(date) });
}

function popup() {
  return screen.getByRole('dialog', { name: 'Choose date' });
}

describe('DatePicker', () => {
  describe('display', () => {
    it('shows the placeholder when no date is selected', () => {
      renderPicker();

      expect(trigger()).toHaveTextContent('Select a date');
    });

    it('shows a custom placeholder', () => {
      renderPicker({ placeholder: 'Pick a day' });

      expect(trigger()).toHaveTextContent('Pick a day');
    });

    it('shows the selected date formatted for the locale', () => {
      renderPicker({ defaultValue: new Date(2025, 2, 14) });

      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 14)),
      );
    });

    it('treats null as an empty selection', () => {
      renderPicker({ value: null, placeholder: 'Empty' });

      expect(trigger()).toHaveTextContent('Empty');
    });

    it('formats with the locale prop', () => {
      const date = new Date(2025, 2, 14);
      renderPicker({ defaultValue: date, locale: 'de-DE' });

      expect(trigger()).toHaveTextContent(
        new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(date),
      );
    });

    it('uses formatDate when provided', () => {
      renderPicker({
        defaultValue: new Date(2025, 2, 14),
        formatDate: (date) => `Day ${date.getDate()}`,
      });

      expect(trigger()).toHaveTextContent('Day 14');
    });

    it('keeps the selected calendar day for dates at local midnight', () => {
      renderPicker({ defaultValue: new Date(2025, 0, 1, 0, 0, 0) });

      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 0, 1)),
      );
    });
  });

  describe('popup', () => {
    it('keeps the calendar closed until the trigger is activated', () => {
      renderPicker();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens the calendar when the trigger is clicked', async () => {
      const user = userEvent.setup();
      renderPicker();

      await user.click(trigger());

      expect(popup()).toBeInTheDocument();
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    });

    it('opens with Enter from the trigger', async () => {
      const user = userEvent.setup();
      renderPicker();

      trigger().focus();
      await user.keyboard('{Enter}');

      expect(popup()).toBeInTheDocument();
    });

    it('closes when Escape is pressed', async () => {
      const user = userEvent.setup();
      renderPicker();

      await user.click(trigger());
      await user.keyboard('{Escape}');

      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
    });

    it('closes when a press lands outside the popup', async () => {
      const user = userEvent.setup();
      render(
        <>
          <p>Outside</p>
          <DatePicker locale="en-US" aria-label="Start date" />
        </>,
      );

      await user.click(screen.getByRole('button', { name: /^Start date/ }));
      await user.click(screen.getByText('Outside'));

      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
    });

    it('closes after a date is selected', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultValue: new Date(2025, 2, 1) });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));

      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
    });

    it('returns focus to the trigger after a date is selected', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultValue: new Date(2025, 2, 1) });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));

      await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('returns focus to the trigger after Escape', async () => {
      const user = userEvent.setup();
      renderPicker();

      await user.click(trigger());
      await user.keyboard('{Escape}');

      await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('renders the popup in a portal outside the picker', async () => {
      const user = userEvent.setup();
      const { container } = renderPicker();

      await user.click(trigger());

      expect(container).not.toContainElement(popup());
    });
  });

  describe('selection', () => {
    it('updates the display and reports the selected date', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: new Date(2025, 2, 1),
        onValueChange,
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      const reported = onValueChange.mock.calls[0]?.[0] as Date;
      expect(reported.getFullYear()).toBe(2025);
      expect(reported.getMonth()).toBe(2);
      expect(reported.getDate()).toBe(10);
      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 10)),
      );
    });

    it('selects with the keyboard through Calendar', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: new Date(2025, 2, 1),
        onValueChange,
      });

      trigger().focus();
      await user.keyboard('{Enter}');
      const dayOne = dayButton(new Date(2025, 2, 1));
      dayOne.focus();
      await user.keyboard('{ArrowRight}{Enter}');

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect((onValueChange.mock.calls[0]?.[0] as Date).getDate()).toBe(2);
    });

    it('does not report a selection when the selected date is chosen again', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: new Date(2025, 2, 10),
        onValueChange,
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('selects the same local calendar day that Calendar shows', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: new Date(2025, 0, 15),
        onValueChange,
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 0, 1)));

      const reported = onValueChange.mock.calls[0]?.[0] as Date;
      expect(reported.getDate()).toBe(1);
      expect(reported.getMonth()).toBe(0);
      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 0, 1)),
      );
    });
  });

  describe('controlled and uncontrolled', () => {
    it('keeps the uncontrolled selection in the picker', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultValue: new Date(2025, 4, 10) });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 4, 1)));

      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 4, 1)),
      );
    });

    it('does not change a controlled value without the parent updating it', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        value: new Date(2025, 2, 1),
        onValueChange,
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 10)));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 1)),
      );
    });

    it('updates the display when the parent owns the value', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState<Date | null>(new Date(2025, 2, 1));
        return (
          <DatePicker
            locale="en-US"
            aria-label="Start date"
            value={value}
            onValueChange={setValue}
          />
        );
      }
      render(<Controlled />);

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 20)));

      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 20)),
      );
    });

    it('reflects external value changes in the display and calendar', async () => {
      const user = userEvent.setup();
      const { rerender } = renderPicker({ value: new Date(2025, 2, 1) });

      rerender(
        <DatePicker
          locale="en-US"
          aria-label="Start date"
          value={new Date(2025, 6, 4)}
        />,
      );

      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 6, 4)),
      );

      await user.click(trigger());
      expect(
        within(popup()).getByRole('grid', { name: /July 2025/ }),
      ).toBeInTheDocument();
    });

    it('shows the placeholder when the controlled value is cleared', () => {
      const { rerender } = renderPicker({
        value: new Date(2025, 2, 1),
        placeholder: 'Choose',
      });

      rerender(
        <DatePicker
          locale="en-US"
          aria-label="Start date"
          value={null}
          placeholder="Choose"
        />,
      );

      expect(trigger()).toHaveTextContent('Choose');
    });

    it('follows the open prop in controlled mode', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { rerender } = renderPicker({
        open: false,
        onOpenChange,
      });

      await user.click(trigger());
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <DatePicker
          locale="en-US"
          aria-label="Start date"
          open
          onOpenChange={onOpenChange}
        />,
      );
      expect(popup()).toBeInTheDocument();
    });

    it('opens initially when defaultOpen is true', () => {
      renderPicker({ defaultOpen: true });

      expect(popup()).toBeInTheDocument();
    });
  });

  describe('disabled and read-only', () => {
    it('disables the trigger and does not open', async () => {
      const user = userEvent.setup();
      renderPicker({ disabled: true });

      expect(trigger()).toBeDisabled();
      await user.click(trigger());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows the value but does not open when read-only', async () => {
      const user = userEvent.setup();
      renderPicker({ readOnly: true, defaultValue: new Date(2025, 2, 14) });

      expect(trigger()).toHaveTextContent(
        mediumEn.format(new Date(2025, 2, 14)),
      );
      expect(trigger()).toHaveAttribute('data-readonly');

      await user.click(trigger());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not open when read-only and defaultOpen is true', () => {
      renderPicker({ readOnly: true, defaultOpen: true });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('date constraints', () => {
    it('disables days before minDate and after maxDate in the calendar', async () => {
      const user = userEvent.setup();
      renderPicker({
        defaultValue: new Date(2025, 2, 15),
        minDate: new Date(2025, 2, 10),
        maxDate: new Date(2025, 2, 20),
      });

      await user.click(trigger());

      expect(dayButton(new Date(2025, 2, 9))).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(dayButton(new Date(2025, 2, 21))).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(dayButton(new Date(2025, 2, 10))).not.toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('does not select a date outside minDate and maxDate', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: new Date(2025, 2, 15),
        minDate: new Date(2025, 2, 10),
        onValueChange,
      });

      await user.click(trigger());
      await user.click(dayButton(new Date(2025, 2, 5)));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(popup()).toBeInTheDocument();
    });

    it('disables individual dates from isDateDisabled and does not select them', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const blocked = new Date(2025, 2, 12);
      renderPicker({
        defaultValue: new Date(2025, 2, 15),
        isDateDisabled: (date) => date.getTime() === blocked.getTime(),
        onValueChange,
      });

      await user.click(trigger());
      expect(dayButton(blocked)).toHaveAttribute('aria-disabled', 'true');
      await user.click(dayButton(blocked));

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('uses the provided accessible name for the trigger', () => {
      renderPicker({ 'aria-label': 'Check-in' });

      expect(
        screen.getByRole('button', { name: /^Check-in/ }),
      ).toBeInTheDocument();
    });

    it('includes the visible value in the accessible name', () => {
      renderPicker({
        'aria-label': 'Check-in',
        defaultValue: new Date(2025, 2, 14),
      });

      expect(
        screen.getByRole('button', {
          name: `Check-in ${mediumEn.format(new Date(2025, 2, 14))}`,
        }),
      ).toBeInTheDocument();
    });

    it('takes its name from a labelling element when aria-labelledby is set', () => {
      render(
        <>
          <span id="checkout-label">Check-out</span>
          <DatePicker locale="en-US" aria-labelledby="checkout-label" />
        </>,
      );

      expect(
        screen.getByRole('button', { name: /^Check-out/ }),
      ).toBeInTheDocument();
    });

    it('exposes the open state and popup relationship', async () => {
      const user = userEvent.setup();
      renderPicker();

      await user.click(trigger());

      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('forwards the description through aria-describedby', () => {
      render(
        <>
          <p id="hint">Pick a date in March</p>
          <DatePicker
            locale="en-US"
            aria-label="Start date"
            aria-describedby="hint"
          />
        </>,
      );

      expect(trigger()).toHaveAccessibleDescription('Pick a date in March');
    });

    it('does not render a clickable div or span as the trigger', () => {
      renderPicker();

      expect(trigger().tagName).toBe('BUTTON');
      expect(trigger()).toHaveAttribute('type', 'button');
    });

    it('forwards ref to the trigger button', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<DatePicker ref={ref} locale="en-US" aria-label="Start date" />);

      expect(ref.current).toBe(trigger());
    });
  });

  describe('composition', () => {
    it('merges className onto the trigger', () => {
      renderPicker({ className: 'custom-picker' });

      expect(trigger()).toHaveClass(
        'notable-date-picker__trigger',
        'custom-picker',
      );
    });

    it('keeps multiple instances independent', async () => {
      const user = userEvent.setup();
      render(
        <>
          <DatePicker
            locale="en-US"
            aria-label="Start date"
            defaultValue={new Date(2025, 2, 1)}
          />
          <DatePicker
            locale="en-US"
            aria-label="End date"
            defaultValue={new Date(2025, 2, 5)}
          />
        </>,
      );

      await user.click(screen.getByRole('button', { name: /^Start date/ }));
      await user.click(dayButton(new Date(2025, 2, 10)));

      expect(
        screen.getByRole('button', { name: /^Start date/ }),
      ).toHaveTextContent(mediumEn.format(new Date(2025, 2, 10)));
      expect(
        screen.getByRole('button', { name: /^End date/ }),
      ).toHaveTextContent(mediumEn.format(new Date(2025, 2, 5)));
    });
  });
});
