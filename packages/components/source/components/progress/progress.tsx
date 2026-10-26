import type { CSSProperties, HTMLAttributes } from 'react';
import './progress.css';

/** Track thickness preset. */
export type ProgressSize = 'small' | 'medium' | 'large';

/** Notable indicator color token names. */
export type ProgressColor = 'primary' | 'success' | 'danger';

/** Notable track color token names. */
export type ProgressTrackColor = 'subtle' | 'default' | 'strong';

/** Notable radius token names. */
export type ProgressRadiusToken =
  'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * `smooth` animates determinate changes and indeterminate movement. `none`
 * disables both.
 */
export type ProgressAnimation = 'smooth' | 'none';

/** Props for {@link Progress}, in addition to native `div` attributes. */
export type ProgressProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  | 'children'
  | 'role'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext'
> & {
  /** Additional CSS class for the progress element. */
  className?: string;
  /**
   * Current progress. Omit it for indeterminate progress. Values are clamped
   * to `0` through `max`; `NaN` is treated as indeterminate.
   */
  value?: number;
  /**
   * Value that represents completion. Defaults to `100`. Zero, negative, and
   * non-finite values fall back to `100`.
   */
  max?: number;
  /** Track thickness preset. Defaults to `medium`. */
  size?: ProgressSize;
  /** Track thickness. A number is treated as pixels, and any other string is used as CSS. */
  thickness?: number | string;
  /**
   * Indicator color. A Notable token name maps to its color token, and any other
   * string is used as CSS as provided. Defaults to the primary color.
   */
  color?: ProgressColor | string;
  /**
   * Track color. A Notable token name maps to its border token, and any other
   * string is used as CSS as provided. Defaults to the standard border color.
   */
  trackColor?: ProgressTrackColor | string;
  /**
   * Track corner radius. A Notable radius token name maps to its token, a
   * number is treated as pixels, and any other string is used as CSS. Defaults
   * to a pill shape.
   */
  radius?: ProgressRadiusToken | number | string;
  /** Animation for changes and indeterminate movement. Defaults to `smooth`. */
  animation?: ProgressAnimation;
};

type CssCustomProperties = Record<`--${string}`, string>;

const DEFAULT_MAX = 100;

const colorTokens: Readonly<Record<ProgressColor, string>> = {
  primary: 'var(--notable-color-primary)',
  success: 'var(--notable-color-success)',
  danger: 'var(--notable-color-danger)',
};

const trackColorTokens: Readonly<Record<ProgressTrackColor, string>> = {
  subtle: 'var(--notable-color-border-subtle)',
  default: 'var(--notable-color-border)',
  strong: 'var(--notable-color-border-strong)',
};

const radiusTokens: ReadonlySet<string> = new Set([
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'full',
]);

function resolveMax(max: number | undefined): number {
  return max !== undefined && Number.isFinite(max) && max > 0
    ? max
    : DEFAULT_MAX;
}

function resolveValue(
  value: number | undefined,
  max: number,
): number | undefined {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return Math.min(Math.max(value, 0), max);
}

function resolveColor(color: ProgressProps['color']): string | undefined {
  if (color === undefined) {
    return undefined;
  }
  if (color === 'primary' || color === 'success' || color === 'danger') {
    return colorTokens[color];
  }
  return color;
}

function resolveTrackColor(
  trackColor: ProgressProps['trackColor'],
): string | undefined {
  if (trackColor === undefined) {
    return undefined;
  }
  if (
    trackColor === 'subtle' ||
    trackColor === 'default' ||
    trackColor === 'strong'
  ) {
    return trackColorTokens[trackColor];
  }
  return trackColor;
}

function resolveThickness(
  thickness: ProgressProps['thickness'],
): string | undefined {
  if (thickness === undefined) {
    return undefined;
  }
  return typeof thickness === 'number' ? `${thickness}px` : thickness;
}

function resolveRadius(radius: ProgressProps['radius']): string | undefined {
  if (radius === undefined) {
    return undefined;
  }
  if (typeof radius === 'number') {
    return `${radius}px`;
  }
  if (radiusTokens.has(radius)) {
    return `var(--notable-radius-${radius})`;
  }
  return radius;
}

/**
 * Renders a linear progress bar. Omit `value` for indeterminate progress, which
 * shows ongoing activity without exposing a completion value to assistive
 * technology. The bar stretches to its container's width.
 */
export function Progress({
  animation = 'smooth',
  className,
  color,
  max,
  radius,
  size = 'medium',
  style,
  thickness,
  trackColor,
  value,
  ...props
}: ProgressProps) {
  const effectiveMax = resolveMax(max);
  const effectiveValue = resolveValue(value, effectiveMax);
  const isIndeterminate = effectiveValue === undefined;

  const inlineStyle: CSSProperties & CssCustomProperties = { ...style };
  const resolvedRadius = resolveRadius(radius);
  if (resolvedRadius !== undefined) {
    inlineStyle.borderRadius = resolvedRadius;
  }
  const resolvedThickness = resolveThickness(thickness);
  if (resolvedThickness !== undefined) {
    inlineStyle['--notable-progress-thickness'] = resolvedThickness;
  }
  const resolvedColor = resolveColor(color);
  if (resolvedColor !== undefined) {
    inlineStyle['--notable-progress-color'] = resolvedColor;
  }
  const resolvedTrackColor = resolveTrackColor(trackColor);
  if (resolvedTrackColor !== undefined) {
    inlineStyle['--notable-progress-track-color'] = resolvedTrackColor;
  }
  if (effectiveValue !== undefined) {
    inlineStyle['--notable-progress-value'] =
      `${(effectiveValue / effectiveMax) * 100}%`;
  }

  const classes = [
    'notable-progress',
    `notable-progress--${size}`,
    `notable-progress--${animation}`,
    isIndeterminate && 'notable-progress--indeterminate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...props}
      className={classes}
      style={inlineStyle}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={effectiveMax}
      aria-valuenow={effectiveValue}
    >
      <div className="notable-progress__indicator" />
    </div>
  );
}
