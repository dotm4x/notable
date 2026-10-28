import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import {
  MenuCheckboxItem,
  MenuContextPopup,
  MenuContextRoot,
  MenuContextTrigger,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
} from '../../internal/primitives/menu/menu.js';

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

function ContextMenuRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: ContextMenuProps) {
  return (
    <MenuContextRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </MenuContextRoot>
  );
}

/**
 * Region that opens the menu on right click or long press. Its children are
 * rendered as they are, so the region can wrap any content.
 */
const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger(props, ref) {
    return <MenuContextTrigger ref={ref} {...props} />;
  },
);

/**
 * Renders the menu popup at the pointer. Arrow keys, Home and End,
 * typeahead, Escape, and outside presses are handled by Base UI.
 */
const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent(props, ref) {
    return <MenuContextPopup ref={ref} {...props} />;
  },
);

/** A selectable action in the menu. */
const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem(props, ref) {
    return <MenuItem ref={ref} {...props} />;
  },
);

const ContextMenuGroup = forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  function ContextMenuGroup(props, ref) {
    return <MenuGroup ref={ref} {...props} />;
  },
);

/** A menu item that toggles a checked state. */
const ContextMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ContextMenuCheckboxItemProps
>(function ContextMenuCheckboxItem({ onCheckedChange, ...props }, ref) {
  return (
    <MenuCheckboxItem
      ref={ref}
      onCheckedChange={(checked) => onCheckedChange?.(checked)}
      {...props}
    />
  );
});

/** Groups radio items so that exactly one is selected. */
const ContextMenuRadioGroup = forwardRef<
  HTMLDivElement,
  ContextMenuRadioGroupProps
>(function ContextMenuRadioGroup({ onValueChange, ...props }, ref) {
  return (
    <MenuRadioGroup
      ref={ref}
      onValueChange={(value) => onValueChange?.(value)}
      {...props}
    />
  );
});

/** A menu item within a `ContextMenu.RadioGroup`. */
const ContextMenuRadioItem = forwardRef<
  HTMLDivElement,
  ContextMenuRadioItemProps
>(function ContextMenuRadioItem(props, ref) {
  return <MenuRadioItem ref={ref} {...props} />;
});

const ContextMenuGroupLabel = forwardRef<
  HTMLDivElement,
  ContextMenuGroupLabelProps
>(function ContextMenuGroupLabel(props, ref) {
  return <MenuGroupLabel ref={ref} {...props} />;
});

const ContextMenuSeparator = forwardRef<
  HTMLDivElement,
  ContextMenuSeparatorProps
>(function ContextMenuSeparator(props, ref) {
  return <MenuSeparator ref={ref} {...props} />;
});

function ContextMenuSubmenu({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: ContextMenuSubmenuProps) {
  return (
    <MenuSubmenuRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </MenuSubmenuRoot>
  );
}

const ContextMenuSubmenuTrigger = forwardRef<
  HTMLDivElement,
  ContextMenuSubmenuTriggerProps
>(function ContextMenuSubmenuTrigger(props, ref) {
  return <MenuSubmenuTrigger ref={ref} {...props} />;
});

/**
 * Action menu opened by right clicking or long pressing its trigger region.
 * Compose it with `ContextMenu.Trigger`, `ContextMenu.Content`, and
 * `ContextMenu.Item`, plus the optional group, label, separator, checkbox,
 * radio, and submenu parts. The menu opens at the pointer, and submenus open
 * beside their trigger. Forwards refs to the DOM element each part renders.
 */
export const ContextMenu = Object.assign(ContextMenuRoot, {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Separator: ContextMenuSeparator,
  Submenu: ContextMenuSubmenu,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
});
