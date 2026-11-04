import type { HTMLAttributes } from 'react';
import type { OneRadiusToken } from '../../internal/helpers/resolve-radius.js';

/** Track thickness preset. */
export type ProgressSize = 'small' | 'medium' | 'large';

/** One indicator color token names. */
export type ProgressColor = 'primary' | 'success' | 'danger';

/** One track color token names. */
export type ProgressTrackColor = 'subtle' | 'default' | 'strong';

/** One radius token names. */
export type ProgressRadiusToken = OneRadiusToken;

/**
 * `smooth` animates determinate changes and indeterminate movement. `none`
 * disables both.
 */
export type ProgressAnimation = 'smooth' | 'none';

/** Visual shape of the progress indicator. */
export type ProgressVariant = 'linear' | 'circular';

/** Props shared by every {@link ProgressVariant}, in addition to native `div` attributes. */
type TProgressBaseProps = Omit<
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
   * Indicator color. A One token name maps to its color token, and any other
   * string is used as CSS as provided. Defaults to the primary color.
   */
  color?: ProgressColor | string;
  /**
   * Track color. A One token name maps to its border token, and any other
   * string is used as CSS as provided. Defaults to the standard border color.
   */
  trackColor?: ProgressTrackColor | string;
  /** Animation for changes and indeterminate movement. Defaults to `smooth`. */
  animation?: ProgressAnimation;
};

/** Props for a linear {@link Progress}, the default variant. */
export type ProgressLinearProps = TProgressBaseProps & {
  /** Visual shape. Defaults to `linear`. */
  variant?: 'linear';
  /** Track thickness preset. Defaults to `medium`. */
  size?: ProgressSize;
  /**
   * Track corner radius. A One radius token name maps to its token, a
   * number is treated as pixels, and any other string is used as CSS. Defaults
   * to a pill shape.
   */
  radius?: ProgressRadiusToken | number | string;
};

/** Props for a circular {@link Progress}. */
export type ProgressCircularProps = TProgressBaseProps & {
  /** Visual shape. */
  variant: 'circular';
  /**
   * Ring diameter. A preset maps to a One spacing size, a number is treated
   * as pixels, and any other string is used as CSS. Defaults to `medium`.
   */
  size?: ProgressSize | number | string;
  /** Not applicable to circular progress, which always renders a round ring. */
  radius?: never;
};

/** Props for {@link Progress}, in addition to native `div` attributes. */
export type ProgressProps = ProgressLinearProps | ProgressCircularProps;
