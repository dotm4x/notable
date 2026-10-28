import { createRef, useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker, type TimePickerProps } from './time-picker.js';

function renderPicker(props: Partial<TimePickerProps> = {}) {
  return render(
    <TimePicker locale="en-US" aria-label="Start time" {...props} />,
  );
}

function trigger() {
  return screen.getByRole('button', { name: /^Start time/ });
}

function popup() {
  return screen.getByRole('dialog', { name: 'Choose time' });
}

function column(legend: string) {
  return within(popup()).getByRole('group', { name: legend });
}

function option(legend: string, label: string) {
  return within(column(legend)).getByRole('radio', { name: label });
}

async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(trigger());
}

/** Ensures the current value's hour is selected so the popup shows it. */
function selectedOption(legend: string) {
  return within(column(legend)).getByRole('radio', { checked: true });
}

describe('TimePicker', () => {
  describe('hover highlight', () => {
    it('highlights the hovered option and moves when the pointer leaves', async () => {
      const user = userEvent.setup();
      render(<TimePicker locale="en-US" defaultOpen />);

      const hour = option('Hour', '09').closest('label') as HTMLElement;
      const minute = option('Minute', '30').closest('label') as HTMLElement;

      await user.hover(hour);
      expect(hour).toHaveAttribute('data-highlighted');

      await user.unhover(hour);
      expect(hour).not.toHaveAttribute('data-highlighted');

      await user.hover(minute);
      expect(minute).toHaveAttribute('data-highlighted');
      expect(hour).not.toHaveAttribute('data-highlighted');
    });
  });

  describe('display', () => {
    it('shows the placeholder when no time is selected', () => {
      renderPicker();

      expect(trigger()).toHaveTextContent('Select a time');
    });

    it('shows a custom placeholder', () => {
      renderPicker({ placeholder: 'Pick a time' });

      expect(trigger()).toHaveTextContent('Pick a time');
    });

    it('shows a 24-hour value with zero padding', () => {
      renderPicker({ defaultValue: '09:05' });

      expect(trigger()).toHaveTextContent('09:05');
    });

    it('shows a 12-hour value with a period in 12h format', () => {
      renderPicker({ defaultValue: '15:30', format: '12h' });

      expect(trigger()).toHaveTextContent('3:30 PM');
    });

    it('shows midnight as 12 AM in 12h format', () => {
      renderPicker({ defaultValue: '00:15', format: '12h' });

      expect(trigger()).toHaveTextContent('12:15 AM');
    });

    it('treats null as an empty selection', () => {
      renderPicker({ value: null, placeholder: 'Empty' });

      expect(trigger()).toHaveTextContent('Empty');
    });

    it('treats an invalid value as an empty selection', () => {
      renderPicker({ value: '25:99', placeholder: 'Empty' });

      expect(trigger()).toHaveTextContent('Empty');
    });
  });

  describe('opening and closing', () => {
    it('is closed by default', () => {
      renderPicker();

      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens from the trigger and exposes expanded state', async () => {
      const user = userEvent.setup();
      renderPicker();

      await open(user);

      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(popup()).toBeInTheDocument();
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultOpen: true });

      await user.keyboard('{Escape}');

      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
    });

    it('starts open with defaultOpen', () => {
      renderPicker({ defaultOpen: true });

      expect(popup()).toBeInTheDocument();
    });

    it('notifies onOpenChange when opening and closing', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderPicker({ onOpenChange });

      await open(user);
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      await user.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('does not open when controlled open stays false', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderPicker({ open: false, onOpenChange });

      await open(user);

      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('commits an hour and minute and keeps the popup open', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ defaultValue: '09:30', onValueChange });
      await open(user);

      await user.click(option('Hour', '14'));

      expect(onValueChange).toHaveBeenLastCalledWith('14:30');
      expect(trigger()).toHaveTextContent('14:30');
      expect(popup()).toBeInTheDocument();
    });

    it('commits a minute change', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ defaultValue: '09:30', onValueChange });
      await open(user);

      await user.click(option('Minute', '45'));

      expect(onValueChange).toHaveBeenLastCalledWith('09:45');
    });

    it('does not notify when the selected time is unchanged', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ defaultValue: '09:30', onValueChange });
      await open(user);

      await user.click(option('Minute', '30'));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('selects a value when nothing was selected before', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ onValueChange });
      await open(user);

      await user.click(option('Hour', '08'));

      expect(onValueChange).toHaveBeenLastCalledWith('08:00');
    });

    it('treats a controlled value as the source of truth', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ value: '09:30', onValueChange });
      await open(user);

      await user.click(option('Hour', '10'));

      expect(onValueChange).toHaveBeenCalledWith('10:30');
      expect(trigger()).toHaveTextContent('09:30');
    });

    it('updates an uncontrolled value across selections', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultValue: '09:30' });
      await open(user);

      await user.click(option('Hour', '11'));
      await user.click(option('Minute', '15'));

      expect(trigger()).toHaveTextContent('11:15');
    });

    it('selects with the keyboard using native radio arrow keys', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ defaultValue: '09:30', onValueChange });
      await open(user);

      option('Minute', '30').focus();
      await user.keyboard('{ArrowDown}');

      expect(onValueChange).toHaveBeenLastCalledWith('09:31');
    });
  });

  describe('12-hour format', () => {
    it('shows hours 1 to 12 and an AM/PM column', async () => {
      const user = userEvent.setup();
      renderPicker({ format: '12h', defaultValue: '09:00' });
      await open(user);

      expect(within(column('Hour')).getAllByRole('radio')).toHaveLength(12);
      expect(within(column('AM/PM')).getAllByRole('radio')).toHaveLength(2);
    });

    it('keeps the current period when choosing an hour', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ format: '12h', defaultValue: '15:00', onValueChange });
      await open(user);

      await user.click(option('Hour', '08'));

      expect(onValueChange).toHaveBeenLastCalledWith('20:00');
    });

    it('switches period while keeping the hour', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ format: '12h', defaultValue: '09:00', onValueChange });
      await open(user);

      await user.click(option('AM/PM', 'PM'));

      expect(onValueChange).toHaveBeenLastCalledWith('21:00');
    });

    it('maps 12 AM to midnight and 12 PM to noon', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ format: '12h', defaultValue: '09:00', onValueChange });
      await open(user);

      await user.click(option('Hour', '12'));
      expect(onValueChange).toHaveBeenLastCalledWith('00:00');

      await user.click(option('AM/PM', 'PM'));
      expect(onValueChange).toHaveBeenLastCalledWith('12:00');
    });

    it('chooses a period when no value exists', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({ format: '12h', onValueChange });
      await open(user);

      await user.click(option('Hour', '03'));

      expect(onValueChange).toHaveBeenLastCalledWith('03:00');
    });
  });

  describe('24-hour format', () => {
    it('shows 00 to 23 and no AM/PM column', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultValue: '09:00' });
      await open(user);

      expect(within(column('Hour')).getAllByRole('radio')).toHaveLength(24);
      expect(
        within(popup()).queryByRole('group', { name: 'AM/PM' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('minute step', () => {
    it('offers only minutes on the step grid', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultValue: '09:00', minuteStep: 15 });
      await open(user);

      const labels = within(column('Minute'))
        .getAllByRole('radio')
        .map((input) => input.getAttribute('value'));

      expect(labels).toEqual(['0', '15', '30', '45']);
    });

    it('keeps an off-grid value visible and selected', async () => {
      const user = userEvent.setup();
      renderPicker({ value: '09:07', minuteStep: 15 });
      await open(user);

      expect(within(column('Minute')).getAllByRole('radio')).toHaveLength(5);
      expect(selectedOption('Minute')).toHaveAccessibleName('07');
    });

    it('rejects a step that does not divide 60', () => {
      expect(() => renderPicker({ minuteStep: 7 })).toThrow(RangeError);
    });

    it('rejects a non-integer step', () => {
      expect(() => renderPicker({ minuteStep: 0.5 })).toThrow(RangeError);
    });
  });

  describe('constraints', () => {
    it('disables hours outside minTime and maxTime', async () => {
      const user = userEvent.setup();
      renderPicker({
        defaultValue: '10:00',
        minTime: '09:00',
        maxTime: '17:30',
      });
      await open(user);

      expect(option('Hour', '08')).toBeDisabled();
      expect(option('Hour', '09')).toBeEnabled();
      expect(option('Hour', '17')).toBeEnabled();
      expect(option('Hour', '18')).toBeDisabled();
    });

    it('disables minutes outside the range for the selected hour', async () => {
      const user = userEvent.setup();
      renderPicker({
        defaultValue: '17:00',
        minTime: '09:00',
        maxTime: '17:30',
      });
      await open(user);

      expect(option('Minute', '30')).toBeEnabled();
      expect(option('Minute', '45')).toBeDisabled();
    });

    it('clamps a commit to the first allowed minute of the hour', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderPicker({
        defaultValue: '08:00',
        minTime: '09:20',
        onValueChange,
      });
      await open(user);

      await user.click(option('Hour', '09'));

      expect(onValueChange).toHaveBeenLastCalledWith('09:20');
    });

    it('includes the bounds as inclusive', async () => {
      const user = userEvent.setup();
      renderPicker({
        defaultValue: '12:00',
        minTime: '09:00',
        maxTime: '09:00',
      });
      await open(user);

      expect(option('Hour', '09')).toBeEnabled();
      expect(option('Hour', '10')).toBeDisabled();
    });

    it('rejects an invalid bound', () => {
      expect(() => renderPicker({ minTime: '9am' })).toThrow(RangeError);
    });

    it('rejects minTime later than maxTime', () => {
      expect(() =>
        renderPicker({ minTime: '18:00', maxTime: '09:00' }),
      ).toThrow(RangeError);
    });

    it('rejects a range with no selectable time', () => {
      expect(() =>
        renderPicker({ minTime: '09:01', maxTime: '09:02', minuteStep: 15 }),
      ).toThrow(RangeError);
    });

    it('disables the AM period when the range is entirely in the afternoon', async () => {
      const user = userEvent.setup();
      renderPicker({
        format: '12h',
        defaultValue: '13:00',
        minTime: '12:00',
      });
      await open(user);

      expect(option('AM/PM', 'AM')).toBeDisabled();
      expect(option('AM/PM', 'PM')).toBeEnabled();
    });
  });

  describe('disabled and read-only', () => {
    it('disables the trigger', () => {
      renderPicker({ disabled: true });

      expect(trigger()).toBeDisabled();
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      renderPicker({ disabled: true });

      await user.click(trigger());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not open when read-only', async () => {
      const user = userEvent.setup();
      renderPicker({ readOnly: true, defaultValue: '09:00' });

      await user.click(trigger());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger()).toHaveTextContent('09:00');
    });

    it('marks the trigger as read-only for styling', () => {
      renderPicker({ readOnly: true });

      expect(trigger()).toHaveAttribute('data-readonly');
    });
  });

  describe('controlled open state', () => {
    it('follows the open prop', () => {
      const { rerender } = renderPicker({ open: false });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(<TimePicker locale="en-US" aria-label="Start time" open />);

      expect(popup()).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('names the trigger with the label and the visible value', () => {
      renderPicker({ defaultValue: '09:30' });

      expect(trigger()).toHaveAccessibleName(/Start time/);
      expect(trigger()).toHaveAccessibleName(/09:30/);
    });

    it('names the trigger with aria-labelledby when provided', () => {
      render(
        <>
          <span id="external">Meeting</span>
          <TimePicker aria-labelledby="external" defaultValue="09:30" />
        </>,
      );

      expect(
        screen.getByRole('button', { name: /Meeting/ }),
      ).toHaveAccessibleName(/09:30/);
    });

    it('groups each column with a visible legend', async () => {
      const user = userEvent.setup();
      renderPicker({ format: '12h', defaultValue: '09:00' });
      await open(user);

      expect(column('Hour')).toBeInTheDocument();
      expect(column('Minute')).toBeInTheDocument();
      expect(column('AM/PM')).toBeInTheDocument();
    });

    it('exposes the selected option as checked', async () => {
      const user = userEvent.setup();
      renderPicker({ defaultValue: '09:30' });
      await open(user);

      expect(option('Hour', '09')).toBeChecked();
      expect(option('Minute', '30')).toBeChecked();
    });

    it('keeps the radio groups separate between instances', async () => {
      const user = userEvent.setup();
      render(
        <>
          <TimePicker aria-label="Start" defaultValue="09:00" />
          <TimePicker aria-label="End" defaultValue="17:00" />
        </>,
      );

      await user.click(screen.getByRole('button', { name: /^Start/ }));
      expect(option('Hour', '09')).toBeChecked();

      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('button', { name: /^End/ }));
      expect(option('Hour', '17')).toBeChecked();
    });
  });

  describe('custom content and refs', () => {
    it('forwards a ref to the trigger button', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<TimePicker ref={ref} locale="en-US" aria-label="Start time" />);

      expect(ref.current).toBe(trigger());
    });

    it('applies custom classes to the trigger', () => {
      renderPicker({ className: 'custom-time' });

      expect(trigger()).toHaveClass('custom-time');
    });

    it('passes native button attributes through to the trigger', () => {
      render(
        <TimePicker
          locale="en-US"
          aria-label="Start time"
          data-testid="time-trigger"
          name="start"
        />,
      );

      expect(screen.getByTestId('time-trigger')).toBe(trigger());
      expect(trigger()).toHaveAttribute('name', 'start');
    });
  });

  describe('state integration', () => {
    it('works as a controlled component with local state', async () => {
      const user = userEvent.setup();
      function Harness() {
        const [time, setTime] = useState<string | null>(null);
        return (
          <TimePicker
            aria-label="Start time"
            locale="en-US"
            value={time}
            onValueChange={setTime}
          />
        );
      }
      render(<Harness />);

      await user.click(trigger());
      await user.click(option('Hour', '07'));

      expect(trigger()).toHaveTextContent('07:00');
    });
  });
});
