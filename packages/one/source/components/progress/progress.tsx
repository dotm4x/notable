import type { CSSProperties } from 'react';
import type { TCssCustomProperties } from '../../internal/helpers/css-custom-properties.js';
import { resolveRadius } from '../../internal/helpers/resolve-radius.js';
import {
  isProgressSize,
  resolveColor,
  resolveDiameter,
  resolveMax,
  resolveThickness,
  resolveTrackColor,
  resolveValue,
} from './helpers/resolve.js';
import { CircularIndicator } from './parts/circular-indicator.js';
import type { ProgressProps } from './types.js';
import './progress.css';

export type {
  ProgressAnimation,
  ProgressCircularProps,
  ProgressColor,
  ProgressLinearProps,
  ProgressProps,
  ProgressRadiusToken,
  ProgressSize,
  ProgressTrackColor,
  ProgressVariant,
} from './types.js';

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
    inlineStyle['--_progress-diameter'] = resolvedDiameter;
  }
  const resolvedThickness = resolveThickness(thickness);
  if (resolvedThickness !== undefined) {
    inlineStyle['--_progress-thickness'] = resolvedThickness;
  }
  const resolvedColor = resolveColor(color);
  if (resolvedColor !== undefined) {
    inlineStyle['--_progress-color'] = resolvedColor;
  }
  const resolvedTrackColor = resolveTrackColor(trackColor);
  if (resolvedTrackColor !== undefined) {
    inlineStyle['--_progress-track-color'] = resolvedTrackColor;
  }
  if (percentage !== undefined) {
    inlineStyle['--_progress-value'] = `${percentage}%`;
  }

  const classes = [
    'one-progress',
    isCircular ? 'one-progress--circular' : 'one-progress--linear',
    isProgressSize(size) && `one-progress--${size}`,
    `one-progress--${animation}`,
    isIndeterminate && 'one-progress--indeterminate',
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
        <div className="one-progress__indicator" />
      )}
    </div>
  );
}
