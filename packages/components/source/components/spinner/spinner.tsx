import { LoaderCircle } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import './spinner.css';

export type SpinnerSize = 'small' | 'medium' | 'large';

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  label?: string;
  size?: SpinnerSize;
};

export function Spinner({
  className,
  label = 'Loading',
  size = 'medium',
  'aria-label': ariaLabel,
  ...props
}: SpinnerProps) {
  const classes = ['bodypop-spinner', `bodypop-spinner--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      {...props}
      className={classes}
      role="status"
      aria-label={ariaLabel ?? label}
    >
      <LoaderCircle className="bodypop-spinner__icon" aria-hidden="true" />
    </span>
  );
}
