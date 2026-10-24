import { LoaderCircle } from 'lucide-react';
import './spinner.css';

export type SpinnerProps = {
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Spinner({
  className,
  label = 'Loading',
  size = 'md',
}: SpinnerProps) {
  const classes = ['bodypop-spinner', `bodypop-spinner--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} role="status" aria-label={label}>
      <LoaderCircle className="bodypop-spinner__icon" aria-hidden="true" />
    </span>
  );
}
