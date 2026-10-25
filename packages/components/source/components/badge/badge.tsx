import type { HTMLAttributes, ReactNode } from 'react';
import './badge.css';

/** Visual appearance of the badge. */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/** Available badge sizes. */
export type BadgeSize = 'small' | 'medium';

/** Props for {@link Badge}, in addition to native `span` attributes. */
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** Text, icons, or other inline content. */
  children?: ReactNode;
  /** Visual appearance. Defaults to `default`. */
  variant?: BadgeVariant;
  /** Size. Defaults to `medium`. */
  size?: BadgeSize;
};

/** Renders a non-interactive inline label. */
export function Badge({
  children,
  className,
  size = 'medium',
  variant = 'default',
  ...props
}: BadgeProps) {
  const classes = [
    'notable-badge',
    `notable-badge--${variant}`,
    `notable-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span {...props} className={classes}>
      {children}
    </span>
  );
}
