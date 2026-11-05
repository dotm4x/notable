import type { ReactNode } from 'react';
import type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from '../button/button.js';

export type TCopyButtonProps = Omit<
  ButtonProps,
  'children' | 'onClick' | 'size' | 'type' | 'variant'
> & {
  /** Text copied to the clipboard. */
  value: string;
  /** Visible and accessible label before copying. Defaults to `Copy`. */
  label?: string;
  /** Visible and accessible label after copying. Defaults to `Copied`. */
  copiedLabel?: string;
  /** How long the copied state is shown, in milliseconds. Defaults to 1600. */
  timeout?: number;
  /** Whether to render the text label beside the icon. Defaults to `true`. */
  showLabel?: boolean;
  /** Icon shown before copying. Defaults to the copy icon. */
  icon?: ReactNode;
  /** Icon shown after copying. Defaults to the check icon. */
  copiedIcon?: ReactNode;
  /** Called after a successful copy. */
  onCopy?: (value: string) => void;
  /** Called when copying fails. */
  onError?: (error: unknown) => void;
  /** Button size. Defaults to `small`. */
  size?: ButtonSize;
  /** Button variant. Defaults to `ghost`. */
  variant?: ButtonVariant;
  /** Native button type. Defaults to `button`. */
  type?: 'button' | 'submit' | 'reset';
};
