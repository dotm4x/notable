import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './slider.js';
import { Slider as PublicSlider } from '../../index.js';

const sliderStylesheet = readFileSync(
  path.join(import.meta.dirname, 'slider.css'),
  'utf8',
);

function getSliderInput(): HTMLInputElement {
  const slider = screen.getByRole('slider');

  if (!(slider instanceof HTMLInputElement)) {
    throw new Error('Expected Base UI to render a range input for the slider.');
  }

  return slider;
}

describe('Slider', () => {
  it('renders an accessible slider with the default value and public export', () => {
    render(<PublicSlider label="Volume" />);

    const slider = screen.getByRole('slider', { name: 'Volume' });

    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });

  it('supports uncontrolled values and keyboard changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider
        label="Volume"
        defaultValue={30}
        onValueChange={onValueChange}
        showValue
      />,
    );

    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuenow', '30');
    expect(screen.getByText('30')).toBeInTheDocument();

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(slider).toHaveAttribute('aria-valuenow', '31');
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(onValueChange).toHaveBeenCalledWith(31);
  });

  it('keeps controlled values in the parent and reports requested changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider aria-label="Volume" value={40} onValueChange={onValueChange} />,
    );

    const slider = screen.getByRole('slider', { name: 'Volume' });
    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(slider).toHaveAttribute('aria-valuenow', '40');
    expect(onValueChange).toHaveBeenCalledWith(41);
  });

  it('respects custom bounds, step size, and keyboard boundaries', async () => {
    const user = userEvent.setup();

    render(
      <Slider
        aria-label="Temperature"
        defaultValue={16}
        min={10}
        max={20}
        step={2}
      />,
    );

    const slider = getSliderInput();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '18');

    await user.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '20');
    await user.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  it.each([
    { step: 0.1, initial: 0.2, expected: '0.3' },
    { step: 0.25, initial: 0.25, expected: '0.5' },
  ])(
    'supports decimal step $step without floating-point artifacts',
    async ({ step, initial, expected }) => {
      const user = userEvent.setup();

      render(
        <Slider
          aria-label="Amount"
          defaultValue={initial}
          min={0}
          max={1}
          step={step}
        />,
      );

      await user.tab();
      await user.keyboard('{ArrowRight}');

      expect(getSliderInput()).toHaveAttribute('aria-valuenow', expected);
    },
  );

  it('associates the visible label, description, and external description', () => {
    render(
      <>
        <span id="additional-help">Additional help</span>
        <Slider
          label="Zoom"
          description="Adjust the page magnification."
          aria-describedby="additional-help"
        />
      </>,
    );

    const slider = screen.getByRole('slider', { name: 'Zoom' });
    const description = screen.getByText('Adjust the page magnification.');

    expect(slider.getAttribute('aria-describedby')).toBe(
      `additional-help ${description.id}`,
    );
  });

  it('supports aria-label and aria-valuetext without a visible label', () => {
    render(
      <Slider
        aria-label="Playback speed"
        aria-valuetext="Normal"
        value={1}
        min={0.5}
        max={2}
        step={0.5}
      />,
    );

    const slider = screen.getByRole('slider', { name: 'Playback speed' });
    expect(slider).toHaveAttribute('aria-valuetext', 'Normal');
  });

  it('supports named range thumbs and reports range values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider
        label="Price"
        defaultValue={[20, 80]}
        thumbLabels={['Minimum price', 'Maximum price']}
        onValueChange={onValueChange}
      />,
    );

    const [minimum, maximum] = screen.getAllByRole('slider');
    expect(minimum).toHaveAccessibleName('Minimum price');
    expect(maximum).toHaveAccessibleName('Maximum price');
    expect(minimum).toHaveAttribute('aria-valuenow', '20');
    expect(maximum).toHaveAttribute('aria-valuenow', '80');

    minimum.focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenLastCalledWith([21, 80]);
  });

  it('renders interval marks and updates their active state after each step', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Slider
        aria-label="Distance"
        defaultValue={25}
        step={25}
        markInterval={25}
      />,
    );

    const marks = [
      ...container.querySelectorAll<HTMLElement>('.notable-slider__mark'),
    ];
    expect(marks).toHaveLength(5);
    expect(
      marks.slice(0, 2).every((mark) => mark.hasAttribute('data-active')),
    ).toBe(true);
    expect(
      marks.slice(2).every((mark) => !mark.hasAttribute('data-active')),
    ).toBe(true);

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(getSliderInput()).toHaveAttribute('aria-valuenow', '50');
    expect(
      marks.slice(0, 3).every((mark) => mark.hasAttribute('data-active')),
    ).toBe(true);
  });

  it('supports vertical orientation and explicit mark labels', () => {
    const { container } = render(
      <Slider
        aria-label="Volume"
        orientation="vertical"
        defaultValue={50}
        marks={[{ value: 50, label: 'Halfway' }]}
      />,
    );

    expect(getSliderInput()).toHaveAttribute('aria-orientation', 'vertical');
    expect(container.querySelector('.notable-slider')).toHaveClass(
      'notable-slider--vertical',
    );
    expect(screen.getByText('Halfway')).toBeInTheDocument();
  });

  it('submits the current value through its named form control', () => {
    render(
      <form aria-label="Preferences">
        <Slider aria-label="Volume" name="volume" defaultValue={30} />
      </form>,
    );

    const form = screen.getByRole('form', { name: 'Preferences' });
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Expected the named form to render as a form element.');
    }

    expect(new FormData(form).get('volume')).toBe('30');
  });

  it('formats the displayed and accessible values', () => {
    render(
      <Slider
        aria-label="Price"
        defaultValue={20}
        showValue
        formatValue={(value) => `$${value}`}
      />,
    );

    expect(screen.getByText('$20')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '$20');
  });

  it('prevents changes when read only and associates an error message', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider
        label="Volume"
        defaultValue={50}
        readOnly
        required
        error="Volume cannot be changed."
        onValueChange={onValueChange}
      />,
    );

    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-readonly', 'true');
    expect(slider).toHaveAttribute('aria-required', 'true');
    expect(slider).toHaveAttribute('aria-invalid', 'true');
    expect(slider.getAttribute('aria-describedby')).toContain(
      screen.getByText('Volume cannot be changed.').id,
    );

    slider.focus();
    await user.keyboard('{ArrowRight}');

    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not respond to keyboard input when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider
        aria-label="Volume"
        defaultValue={50}
        disabled
        onValueChange={onValueChange}
      />,
    );

    const slider = getSliderInput();
    expect(slider).toBeDisabled();
    await user.keyboard('{ArrowRight}');

    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('updates when controlled value and range props change', () => {
    const { rerender } = render(
      <Slider aria-label="Volume" value={50} min={0} max={100} step={1} />,
    );

    rerender(
      <Slider aria-label="Volume" value={8} min={4} max={12} step={2} />,
    );

    const slider = getSliderInput();
    expect(slider).toHaveAttribute('min', '4');
    expect(slider).toHaveAttribute('max', '12');
    expect(slider).toHaveAttribute('aria-valuenow', '8');
    expect(slider).toHaveAttribute('step', '2');
  });

  it('renders an equal-bound slider as a safe fixed value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider
        aria-label="Fixed value"
        min={5}
        max={5}
        defaultValue={8}
        onValueChange={onValueChange}
        showValue
      />,
    );

    const slider = screen.getByRole('slider', { name: 'Fixed value' });
    expect(slider).toHaveAttribute('aria-valuemin', '5');
    expect(slider).toHaveAttribute('aria-valuemax', '5');
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('5')).toBeInTheDocument();

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(slider).toHaveAttribute('aria-valuenow', '5');
    expect(slider).not.toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('clamps a fixed controlled value to its single available value', () => {
    render(<Slider aria-label="Fixed value" min={5} max={5} value={2} />);

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '5');
  });

  it('rejects invalid bounds and non-positive steps explicitly', () => {
    expect(() =>
      render(<Slider aria-label="Invalid bounds" min={10} max={5} />),
    ).toThrow(RangeError);
    expect(() => render(<Slider aria-label="Invalid step" step={0} />)).toThrow(
      RangeError,
    );
    expect(() =>
      render(<Slider aria-label="Invalid marks" markInterval={0} />),
    ).toThrow(RangeError);
  });

  it('updates the value when the track is pressed and the thumb is dragged', () => {
    const pointerMethods = [
      'setPointerCapture',
      'hasPointerCapture',
      'releasePointerCapture',
    ] as const;
    const originalDescriptors = pointerMethods.map((method) =>
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, method),
    );
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      configurable: true,
      value: () => undefined,
    });
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
      configurable: true,
      value: () => false,
    });
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
      configurable: true,
      value: () => undefined,
    });
    const rectSpy = vi
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: Element) {
        const isThumb = this.classList.contains('notable-slider__thumb');
        const thumbValue = isThumb
          ? Number(
              this.querySelector<HTMLInputElement>('input[type="range"]')
                ?.value ?? 0,
            )
          : 0;
        const left = isThumb ? thumbValue * 2 - 10 : 0;
        const width = isThumb ? 20 : 200;
        const top = isThumb ? 6 : 0;
        const height = isThumb ? 20 : 32;
        return {
          x: left,
          y: top,
          left,
          right: left + width,
          top,
          bottom: top + height,
          width,
          height,
          toJSON: () => undefined,
        };
      });

    try {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={20} />,
      );
      const control = container.querySelector('.notable-slider__control');
      const slider = getSliderInput();

      if (!control) {
        throw new Error('Expected the slider control to render.');
      }

      fireEvent.pointerDown(control, {
        pointerId: 1,
        button: 0,
        clientX: 160,
        clientY: 16,
      });
      expect(slider).toHaveAttribute('aria-valuenow', '80');
      fireEvent.pointerUp(document, { pointerId: 1, clientX: 160 });

      fireEvent.pointerDown(slider, {
        pointerId: 2,
        button: 0,
        clientX: 160,
        clientY: 16,
      });
      fireEvent.pointerMove(document, {
        pointerId: 2,
        buttons: 1,
        clientX: 130,
        clientY: 16,
      });
      fireEvent.pointerMove(document, {
        pointerId: 2,
        buttons: 1,
        clientX: 100,
        clientY: 16,
      });
      fireEvent.pointerUp(document, { pointerId: 2, clientX: 100 });

      expect(slider).toHaveAttribute('aria-valuenow', '50');
    } finally {
      rectSpy.mockRestore();
      pointerMethods.forEach((method, index) => {
        const descriptor = originalDescriptors[index];
        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, method, descriptor);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, method);
        }
      });
    }
  });
});

describe('Slider discrete-step animation', () => {
  function getRuleBody(selector: string): string {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`).exec(
      sliderStylesheet,
    );

    if (!match?.[1]) {
      throw new Error(`Expected the stylesheet to define ${selector}.`);
    }

    return match[1];
  }

  it('updates the thumb and indicator inline geometry on keyboard steps', async () => {
    // Arrange
    const user = userEvent.setup();
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={20} />,
    );
    const thumb = container.querySelector<HTMLElement>(
      '.notable-slider__thumb',
    );
    const indicator = container.querySelector<HTMLElement>(
      '.notable-slider__indicator',
    );
    const slider = getSliderInput();

    if (!thumb || !indicator) {
      throw new Error('Expected the thumb and indicator to render.');
    }

    const thumbStyleBefore = thumb.getAttribute('style');
    const indicatorStyleBefore = indicator.getAttribute('style');

    // Act
    slider.focus();
    await user.keyboard('{ArrowRight}');

    // Assert
    expect(slider).toHaveAttribute('aria-valuenow', '21');
    expect(thumb.getAttribute('style')).not.toBe(thumbStyleBefore);
    expect(indicator.getAttribute('style')).not.toBe(indicatorStyleBefore);
  });

  it('updates both range thumbs and the indicator on keyboard steps', async () => {
    // Arrange
    const user = userEvent.setup();
    const { container } = render(
      <Slider aria-label="Range" defaultValue={[20, 80]} />,
    );
    const thumbs = container.querySelectorAll<HTMLElement>(
      '.notable-slider__thumb',
    );
    const indicator = container.querySelector<HTMLElement>(
      '.notable-slider__indicator',
    );
    const [firstSlider, secondSlider] = screen.getAllByRole('slider');

    if (thumbs.length !== 2 || !indicator || !firstSlider || !secondSlider) {
      throw new Error('Expected two thumbs and an indicator to render.');
    }

    const firstStyleBefore = thumbs[0]?.getAttribute('style');
    const secondStyleBefore = thumbs[1]?.getAttribute('style');
    const indicatorStyleBefore = indicator.getAttribute('style');

    // Act
    firstSlider.focus();
    await user.keyboard('{ArrowRight}');
    const firstStyleAfterFirstStep = thumbs[0]?.getAttribute('style');
    const secondStyleAfterFirstStep = thumbs[1]?.getAttribute('style');
    const indicatorStyleAfterFirstStep = indicator.getAttribute('style');

    secondSlider.focus();
    await user.keyboard('{ArrowLeft}');

    // Assert
    expect(firstStyleAfterFirstStep).not.toBe(firstStyleBefore);
    expect(secondStyleAfterFirstStep).toBe(secondStyleBefore);
    expect(indicatorStyleAfterFirstStep).not.toBe(indicatorStyleBefore);
    expect(thumbs[1]?.getAttribute('style')).not.toBe(
      secondStyleAfterFirstStep,
    );
  });

  it('animates thumb and indicator positions with one shared base transition for horizontal and vertical layouts', () => {
    // Arrange
    const thumbRule = getRuleBody('.notable-slider__thumb');
    const indicatorRule = getRuleBody('.notable-slider__indicator');

    // Assert
    for (const rule of [thumbRule, indicatorRule]) {
      expect(rule).toMatch(
        /transition:[\s\S]*inset-inline-start var\(--notable-duration-base\)/,
      );
      expect(rule).toMatch(/bottom var\(--notable-duration-base\)/);
    }
    expect(indicatorRule).toMatch(/width var\(--notable-duration-base\)/);
    expect(indicatorRule).toMatch(/height var\(--notable-duration-base\)/);
  });

  it('keeps positional transitions active during pointer drags instead of switching them off', () => {
    // Assert
    expect(sliderStylesheet).not.toMatch(/data-pointer-moving/);
    expect(sliderStylesheet).not.toMatch(
      /\[data-dragging\][^{]*\{\s*transition:\s*none;/,
    );
  });

  it('scales only the individually pressed thumb, never every thumb through the shared dragging state', () => {
    // Assert
    expect(sliderStylesheet).toMatch(
      /\.notable-slider__thumb:active\s*\{\s*scale:\s*1\.05;/,
    );
    expect(sliderStylesheet).not.toMatch(/\[data-dragging\][^{]*\{[^}]*scale:/);
  });

  it('applies thumb hover styling only to pointer devices', () => {
    // Assert
    expect(sliderStylesheet).toMatch(
      /@media \(hover: hover\)\s*\{\s*\.notable-slider__thumb:hover\s*\{/,
    );
  });

  it('disables thumb and indicator transitions under reduced motion', () => {
    // Assert
    expect(sliderStylesheet).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*\.notable-slider__thumb,\s*\.notable-slider__indicator\s*\{\s*transition:\s*none;/,
    );
  });
});
