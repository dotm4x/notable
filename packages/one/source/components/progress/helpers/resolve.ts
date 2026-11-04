import type {
  ProgressCircularProps,
  ProgressColor,
  ProgressProps,
  ProgressSize,
  ProgressTrackColor,
} from '../types.js';

const DEFAULT_MAX = 100;

const colorTokens: Readonly<Record<ProgressColor, string>> = {
  primary: 'var(--one-color-primary)',
  success: 'var(--one-color-success)',
  danger: 'var(--one-color-danger)',
};

const trackColorTokens: Readonly<Record<ProgressTrackColor, string>> = {
  subtle: 'var(--one-color-border-subtle)',
  default: 'var(--one-color-border)',
  strong: 'var(--one-color-border-strong)',
};

export function resolveMax(max: number | undefined): number {
  return max !== undefined && Number.isFinite(max) && max > 0
    ? max
    : DEFAULT_MAX;
}

export function resolveValue(
  value: number | undefined,
  max: number,
): number | undefined {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return Math.min(Math.max(value, 0), max);
}

export function resolveColor(
  color: ProgressProps['color'],
): string | undefined {
  if (color === undefined) {
    return undefined;
  }
  if (color === 'primary' || color === 'success' || color === 'danger') {
    return colorTokens[color];
  }
  return color;
}

export function resolveTrackColor(
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

export function resolveThickness(
  thickness: ProgressProps['thickness'],
): string | undefined {
  if (thickness === undefined) {
    return undefined;
  }
  return typeof thickness === 'number' ? `${thickness}px` : thickness;
}

export function isProgressSize(size: unknown): size is ProgressSize {
  return size === 'small' || size === 'medium' || size === 'large';
}

export function resolveDiameter(
  size: ProgressCircularProps['size'],
): string | undefined {
  if (size === undefined || isProgressSize(size)) {
    return undefined;
  }
  return typeof size === 'number' ? `${size}px` : size;
}
