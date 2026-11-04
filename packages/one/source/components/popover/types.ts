import type { HTMLAttributes, ReactNode } from 'react';
import type { ButtonProps } from '../button/button.js';

/** Side of the trigger where the popover is placed. */
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

/** Alignment of the popover along the chosen side. */
export type PopoverAlign = 'start' | 'center' | 'end';

/** Props for the {@link Popover} root component. */
export type PopoverProps = {
  /** Controlled open state. Omit to let the popover manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Popover parts, such as `Popover.Trigger` and `Popover.Content`. */
  children?: ReactNode;
};

/** Props for `Popover.Trigger`. */
export type PopoverTriggerProps = {
  /** A single element that toggles the popover. Other content is wrapped in a `Button`. */
  children: ReactNode;
};

/** Props for `Popover.Content`, which renders the non-modal popup. */
export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Side of the trigger where the popup appears. Defaults to `bottom`. */
  side?: PopoverSide;
  /** Alignment along the chosen side. Defaults to `center`. */
  align?: PopoverAlign;
  /** Distance in pixels between the trigger and the popup. Defaults to `8`. */
  sideOffset?: number;
  /** Distance in pixels to shift the popup along the aligned edge. Defaults to `0`. */
  alignOffset?: number;
};

/** Props for `Popover.Header`. */
export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Popover.Title`. */
export type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for `Popover.Description`. */
export type PopoverDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Props for `Popover.Close`. Always renders with `type="button"`. */
export type PopoverCloseProps = ButtonProps;
