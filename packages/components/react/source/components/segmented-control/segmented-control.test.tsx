import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './segmented-control.js';

const sampleOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const;

describe('SegmentedControl', () => {
  describe('Rendering', () => {
    it('renders every option and exposes accessible radiogroup and radio roles', () => {
      render(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          defaultValue="day"
        />,
      );

      const group = screen.getByRole('radiogroup', { name: 'Timeframe' });
      expect(group).toBeInTheDocument();

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
      expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Week' })).not.toBeChecked();
      expect(screen.getByRole('radio', { name: 'Month' })).not.toBeChecked();
    });

    it('applies the selected state correctly to the initial option', () => {
      render(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          defaultValue="month"
        />,
      );

      expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
    });

    it.each(['small', 'medium', 'large'] as const)(
      'supports the %s size',
      (size) => {
        render(
          <SegmentedControl
            size={size}
            aria-label={`Timeframe ${size}`}
            options={sampleOptions}
            defaultValue="day"
          />,
        );

        const group = screen.getByRole('radiogroup', {
          name: `Timeframe ${size}`,
        });
        expect(group).toHaveClass(`notable-segmented-control--${size}`);
      },
    );

    it('renders optional icons with aria-hidden', () => {
      render(
        <SegmentedControl
          aria-label="View format"
          options={[
            {
              label: 'List',
              value: 'list',
              icon: <span data-testid="list-icon">Icon</span>,
            },
            { label: 'Grid', value: 'grid' },
          ]}
          defaultValue="list"
        />,
      );

      const icon = screen.getByTestId('list-icon').parentElement;
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByRole('radio', { name: 'List' })).toBeInTheDocument();
    });

    it('handles empty options list gracefully without crashing', () => {
      render(<SegmentedControl aria-label="Empty control" options={[]} />);

      const group = screen.getByRole('radiogroup', { name: 'Empty control' });
      expect(group).toBeInTheDocument();
      expect(screen.queryAllByRole('radio')).toHaveLength(0);
    });

    it('handles a single option correctly', () => {
      render(
        <SegmentedControl
          aria-label="Single option control"
          options={[{ label: 'Only', value: 'only' }]}
          defaultValue="only"
        />,
      );

      const radio = screen.getByRole('radio', { name: 'Only' });
      expect(radio).toBeChecked();
    });
  });

  describe('Selection', () => {
    it('supports uncontrolled usage and updates selection on user click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          defaultValue="day"
          onChange={onChange}
        />,
      );

      const weekRadio = screen.getByRole('radio', { name: 'Week' });
      await user.click(weekRadio);

      expect(weekRadio).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('week');
    });

    it('supports controlled usage with value and onChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      function ControlledTestComponent() {
        const [value, setValue] = useState('day');
        return (
          <SegmentedControl
            aria-label="Controlled timeframe"
            options={sampleOptions}
            value={value}
            onChange={(val) => {
              setValue(val);
              onChange(val);
            }}
          />
        );
      }

      render(<ControlledTestComponent />);

      const monthRadio = screen.getByRole('radio', { name: 'Month' });
      await user.click(monthRadio);

      expect(monthRadio).toBeChecked();
      expect(onChange).toHaveBeenCalledWith('month');
    });

    it('does not call onChange when clicking an already selected option', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          defaultValue="day"
          onChange={onChange}
        />,
      );

      const dayRadio = screen.getByRole('radio', { name: 'Day' });
      await user.click(dayRadio);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('updates correctly when parent changes the controlled value', () => {
      const { rerender } = render(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          value="day"
        />,
      );

      expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();

      rerender(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          value="month"
        />,
      );

      expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
    });

    it('supports form integration and sets FormData with name prop', async () => {
      const user = userEvent.setup();

      render(
        <form aria-label="Preferences form">
          <SegmentedControl
            name="period"
            aria-label="Period"
            options={sampleOptions}
            defaultValue="day"
          />
        </form>,
      );

      const form = document.querySelector('form');
      if (!form) {
        throw new Error('Expected form to be present');
      }

      expect(new FormData(form).get('period')).toBe('day');

      await user.click(screen.getByRole('radio', { name: 'Month' }));
      expect(new FormData(form).get('period')).toBe('month');
    });
  });

  describe('Disabled states', () => {
    it('does not allow selection of disabled options', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <SegmentedControl
          aria-label="Delivery tier"
          options={[
            { label: 'Standard', value: 'standard' },
            { label: 'Express', value: 'express', disabled: true },
            { label: 'Overnight', value: 'overnight' },
          ]}
          defaultValue="standard"
          onChange={onChange}
        />,
      );

      const expressRadio = screen.getByRole('radio', { name: 'Express' });
      expect(expressRadio).toBeDisabled();

      await user.click(expressRadio);

      expect(expressRadio).not.toBeChecked();
      expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('disables the entire control when requested', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <SegmentedControl
          disabled
          aria-label="Disabled timeframe"
          options={sampleOptions}
          defaultValue="day"
          onChange={onChange}
        />,
      );

      const group = screen.getByRole('radiogroup', {
        name: 'Disabled timeframe',
      });
      expect(group).toHaveAttribute('aria-disabled', 'true');
      expect(group).toHaveAttribute('data-disabled');

      const allRadios = screen.getAllByRole('radio');
      for (const radio of allRadios) {
        expect(radio).toBeDisabled();
      }

      await user.click(screen.getByRole('radio', { name: 'Week' }));
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
    });

    it('handles all-disabled options correctly', () => {
      render(
        <SegmentedControl
          aria-label="All disabled"
          options={[
            { label: 'A', value: 'a', disabled: true },
            { label: 'B', value: 'b', disabled: true },
          ]}
          defaultValue="a"
        />,
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).toBeDisabled();
      expect(radios[0]).toBeChecked();
    });

    it('does not move selection to an unrelated option when the current selection is absent', () => {
      render(
        <SegmentedControl
          aria-label="Missing selection"
          options={sampleOptions}
          value={'nonexistent' as unknown as string}
        />,
      );

      const radios = screen.getAllByRole('radio');
      for (const radio of radios) {
        expect(radio).not.toBeChecked();
      }
    });
  });

  describe('Keyboard and accessibility', () => {
    it('supports visible group label via label prop and links via aria-labelledby', () => {
      render(
        <SegmentedControl
          label="Reporting Interval"
          options={sampleOptions}
          defaultValue="day"
        />,
      );

      const group = screen.getByRole('radiogroup', {
        name: 'Reporting Interval',
      });
      expect(group).toBeInTheDocument();
      expect(screen.getByText('Reporting Interval')).toBeInTheDocument();
    });

    it('supports aria-labelledby pointing to an external element', () => {
      render(
        <>
          <h2 id="external-heading">External Filter</h2>
          <SegmentedControl
            aria-labelledby="external-heading"
            options={sampleOptions}
            defaultValue="day"
          />
        </>,
      );

      const group = screen.getByRole('radiogroup', { name: 'External Filter' });
      expect(group).toHaveAttribute('aria-labelledby', 'external-heading');
    });

    it('supports arrow-key navigation according to radio group behavior', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          defaultValue="day"
          onChange={onChange}
        />,
      );

      const dayRadio = screen.getByRole('radio', { name: 'Day' });
      const weekRadio = screen.getByRole('radio', { name: 'Week' });
      const monthRadio = screen.getByRole('radio', { name: 'Month' });

      dayRadio.focus();
      expect(dayRadio).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(weekRadio).toHaveFocus();
      expect(weekRadio).toBeChecked();
      expect(onChange).toHaveBeenCalledWith('week');

      await user.keyboard('{ArrowRight}');
      expect(monthRadio).toHaveFocus();
      expect(monthRadio).toBeChecked();
      expect(onChange).toHaveBeenCalledWith('month');

      await user.keyboard('{ArrowLeft}');
      expect(weekRadio).toHaveFocus();
      expect(weekRadio).toBeChecked();
    });

    it('moves selection to the first and last enabled options with Home and End', async () => {
      // Arrange
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <SegmentedControl
          aria-label="Timeframe"
          defaultValue="week"
          onChange={onChange}
          options={[
            { label: 'Day', value: 'day', disabled: true },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year', disabled: true },
          ]}
        />,
      );
      screen.getByRole('radio', { name: 'Week' }).focus();

      // Act
      await user.keyboard('{End}');

      // Assert
      expect(screen.getByRole('radio', { name: 'Month' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();

      // Act
      await user.keyboard('{Home}');

      // Assert
      expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
      expect(onChange).toHaveBeenNthCalledWith(1, 'month');
      expect(onChange).toHaveBeenNthCalledWith(2, 'week');
    });

    it('skips disabled options during arrow key navigation', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <SegmentedControl
          aria-label="Delivery tiers"
          options={[
            { label: 'Standard', value: 'standard' },
            { label: 'Express', value: 'express', disabled: true },
            { label: 'Overnight', value: 'overnight' },
          ]}
          defaultValue="standard"
          onChange={onChange}
        />,
      );

      const standardRadio = screen.getByRole('radio', { name: 'Standard' });
      const overnightRadio = screen.getByRole('radio', { name: 'Overnight' });

      standardRadio.focus();
      await user.keyboard('{ArrowRight}');

      expect(overnightRadio).toHaveFocus();
      expect(overnightRadio).toBeChecked();
      expect(onChange).toHaveBeenCalledWith('overnight');
    });

    it('selects an unchecked option using Spacebar', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <SegmentedControl
          aria-label="Unset timeframe"
          options={sampleOptions}
          onChange={onChange}
        />,
      );

      const dayRadio = screen.getByRole('radio', { name: 'Day' });
      expect(dayRadio).not.toBeChecked();

      dayRadio.focus();
      await user.keyboard(' ');

      expect(dayRadio).toBeChecked();
      expect(onChange).toHaveBeenCalledWith('day');
    });

    it('supports tab navigation into the active radio option', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button type="button">Before</button>
          <SegmentedControl
            aria-label="Timeframe"
            options={sampleOptions}
            defaultValue="week"
          />
          <button type="button">After</button>
        </div>,
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      const weekRadio = screen.getByRole('radio', { name: 'Week' });
      const afterButton = screen.getByRole('button', { name: 'After' });

      beforeButton.focus();
      expect(beforeButton).toHaveFocus();

      await user.tab();
      expect(weekRadio).toHaveFocus();

      await user.tab();
      expect(afterButton).toHaveFocus();
    });
  });

  describe('Motion and edge cases', () => {
    it('renders the animated selection indicator on the selected option', () => {
      const { container } = render(
        <SegmentedControl
          aria-label="Timeframe"
          options={sampleOptions}
          defaultValue="week"
        />,
      );

      const indicators = container.querySelectorAll(
        '.notable-segmented-control__indicator',
      );
      expect(indicators).toHaveLength(1);

      const group = screen.getByRole('radiogroup', { name: 'Timeframe' });
      const weekItem = screen
        .getByRole('radio', { name: 'Week' })
        .closest('.notable-segmented-control__item');
      expect(weekItem).toHaveAttribute('data-selected');
      expect(weekItem).toHaveAttribute('data-selector-item');
      expect(indicators[0]?.parentElement).toBe(group);
      expect(indicators[0]).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not render an indicator when no option is selected', () => {
      const { container } = render(
        <SegmentedControl aria-label="Unselected" options={sampleOptions} />,
      );

      const indicators = container.querySelectorAll(
        '.notable-segmented-control__indicator',
      );
      expect(indicators).toHaveLength(0);
    });

    it('handles reduced-motion preference without affecting selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      try {
        render(
          <SegmentedControl
            aria-label="Reduced motion timeframe"
            options={sampleOptions}
            defaultValue="day"
            onChange={onChange}
          />,
        );

        const monthRadio = screen.getByRole('radio', { name: 'Month' });
        await user.click(monthRadio);

        expect(monthRadio).toBeChecked();
        expect(onChange).toHaveBeenCalledWith('month');
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });

    it('forwards container ref properly', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <SegmentedControl
          ref={ref}
          aria-label="Ref timeframe"
          options={sampleOptions}
          defaultValue="day"
        />,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'radiogroup');
    });

    it('extends the indicator to the container padding on the first option', () => {
      // Arrange
      const original = window.getComputedStyle.bind(window);
      vi.spyOn(window, 'getComputedStyle').mockImplementation((element) =>
        element.getAttribute('role') === 'radiogroup'
          ? ({ paddingLeft: '3px', paddingRight: '3px' } as CSSStyleDeclaration)
          : original(element),
      );
      vi.spyOn(
        HTMLElement.prototype,
        'getBoundingClientRect',
      ).mockImplementation(function (this: HTMLElement) {
        const rectAt = (left: number, width: number) => ({
          x: left,
          y: 0,
          left,
          top: 0,
          right: left + width,
          bottom: 40,
          width,
          height: 40,
          toJSON: () => ({}),
        });
        if (this.getAttribute('role') === 'radiogroup') {
          return rectAt(0, 306);
        }
        const items = Array.from(
          this.parentElement?.querySelectorAll(
            '.notable-segmented-control__item',
          ) ?? [],
        );
        const index = items.indexOf(this);
        return index === -1 ? rectAt(0, 0) : rectAt(3 + index * 100, 100);
      });

      // Act
      const { container } = render(
        <SegmentedControl
          aria-label="Padded timeframe"
          options={sampleOptions}
          defaultValue="day"
        />,
      );

      // Assert
      const indicator = container.querySelector<HTMLElement>(
        '.notable-segmented-control__indicator',
      );
      expect(indicator?.style.left).toBe('0px');
      expect(indicator?.style.width).toBe('103px');

      vi.restoreAllMocks();
    });

    it('selects an option when the indicator is dragged', () => {
      const onChange = vi.fn();

      const { container } = render(
        <SegmentedControl
          aria-label="Draggable timeframe"
          options={sampleOptions}
          defaultValue="day"
          onChange={onChange}
        />,
      );

      const group = screen.getByRole('radiogroup', {
        name: 'Draggable timeframe',
      });
      const indicator = container.querySelector(
        '.notable-segmented-control__indicator',
      );

      expect(indicator).toBeInTheDocument();

      const dayItem = screen
        .getByRole('radio', { name: 'Day' })
        .closest('.notable-segmented-control__item');

      const monthItem = screen
        .getByRole('radio', { name: 'Month' })
        .closest('.notable-segmented-control__item');

      if (!dayItem || !monthItem) {
        throw new Error('Expected option elements to exist');
      }

      vi.spyOn(group, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 300,
        bottom: 40,
        width: 300,
        height: 40,
        toJSON: () => ({}),
      });

      vi.spyOn(dayItem, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 100,
        bottom: 40,
        width: 100,
        height: 40,
        toJSON: () => ({}),
      });

      vi.spyOn(monthItem, 'getBoundingClientRect').mockReturnValue({
        x: 200,
        y: 0,
        left: 200,
        top: 0,
        right: 300,
        bottom: 40,
        width: 100,
        height: 40,
        toJSON: () => ({}),
      });

      const pointerEvent = (
        target: Element,
        type: string,
        clientX: number,
        pointerId = 1,
      ) => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperties(event, {
          clientX: { value: clientX },
          clientY: { value: 20 },
          pointerId: { value: pointerId },
          button: { value: 0 },
        });
        target.dispatchEvent(event);
      };

      pointerEvent(dayItem, 'pointerdown', 40);
      pointerEvent(group, 'pointermove', 240);
      pointerEvent(group, 'pointerup', 240);

      expect(onChange).toHaveBeenCalledWith('month');
    });

    it('keeps the previous selection when the indicator is released over a disabled option', () => {
      // Arrange
      const onChange = vi.fn();
      const rect = (left: number, width: number) => ({
        x: left,
        y: 0,
        left,
        top: 0,
        right: left + width,
        bottom: 40,
        width,
        height: 40,
        toJSON: () => ({}),
      });
      render(
        <SegmentedControl
          aria-label="Draggable timeframe with disabled end"
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month', disabled: true },
          ]}
          defaultValue="day"
          onChange={onChange}
        />,
      );

      const group = screen.getByRole('radiogroup', {
        name: 'Draggable timeframe with disabled end',
      });
      const dayItem = screen
        .getByRole('radio', { name: 'Day' })
        .closest('.notable-segmented-control__item');
      const weekItem = screen
        .getByRole('radio', { name: 'Week' })
        .closest('.notable-segmented-control__item');
      const monthItem = screen
        .getByRole('radio', { name: 'Month' })
        .closest('.notable-segmented-control__item');

      if (!dayItem || !weekItem || !monthItem) {
        throw new Error('Expected option elements to exist');
      }

      vi.spyOn(group, 'getBoundingClientRect').mockReturnValue(rect(0, 300));
      vi.spyOn(dayItem, 'getBoundingClientRect').mockReturnValue(rect(0, 100));
      vi.spyOn(weekItem, 'getBoundingClientRect').mockReturnValue(
        rect(100, 100),
      );
      vi.spyOn(monthItem, 'getBoundingClientRect').mockReturnValue(
        rect(200, 100),
      );

      const pointerEvent = (target: Element, type: string, clientX: number) => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperties(event, {
          clientX: { value: clientX },
          clientY: { value: 20 },
          pointerId: { value: 1 },
          button: { value: 0 },
        });
        target.dispatchEvent(event);
      };

      // Act
      pointerEvent(dayItem, 'pointerdown', 40);
      pointerEvent(group, 'pointermove', 240);
      pointerEvent(group, 'pointerup', 240);

      // Assert
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
    });
  });
});
