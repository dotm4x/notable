import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import './button.css';

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type ButtonSize =
  'small' | 'medium' | 'large' | 'icon' | 'icon-small' | 'icon-large';

export type ButtonProps = Omit<
  HTMLMotionProps<'button'>,
  'disabled' | 'children'
> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};

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
    'bodypop-button',
    `bodypop-button--${variant}`,
    `bodypop-button--${size}`,
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
      transition={
        transition ?? {
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }
      }
    >
      <span className="bodypop-button__content">{children}</span>
    </motion.button>
  );
}
