import type { CSSProperties, HTMLAttributes } from 'react';
import type { TCssCustomProperties } from '../../internal/helpers/css-custom-properties.js';
import {
  resolveRadius,
  type NotableRadiusToken,
} from '../../internal/helpers/resolve-radius.js';
import './progress.css';

/** Track thickness preset. */
export type ProgressSize = 'small' | 'medium' | 'large';

/** Notable indicator color token names. */
export type ProgressColor = 'primary' | 'success' | 'danger';

/** Notable track color token names. */
export type ProgressTrackColor = 'subtle' | 'default' | 'strong';

/** Notable radius token names. */
export type ProgressRadiusToken = NotableRadiusToken;

/**
 * `smooth` animates determinate changes and indeterminate movement. `none`
 * disables both.
 */
export type ProgressAnimation = 'smooth' | 'none';

/** Visual shape of the progress indicator. */
export type ProgressVariant = 'linear' | 'circular';

/** Props shared by every {@link ProgressVariant}, in addition to native `div` attributes. */
type ProgressBaseProps = Omit<
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
  /**
   * Track thickness. For linear progress this is the bar height; for circular
   * progress it is the ring's stroke width, capped at half the diameter. A
   * number is treated as pixels, and any other string is used as CSS.
   */
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
  /** Animation for changes and indeterminate movement. Defaults to `smooth`. */
  animation?: ProgressAnimation;
};

/** Props for a linear {@link Progress}, the default variant. */
export type ProgressLinearProps = ProgressBaseProps & {
  /** Visual shape. Defaults to `linear`. */
  variant?: 'linear';
  /** Track thickness preset. Defaults to `medium`. */
  size?: ProgressSize;
  /**
   * Track corner radius. A Notable radius token name maps to its token, a
   * number is treated as pixels, and any other string is used as CSS. Defaults
   * to a pill shape.
   */
  radius?: ProgressRadiusToken | number | string;
};

/** Props for a circular {@link Progress}. */
export type ProgressCircularProps = ProgressBaseProps & {
  /** Visual shape. */
  variant: 'circular';
  /**
   * Ring diameter. A preset maps to a Notable spacing size, a number is treated
   * as pixels, and any other string is used as CSS. Defaults to `medium`.
   */
  size?: ProgressSize | number | string;
  /** Not applicable to circular progress, which always renders a round ring. */
  radius?: never;
};

/** Props for {@link Progress}, in addition to native `div` attributes. */
export type ProgressProps = ProgressLinearProps | ProgressCircularProps;

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

function isProgressSize(size: unknown): size is ProgressSize {
  return size === 'small' || size === 'medium' || size === 'large';
}

function resolveDiameter(
  size: ProgressCircularProps['size'],
): string | undefined {
  if (size === undefined || isProgressSize(size)) {
    return undefined;
  }
  return typeof size === 'number' ? `${size}px` : size;
}

/**
 * Round ring drawn with SVG. Both circles share the same geometry, and the
 * stroke is kept inside the box so round caps are not clipped. The arc length
 * is expressed with `pathLength={100}`, so the offset is a percentage.
 */
function CircularIndicator({ percentage }: { percentage: number | undefined }) {
  const arcStyle: CSSProperties | undefined =
    percentage === undefined
      ? undefined
      : { strokeDashoffset: 100 - percentage };

  return (
    <svg className="notable-progress__svg" aria-hidden="true" focusable="false">
      <circle className="notable-progress__track" cx="50%" cy="50%" />
      <circle
        className="notable-progress__arc"
        cx="50%"
        cy="50%"
        pathLength={100}
        style={arcStyle}
      />
    </svg>
  );
}

/**
 * Renders a progress indicator as a linear bar (the default) or a circular
 * ring. Omit `value` for indeterminate progress, which shows ongoing activity
 * without exposing a completion value to assistive technology. Both variants
 * share the same progress semantics and ARIA attributes.
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
  variant = 'linear',
  ...props
}: ProgressProps) {
  const effectiveMax = resolveMax(max);
  const effectiveValue = resolveValue(value, effectiveMax);
  const isIndeterminate = effectiveValue === undefined;
  const isCircular = variant === 'circular';
  const percentage =
    effectiveValue === undefined
      ? undefined
      : (effectiveValue / effectiveMax) * 100;

  const inlineStyle: CSSProperties & TCssCustomProperties = { ...style };
  const resolvedRadius = isCircular ? undefined : resolveRadius(radius);
  if (resolvedRadius !== undefined) {
    inlineStyle.borderRadius = resolvedRadius;
  }
  const resolvedDiameter = isCircular ? resolveDiameter(size) : undefined;
  if (resolvedDiameter !== undefined) {
    inlineStyle['--notable-progress-diameter'] = resolvedDiameter;
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
  if (percentage !== undefined) {
    inlineStyle['--notable-progress-value'] = `${percentage}%`;
  }

  const classes = [
    'notable-progress',
    isCircular ? 'notable-progress--circular' : 'notable-progress--linear',
    isProgressSize(size) && `notable-progress--${size}`,
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
      {isCircular ? (
        <CircularIndicator percentage={percentage} />
      ) : (
        <div className="notable-progress__indicator" />
      )}
    </div>
  );
}
