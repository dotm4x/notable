import type { HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

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
  /** When true, renders the child element with button styles and interactions instead of a button element. */
  asChild?: boolean;
  [key: string]: unknown;
};
