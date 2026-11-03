import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { motion, useReducedMotion } from 'motion/react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { SPRING_INTERACTIVE } from '../../styles/motion.js';
import './toggle.css';

/** Visual appearance of a toggle. */
export type TToggleVariant = 'default' | 'outline';

/** Available toggle sizes. */
export type TToggleSize = 'small' | 'medium' | 'large';

/** Props for an independent two-state toggle button. */
export type TToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-pressed' | 'value'
> & {
  /** Content of the toggle. Icon-only toggles need an accessible name. */
  children?: ReactNode;
  /** Unique string value when the toggle is used within a toggle group. */
  value?: string;
  /** Whether the toggle is pressed in controlled mode. */
  pressed?: boolean;
  /** Initial pressed state in uncontrolled mode. Defaults to `false`. */
  defaultPressed?: boolean;
  /** Called when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  /** Visual appearance. Defaults to `default`. */
  variant?: TToggleVariant;
  /** Visual size. Defaults to `medium`. */
  size?: TToggleSize;
};

/** Renders an independently controlled two-state button. */
export const Toggle = forwardRef<HTMLButtonElement, TToggleProps>(
  function Toggle(
    {
      className,
      defaultPressed,
      disabled,
      onPressedChange,
      pressed,
      size = 'medium',
      type = 'button',
      variant = 'default',
      ...props
    },
    ref,
  ) {
    const shouldReduceMotion = useReducedMotion();
    const isMotionDisabled = disabled || shouldReduceMotion;

    return (
      <BaseToggle
        {...props}
        ref={ref}
        render={
          <motion.button
            whileTap={isMotionDisabled ? undefined : { scale: 0.97 }}
            transition={SPRING_INTERACTIVE}
          />
        }
        type={type}
        disabled={disabled}
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={(nextPressed) => onPressedChange?.(nextPressed)}
        className={[
          'one-toggle',
          `one-toggle--${variant}`,
          `one-toggle--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    );
  },
);
