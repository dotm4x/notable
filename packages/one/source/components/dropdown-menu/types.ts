import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  MenuAlign,
  MenuSide,
} from '../../internal/primitives/menu/menu.js';

/** Props for the {@link DropdownMenu} root component. */
export type DropdownMenuProps = {
  /** Controlled open state. Omit to let the menu manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Menu parts, such as `DropdownMenu.Trigger` and `DropdownMenu.Content`. */
  children?: ReactNode;
};

/** Props for `DropdownMenu.Trigger`. */
export type DropdownMenuTriggerProps = {
  /**
   * A single element that opens the menu. Its attributes and `onClick` are
   * preserved. Any other content is wrapped in a `Button`.
   */
  children: ReactNode;
};

/** Props for `DropdownMenu.Content`, which renders the menu popup. */
export type DropdownMenuContentProps = ComponentPropsWithoutRef<'div'> & {
  /** Side of the trigger where the menu appears. Defaults to `bottom`, or the inline end for submenus. */
  side?: MenuSide;
  /** Alignment along the chosen side. Defaults to `start`. */
  align?: MenuAlign;
  /** Distance in pixels between the trigger and the menu. Defaults to `4`. */
  sideOffset?: number;
  /** Distance in pixels to shift the menu along the aligned edge. */
  alignOffset?: number;
};

/**
 * Props for `DropdownMenu.Item`. Activating an item closes the menu. Use
 * `disabled` to keep an item visible but unavailable.
 */
export type DropdownMenuItemProps = ComponentPropsWithoutRef<'div'> & {
  /** Disables the item. Disabled items are skipped by keyboard navigation. */
  disabled?: boolean;
};

/** Props for `DropdownMenu.Group`. */
export type DropdownMenuGroupProps = ComponentPropsWithoutRef<'div'>;

/**
 * Props for `DropdownMenu.CheckboxItem`, a menu item that toggles a checked
 * state. It shows a check mark when on. Unlike `DropdownMenu.Item`, activating
 * it keeps the menu open so several options can be toggled in a row.
 */
export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<'div'> & {
  /** Controlled checked state. Omit to let the item manage its own state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Called with the new checked state when the item is activated. */
  onCheckedChange?: (checked: boolean) => void;
  /** Disables the item. Disabled items are skipped by keyboard navigation. */
  disabled?: boolean;
};

/**
 * Props for `DropdownMenu.RadioGroup`, which groups `DropdownMenu.RadioItem`
 * parts so that exactly one of them is selected.
 */
export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<'div'> & {
  /** Controlled value of the selected radio item. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
};

/**
 * Props for `DropdownMenu.RadioItem`. Selecting it keeps the menu open and
 * shows a dot. Its `value` identifies it within the enclosing radio group.
 */
export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<'div'> & {
  /** Value this item represents within its `DropdownMenu.RadioGroup`. */
  value: string;
  /** Disables the item. Disabled items are skipped by keyboard navigation. */
  disabled?: boolean;
};

/** Props for `DropdownMenu.GroupLabel`. */
export type DropdownMenuGroupLabelProps = ComponentPropsWithoutRef<'div'>;

/** Props for `DropdownMenu.Separator`. */
export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<'div'>;

/**
 * Props for `DropdownMenu.Submenu`, a nested menu opened from a
 * `DropdownMenu.SubmenuTrigger` inside another menu.
 */
export type DropdownMenuSubmenuProps = {
  /** Controlled open state of the submenu. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the submenu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** A `DropdownMenu.SubmenuTrigger` and a `DropdownMenu.Content`. */
  children?: ReactNode;
};

/**
 * Props for `DropdownMenu.SubmenuTrigger`. It is styled as an item and shows
 * a chevron. Hovering or pressing Right Arrow opens the submenu.
 */
export type DropdownMenuSubmenuTriggerProps =
  ComponentPropsWithoutRef<'div'> & {
    /** Disables the trigger so its submenu cannot be opened. */
    disabled?: boolean;
  };
