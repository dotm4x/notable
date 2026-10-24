import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import { Spinner } from '../spinner/spinner.js';
import './button.css';

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<
  HTMLMotionProps<'button'>,
  'disabled' | 'children'
> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconOnly = false,
  disabled = false,
  className,
  children,
  whileHover,
  whileTap,
  transition,
  type = 'button',
  ...props
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = disabled || loading;
  const isMotionDisabled = isDisabled || shouldReduceMotion;

  const classes = [
    'bodypop-button',
    `bodypop-button--${variant}`,
    `bodypop-button--${size}`,
    iconOnly && 'bodypop-button--icon-only',
    loading && 'bodypop-button--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      whileHover={
        isMotionDisabled ? undefined : (whileHover ?? { scale: 1.03 })
      }
      whileTap={isMotionDisabled ? undefined : (whileTap ?? { scale: 0.97 })}
      transition={
        transition ?? {
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }
      }
    >
      {loading && <Spinner size="sm" />}
      <span className="bodypop-button__content">{children}</span>
    </motion.button>
  );
}
