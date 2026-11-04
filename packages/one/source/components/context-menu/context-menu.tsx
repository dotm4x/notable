import { forwardRef } from 'react';
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
import type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuGroupLabelProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuSubmenuProps,
  ContextMenuSubmenuTriggerProps,
  ContextMenuTriggerProps,
} from './types.js';

export type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuGroupLabelProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuSubmenuProps,
  ContextMenuSubmenuTriggerProps,
  ContextMenuTriggerProps,
} from './types.js';

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

const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger(props, ref) {
    return <MenuContextTrigger ref={ref} {...props} />;
  },
);

const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent(props, ref) {
    return <MenuContextPopup ref={ref} {...props} />;
  },
);

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

export interface ContextMenuComponent extends React.FC<ContextMenuProps> {
  Root: typeof ContextMenuRoot;
  /** Renders the trigger region that opens the menu on right click or long press. */
  Trigger: typeof ContextMenuTrigger;
  /** Renders the popup container for menu items. */
  Content: typeof ContextMenuContent;
  /** Renders a selectable menu action item. */
  Item: typeof ContextMenuItem;
  /** Renders a menu item that toggles a checked state. */
  CheckboxItem: typeof ContextMenuCheckboxItem;
  /** Groups radio items so that exactly one is selected. */
  RadioGroup: typeof ContextMenuRadioGroup;
  /** Renders a menu item within a radio group. */
  RadioItem: typeof ContextMenuRadioItem;
  /** Groups related menu items. */
  Group: typeof ContextMenuGroup;
  /** Renders the label of a menu group. */
  GroupLabel: typeof ContextMenuGroupLabel;
  /** Renders a line separator between menu items or groups. */
  Separator: typeof ContextMenuSeparator;
  /** Renders a nested submenu. */
  Submenu: typeof ContextMenuSubmenu;
  /** Renders the trigger for a nested submenu. */
  SubmenuTrigger: typeof ContextMenuSubmenuTrigger;
}

/**
 * Action menu opened by right clicking or long pressing its trigger region.
 * Compose it with `ContextMenu.Trigger`, `ContextMenu.Content`, and
 * `ContextMenu.Item`, plus the optional group, label, separator, checkbox,
 * radio, and submenu parts. The menu opens at the pointer, and submenus open
 * beside their trigger. Forwards refs to the DOM element each part renders.
 */
export const ContextMenu: ContextMenuComponent = Object.assign(
  ContextMenuRoot,
  {
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
  },
);
