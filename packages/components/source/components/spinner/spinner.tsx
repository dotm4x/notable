import { LoaderCircle } from '@one/icons';
import type { HTMLAttributes } from 'react';
import './spinner.css';

/** Available loading indicator sizes. */
export type SpinnerSize = 'small' | 'medium' | 'large';

/** Props for {@link Spinner}, in addition to native `span` attributes. */
export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  /** Additional CSS class for the status element. */
  className?: string;
  /** Accessible status name. Defaults to `Loading`; `aria-label` takes precedence. */
  label?: string;
  /** Indicator size. Defaults to `medium`. */
  size?: SpinnerSize;
};

/** Renders a decorative loading icon inside an accessible status element. */
export function Spinner({
  className,
  label = 'Loading',
  size = 'medium',
  'aria-label': ariaLabel,
  ...props
}: SpinnerProps) {
  const classes = ['one-spinner', `one-spinner--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      {...props}
      className={classes}
      role="status"
      aria-label={ariaLabel ?? label}
    >
      <LoaderCircle className="one-spinner__icon" aria-hidden="true" />
    </span>
  );
}
