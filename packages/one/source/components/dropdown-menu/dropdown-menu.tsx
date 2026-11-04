import { forwardRef, isValidElement } from 'react';
import { Button } from '../button/button.js';
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuTrigger,
} from '../../internal/primitives/menu/menu.js';
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupLabelProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubmenuProps,
  DropdownMenuSubmenuTriggerProps,
  DropdownMenuTriggerProps,
} from './types.js';

export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupLabelProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubmenuProps,
  DropdownMenuSubmenuTriggerProps,
  DropdownMenuTriggerProps,
} from './types.js';

function DropdownMenuRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  return (
    <MenuRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </MenuRoot>
  );
}

function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const trigger = isValidElement(children) ? (
    children
  ) : (
    <Button>{children}</Button>
  );

  return <MenuTrigger render={trigger} />;
}

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { side, align, sideOffset, alignOffset, className, children, ...props },
  ref,
) {
  return (
    <MenuPopup
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={className}
      {...props}
    >
      {children}
    </MenuPopup>
  );
});

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, ...props }, ref) {
    return <MenuItem ref={ref} className={className} {...props} />;
  },
);

const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup(props, ref) {
    return <MenuGroup ref={ref} {...props} />;
  },
);

const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem({ onCheckedChange, ...props }, ref) {
  return (
    <MenuCheckboxItem
      ref={ref}
      onCheckedChange={(checked) => onCheckedChange?.(checked)}
      {...props}
    />
  );
});

const DropdownMenuRadioGroup = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioGroupProps
>(function DropdownMenuRadioGroup({ onValueChange, ...props }, ref) {
  return (
    <MenuRadioGroup
      ref={ref}
      onValueChange={(value) => onValueChange?.(value)}
      {...props}
    />
  );
});

const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem({ className, ...props }, ref) {
  return <MenuRadioItem ref={ref} className={className} {...props} />;
});

const DropdownMenuGroupLabel = forwardRef<
  HTMLDivElement,
  DropdownMenuGroupLabelProps
>(function DropdownMenuGroupLabel(props, ref) {
  return <MenuGroupLabel ref={ref} {...props} />;
});

const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator(props, ref) {
  return <MenuSeparator ref={ref} {...props} />;
});

function DropdownMenuSubmenu({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuSubmenuProps) {
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

const DropdownMenuSubmenuTrigger = forwardRef<
  HTMLDivElement,
  DropdownMenuSubmenuTriggerProps
>(function DropdownMenuSubmenuTrigger(props, ref) {
  return <MenuSubmenuTrigger ref={ref} {...props} />;
});

export interface DropdownMenuComponent extends React.FC<DropdownMenuProps> {
  Root: typeof DropdownMenuRoot;
  /** Renders the trigger element that opens the dropdown menu. */
  Trigger: typeof DropdownMenuTrigger;
  /** Renders the menu popup container. */
  Content: typeof DropdownMenuContent;
  /** Renders a selectable menu item. */
  Item: typeof DropdownMenuItem;
  /** Renders a menu item that toggles a checked state. */
  CheckboxItem: typeof DropdownMenuCheckboxItem;
  /** Groups radio menu items so that exactly one is selected. */
  RadioGroup: typeof DropdownMenuRadioGroup;
  /** Renders a radio menu item within a radio group. */
  RadioItem: typeof DropdownMenuRadioItem;
  /** Groups related menu items. */
  Group: typeof DropdownMenuGroup;
  /** Renders the label of a menu group. */
  GroupLabel: typeof DropdownMenuGroupLabel;
  /** Renders a line separator between menu items or groups. */
  Separator: typeof DropdownMenuSeparator;
  /** Renders a nested submenu. */
  Submenu: typeof DropdownMenuSubmenu;
  /** Renders the trigger for a nested submenu. */
  SubmenuTrigger: typeof DropdownMenuSubmenuTrigger;
}

/**
 * Action menu opened from a trigger. Compose it with `DropdownMenu.Trigger`,
 * `DropdownMenu.Content`, `DropdownMenu.Item`, and the optional group,
 * label, and separator parts. Use `Shortcut` inside an item to show a key
 * combination. Nest a `DropdownMenu.Submenu` for a submenu. Submenus open to the
 * inline end by default and flip to the other side when there is no room.
 * Forwards refs to the DOM element each part renders.
 */
export const DropdownMenu: DropdownMenuComponent = Object.assign(
  DropdownMenuRoot,
  {
    Root: DropdownMenuRoot,
    Trigger: DropdownMenuTrigger,
    Content: DropdownMenuContent,
    Item: DropdownMenuItem,
    CheckboxItem: DropdownMenuCheckboxItem,
    RadioGroup: DropdownMenuRadioGroup,
    RadioItem: DropdownMenuRadioItem,
    Group: DropdownMenuGroup,
    GroupLabel: DropdownMenuGroupLabel,
    Separator: DropdownMenuSeparator,
    Submenu: DropdownMenuSubmenu,
    SubmenuTrigger: DropdownMenuSubmenuTrigger,
  },
);
