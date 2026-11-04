import type { HTMLAttributes, ReactNode } from 'react';
import type { ButtonProps } from '../button/button.js';

/** Edge of the viewport that the drawer slides in from. */
export type DrawerSide = 'right' | 'left' | 'top' | 'bottom';

/**
 * Size of the drawer. Sets the width of `left` and `right` drawers and the
 * height of `top` and `bottom` drawers.
 */
export type DrawerSize = 'small' | 'medium' | 'large';

/** Props for the {@link Drawer} root component. */
export type DrawerProps = {
  /** Controlled open state. Omit to let the drawer manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the drawer opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Edge the drawer slides in from. Defaults to `right`. */
  side?: DrawerSide;
  /** Drawer parts, such as `Drawer.Trigger` and `Drawer.Content`. */
  children?: ReactNode;
};

/** Props for `Drawer.Trigger`. */
export type DrawerTriggerProps = {
  /** A single element that opens the drawer. Other content is wrapped in a `Button`. */
  children: ReactNode;
};

/** Props for `Drawer.Content`, which renders the drawer surface. */
export type DrawerContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Size of the drawer. Defaults to `medium`. */
  size?: DrawerSize;
  /** Shows a close button in the top-right corner. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Closes the drawer when the backdrop is clicked. Defaults to `true`. */
  closeOnBackdropClick?: boolean;
};

/** Props for `Drawer.Header`. */
export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Drawer.Title`. */
export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for `Drawer.Description`. */
export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Props for `Drawer.Footer`. */
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Drawer.Close`. Always renders with `type="button"`. */
export type DrawerCloseProps = ButtonProps;
