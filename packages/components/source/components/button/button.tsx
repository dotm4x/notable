import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import { SPRING_INTERACTIVE } from '../../styles/motion.js';
import './button.css';

/** Visual appearance of the button. */
export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/** Available button sizes, including icon-only sizes. */
export type ButtonSize =
  'small' | 'medium' | 'large' | 'icon' | 'icon-small' | 'icon-large';

/** Props for {@link Button}, including Motion props. */
export type ButtonProps = Omit<
  HTMLMotionProps<'button'>,
  'disabled' | 'children'
> & {
  /** Button content. Icon-only buttons need an accessible name. */
  children?: ReactNode;
  /** Visual appearance. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Button size. Defaults to `medium`. */
  size?: ButtonSize;
  /** Disables the button and its interaction animations. Defaults to `false`. */
  disabled?: boolean;
};

/**
 * Renders a native button with optional hover and press animations. Respects
 * reduced-motion preferences and defaults `type` to `button`.
 */
export function Button({
  variant = 'primary',
  size = 'medium',
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
  const isMotionDisabled = disabled || shouldReduceMotion;

  const classes = [
    'notable-button',
    `notable-button--${variant}`,
    `notable-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      {...props}
      type={type}
      disabled={disabled}
      className={classes}
      whileHover={
        isMotionDisabled ? undefined : (whileHover ?? { scale: 1.03 })
      }
      whileTap={isMotionDisabled ? undefined : (whileTap ?? { scale: 0.97 })}
      transition={transition ?? SPRING_INTERACTIVE}
    >
      <span className="notable-button__content">{children}</span>
    </motion.button>
  );
}
