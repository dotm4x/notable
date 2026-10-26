import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress, type ProgressSize } from './progress.js';
import { Progress as PublicProgress } from '../../index.js';

function renderProgress(
  props: Parameters<typeof Progress>[0] = {},
): HTMLElement {
  const { container } = render(<Progress aria-label="Upload" {...props} />);
  const element = container.firstElementChild;

  if (!(element instanceof HTMLElement)) {
    throw new Error('Expected Progress to render an HTML element');
  }

  return element;
}

function getIndicator(progress: HTMLElement): HTMLElement {
  const indicator = progress.firstElementChild;

  if (!(indicator instanceof HTMLElement)) {
    throw new Error('Expected Progress to render an indicator element');
  }

  return indicator;
}

describe('Progress', () => {
  it('renders an indeterminate progress bar by default', () => {
    // Arrange, Act
    const progress = renderProgress();

    // Assert
    expect(progress.tagName).toBe('DIV');
    expect(progress).toHaveClass(
      'notable-progress',
      'notable-progress--medium',
      'notable-progress--smooth',
      'notable-progress--indeterminate',
    );
    expect(progress).toHaveAttribute('role', 'progressbar');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).not.toHaveAttribute('aria-valuenow');
  });

  it('contains exactly one decorative indicator and nothing focusable', () => {
    const progress = renderProgress({ value: 50 });

    expect(progress.children).toHaveLength(1);
    expect(getIndicator(progress)).toHaveClass('notable-progress__indicator');
    expect(getIndicator(progress)).toBeEmptyDOMElement();
    expect(progress).not.toHaveAttribute('tabindex');
  });

  it('exposes a determinate value and maps it to the indicator position', () => {
    const progress = renderProgress({ value: 40 });

    expect(progress).not.toHaveClass('notable-progress--indeterminate');
    expect(progress).toHaveAttribute('aria-valuenow', '40');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '40%',
    );
  });

  it('renders zero progress at the start of the track', () => {
    const progress = renderProgress({ value: 0 });

    expect(progress).toHaveAttribute('aria-valuenow', '0');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '0%',
    );
  });

  it('renders completed progress at the end of the track', () => {
    const progress = renderProgress({ value: 100 });

    expect(progress).toHaveAttribute('aria-valuenow', '100');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '100%',
    );
  });

  it.each([
    { value: -20, expected: '0' },
    { value: 150, expected: '100' },
    { value: Number.NEGATIVE_INFINITY, expected: '0' },
    { value: Number.POSITIVE_INFINITY, expected: '100' },
  ])('clamps value $value to $expected', ({ value, expected }) => {
    const progress = renderProgress({ value });

    expect(progress).toHaveAttribute('aria-valuenow', expected);
  });

  it('measures progress against a custom maximum', () => {
    const progress = renderProgress({ value: 3, max: 4 });

    expect(progress).toHaveAttribute('aria-valuemax', '4');
    expect(progress).toHaveAttribute('aria-valuenow', '3');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '75%',
    );
  });

  it('clamps values to a custom maximum', () => {
    const progress = renderProgress({ value: 80, max: 50 });

    expect(progress).toHaveAttribute('aria-valuemax', '50');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('updates the rendered value when props change', () => {
    const { container, rerender } = render(
      <Progress aria-label="Upload" value={20} />,
    );

    rerender(<Progress aria-label="Upload" value={80} />);

    const progress = container.firstElementChild;
    expect(progress).toHaveAttribute('aria-valuenow', '80');
    expect(
      progress instanceof HTMLElement
        ? progress.style.getPropertyValue('--notable-progress-value')
        : undefined,
    ).toBe('80%');
  });

  it('treats a missing value as indeterminate without a fabricated value', () => {
    const progress = renderProgress();

    expect(progress).toHaveClass('notable-progress--indeterminate');
    expect(progress).not.toHaveAttribute('aria-valuenow');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '',
    );
  });

  it('treats NaN as indeterminate', () => {
    const progress = renderProgress({ value: Number.NaN });

    expect(progress).toHaveClass('notable-progress--indeterminate');
    expect(progress).not.toHaveAttribute('aria-valuenow');
  });

  it.each([
    { max: 0 },
    { max: -5 },
    { max: Number.NaN },
    { max: Number.POSITIVE_INFINITY },
  ])('falls back to 100 for the invalid maximum $max', ({ max }) => {
    const progress = renderProgress({ value: 50, max });

    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '50%',
    );
  });

  it.each<ProgressSize>(['small', 'medium', 'large'])(
    'applies the %s size class',
    (size) => {
      const progress = renderProgress({ size });

      expect(progress).toHaveClass(`notable-progress--${size}`);
    },
  );

  it('applies a numeric thickness as pixels', () => {
    const progress = renderProgress({ thickness: 6 });

    expect(
      progress.style.getPropertyValue('--notable-progress-thickness'),
    ).toBe('6px');
  });

  it('passes a string thickness through as CSS', () => {
    const progress = renderProgress({ thickness: '0.5rem' });

    expect(
      progress.style.getPropertyValue('--notable-progress-thickness'),
    ).toBe('0.5rem');
  });

  it('maps color token names to the indicator color tokens', () => {
    const progress = renderProgress({ color: 'success' });

    expect(progress.style.getPropertyValue('--notable-progress-color')).toBe(
      'var(--notable-color-success)',
    );
  });

  it('passes a custom indicator color through as CSS', () => {
    const progress = renderProgress({ color: '#0ea5e9' });

    expect(progress.style.getPropertyValue('--notable-progress-color')).toBe(
      '#0ea5e9',
    );
  });

  it('maps track color token names to the border tokens', () => {
    const progress = renderProgress({ trackColor: 'strong' });

    expect(
      progress.style.getPropertyValue('--notable-progress-track-color'),
    ).toBe('var(--notable-color-border-strong)');
  });

  it('maps radius token names to radius tokens', () => {
    const progress = renderProgress({ radius: 'lg' });

    expect(progress.style.borderRadius).toBe('var(--notable-radius-lg)');
  });

  it('treats a numeric radius as pixels and passes other radius values through', () => {
    expect(renderProgress({ radius: 4 }).style.borderRadius).toBe('4px');
    expect(renderProgress({ radius: '2px 6px' }).style.borderRadius).toBe(
      '2px 6px',
    );
  });

  it('uses the smooth animation class by default', () => {
    const progress = renderProgress({ value: 30 });

    expect(progress).toHaveClass('notable-progress--smooth');
    expect(progress).not.toHaveClass('notable-progress--none');
  });

  it('applies the none animation class when animation is disabled', () => {
    const determinate = renderProgress({ value: 30, animation: 'none' });
    const indeterminate = renderProgress({ animation: 'none' });

    expect(determinate).toHaveClass('notable-progress--none');
    expect(determinate).not.toHaveClass('notable-progress--smooth');
    expect(indeterminate).toHaveClass(
      'notable-progress--none',
      'notable-progress--indeterminate',
    );
  });

  it('merges custom class names and inline styles with generated ones', () => {
    const progress = renderProgress({
      className: 'upload-progress',
      style: { marginBlockStart: '8px' },
      value: 10,
    });

    expect(progress).toHaveClass('notable-progress', 'upload-progress');
    expect(progress.style.marginBlockStart).toBe('8px');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '10%',
    );
  });

  it('forwards supported HTML attributes and accessible names', () => {
    const { container } = render(
      <div>
        <span id="upload-label">Uploading report</span>
        <Progress
          aria-labelledby="upload-label"
          id="report-progress"
          title="Report upload"
          value={70}
        />
      </div>,
    );

    const progress = screen.getByRole('progressbar', {
      name: 'Uploading report',
    });
    expect(progress).toHaveAttribute('id', 'report-progress');
    expect(progress).toHaveAttribute('title', 'Report upload');
    expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(1);
  });

  it('exposes the component through the package entry point', () => {
    expect(PublicProgress).toBe(Progress);
  });
});

function getArc(progress: HTMLElement): SVGElement {
  const arc = progress.querySelector('.notable-progress__arc');

  if (!(arc instanceof SVGElement)) {
    throw new Error('Expected circular Progress to render an arc');
  }

  return arc;
}

describe('Progress circular variant', () => {
  it('renders a decorative SVG ring with a track and an arc', () => {
    const progress = renderProgress({ variant: 'circular', value: 40 });
    const svg = progress.querySelector('svg');

    expect(progress).toHaveClass('notable-progress--circular');
    expect(progress.children).toHaveLength(1);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg?.querySelector('.notable-progress__track')).not.toBeNull();
    expect(svg?.querySelector('.notable-progress__arc')).not.toBeNull();
    expect(progress).not.toHaveAttribute('tabindex');
  });

  it('does not render the SVG ring for the linear variant', () => {
    const progress = renderProgress({ value: 40 });

    expect(progress.querySelector('svg')).toBeNull();
    expect(getIndicator(progress)).toHaveClass('notable-progress__indicator');
  });

  it.each([
    { value: 0, offset: '100' },
    { value: 25, offset: '75' },
    { value: 50, offset: '50' },
    { value: 100, offset: '0' },
  ])(
    'offsets the arc by the remaining share for value $value',
    ({ value, offset }) => {
      const progress = renderProgress({ variant: 'circular', value });

      expect(getArc(progress).getAttribute('style')).toContain(
        `stroke-dashoffset: ${offset}`,
      );
    },
  );

  it.each([
    { value: -10, offset: '100' },
    { value: 150, offset: '0' },
  ])('clamps the ring for out-of-range value $value', ({ value, offset }) => {
    const progress = renderProgress({ variant: 'circular', value });

    expect(progress).toHaveAttribute(
      'aria-valuenow',
      String(value < 0 ? 0 : 100),
    );
    expect(getArc(progress).getAttribute('style')).toContain(
      `stroke-dashoffset: ${offset}`,
    );
  });

  it('measures the ring against a custom maximum', () => {
    const progress = renderProgress({
      variant: 'circular',
      max: 4,
      value: 3,
    });

    expect(progress).toHaveAttribute('aria-valuemax', '4');
    expect(progress).toHaveAttribute('aria-valuenow', '3');
    expect(getArc(progress).getAttribute('style')).toContain(
      'stroke-dashoffset: 25',
    );
  });

  it('renders an indeterminate ring without a completion value', () => {
    const progress = renderProgress({ variant: 'circular' });
    const arc = getArc(progress);

    expect(progress).toHaveClass('notable-progress--indeterminate');
    expect(progress).toHaveAttribute('role', 'progressbar');
    expect(progress).not.toHaveAttribute('aria-valuenow');
    expect(progress.style.getPropertyValue('--notable-progress-value')).toBe(
      '',
    );
    expect(arc.getAttribute('style')).toBeNull();
  });

  it.each([{ max: 0 }, { max: Number.NaN }, { max: Number.POSITIVE_INFINITY }])(
    'falls back to 100 for the invalid maximum $max on the ring',
    ({ max }) => {
      const progress = renderProgress({ variant: 'circular', value: 50, max });

      expect(progress).toHaveAttribute('aria-valuemax', '100');
      expect(getArc(progress).getAttribute('style')).toContain(
        'stroke-dashoffset: 50',
      );
    },
  );

  it.each<ProgressSize>(['small', 'medium', 'large'])(
    'applies the %s size class to the ring',
    (size) => {
      const progress = renderProgress({ variant: 'circular', size });

      expect(progress).toHaveClass(`notable-progress--${size}`);
      expect(
        progress.style.getPropertyValue('--notable-progress-diameter'),
      ).toBe('');
    },
  );

  it('applies a numeric size as the ring diameter in pixels', () => {
    const progress = renderProgress({ variant: 'circular', size: 64 });

    expect(progress).not.toHaveClass('notable-progress--medium');
    expect(progress.style.getPropertyValue('--notable-progress-diameter')).toBe(
      '64px',
    );
  });

  it('passes a string size through as the ring diameter', () => {
    const progress = renderProgress({ variant: 'circular', size: '4rem' });

    expect(progress.style.getPropertyValue('--notable-progress-diameter')).toBe(
      '4rem',
    );
  });

  it('applies a numeric thickness as the ring stroke width in pixels', () => {
    const progress = renderProgress({ variant: 'circular', thickness: 8 });

    expect(
      progress.style.getPropertyValue('--notable-progress-thickness'),
    ).toBe('8px');
  });

  it('maps color and track color to the ring', () => {
    const progress = renderProgress({
      variant: 'circular',
      color: 'danger',
      trackColor: 'strong',
    });

    expect(progress.style.getPropertyValue('--notable-progress-color')).toBe(
      'var(--notable-color-danger)',
    );
    expect(
      progress.style.getPropertyValue('--notable-progress-track-color'),
    ).toBe('var(--notable-color-border-strong)');
  });

  it('applies the none animation class to the ring', () => {
    const progress = renderProgress({
      variant: 'circular',
      animation: 'none',
      value: 40,
    });

    expect(progress).toHaveClass('notable-progress--none');
    expect(progress).not.toHaveClass('notable-progress--smooth');
  });

  it('keeps progress semantics identical when switching variants', () => {
    const { container, rerender } = render(
      <Progress aria-label="Upload" value={35} max={50} />,
    );
    const linear = container.firstElementChild;

    rerender(
      <Progress aria-label="Upload" value={35} max={50} variant="circular" />,
    );
    const circular = container.firstElementChild;

    expect(linear).toHaveAttribute('role', 'progressbar');
    expect(circular).toHaveAttribute('role', 'progressbar');
    expect(circular).toHaveAttribute('aria-label', 'Upload');
    expect(circular).toHaveAttribute('aria-valuemin', '0');
    expect(circular).toHaveAttribute('aria-valuemax', '50');
    expect(circular).toHaveAttribute('aria-valuenow', '35');
    expect(linear).toHaveAttribute('aria-valuenow', '35');
  });

  it.each(['linear', 'circular'] as const)(
    'exposes an accessible name through aria-labelledby for the %s variant',
    (variant) => {
      render(
        <>
          <span id="upload-label">Uploading report</span>
          <Progress
            aria-labelledby="upload-label"
            variant={variant}
            value={20}
          />
        </>,
      );

      expect(
        screen.getByRole('progressbar', { name: 'Uploading report' }),
      ).toHaveAttribute('aria-valuenow', '20');
    },
  );
});
