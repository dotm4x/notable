import type { HTMLAttributes, ReactNode } from 'react';
import './badge.css';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type BadgeSize = 'small' | 'medium';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
};

export function Badge({
  children,
  className,
  size = 'medium',
  variant = 'default',
  ...props
}: BadgeProps) {
  const classes = [
    'bodypop-badge',
    `bodypop-badge--${variant}`,
    `bodypop-badge--${size}`,
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
