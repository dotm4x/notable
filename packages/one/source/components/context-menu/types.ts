import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Props for the {@link ContextMenu} root component. */
export type ContextMenuProps = {
  /** Controlled open state. Omit to let the menu manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** A `ContextMenu.Trigger` and a `ContextMenu.Content`. */
  children?: ReactNode;
};

/**
 * Props for `ContextMenu.Trigger`, the region that opens the menu on right
 * click or long press. It renders a `div` around its children.
 */
export type ContextMenuTriggerProps = ComponentPropsWithoutRef<'div'>;

/** Props for `ContextMenu.Content`, which renders the menu popup at the pointer. */
export type ContextMenuContentProps = ComponentPropsWithoutRef<'div'>;

/**
 * Props for `ContextMenu.Item`. Activating an item closes the menu. Use
 * `disabled` to keep an item visible but unavailable.
 */
export type ContextMenuItemProps = ComponentPropsWithoutRef<'div'> & {
  /** Disables the item. Disabled items are skipped by keyboard navigation. */
  disabled?: boolean;
};

/** Props for `ContextMenu.Group`. */
export type ContextMenuGroupProps = ComponentPropsWithoutRef<'div'>;

/**
 * Props for `ContextMenu.CheckboxItem`, a menu item that toggles a checked
 * state. Activating it keeps the menu open so several options can be toggled.
 */
export type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<'div'> & {
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
 * Props for `ContextMenu.RadioGroup`, which groups `ContextMenu.RadioItem`
 * parts so that exactly one of them is selected.
 */
export type ContextMenuRadioGroupProps = ComponentPropsWithoutRef<'div'> & {
  /** Controlled value of the selected radio item. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
};

/**
 * Props for `ContextMenu.RadioItem`. Selecting it keeps the menu open and
 * shows a dot. Its `value` identifies it within the enclosing radio group.
 */
export type ContextMenuRadioItemProps = ComponentPropsWithoutRef<'div'> & {
  /** Value this item represents within its `ContextMenu.RadioGroup`. */
  value: string;
  /** Disables the item. Disabled items are skipped by keyboard navigation. */
  disabled?: boolean;
};

/** Props for `ContextMenu.GroupLabel`. */
export type ContextMenuGroupLabelProps = ComponentPropsWithoutRef<'div'>;

/** Props for `ContextMenu.Separator`. */
export type ContextMenuSeparatorProps = ComponentPropsWithoutRef<'div'>;

/**
 * Props for `ContextMenu.Submenu`, a nested menu opened from a
 * `ContextMenu.SubmenuTrigger` inside the context menu.
 */
export type ContextMenuSubmenuProps = {
  /** Controlled open state of the submenu. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the submenu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** A `ContextMenu.SubmenuTrigger` and a `ContextMenu.Content`. */
  children?: ReactNode;
};

/**
 * Props for `ContextMenu.SubmenuTrigger`. It is styled as an item and shows
 * a chevron. Hovering or pressing Right Arrow opens the submenu.
 */
export type ContextMenuSubmenuTriggerProps = ComponentPropsWithoutRef<'div'> & {
  /** Disables the trigger so its submenu cannot be opened. */
  disabled?: boolean;
};
