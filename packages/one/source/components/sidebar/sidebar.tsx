import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  SidebarBrand,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from './parts/sections.js';
import {
  SidebarItem,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuItem,
} from './parts/menu.js';
import { SidebarRail, SidebarTrigger } from './parts/controls.js';
import { SidebarInsetElement, SidebarRoot } from './parts/root.js';
import { SidebarSubmenu, SidebarSubmenuItem } from './parts/submenu.js';
import type { TSidebarRootProps } from './types.js';
import './sidebar.css';

export type {
  TSidebarBrandProps,
  TSidebarContentProps,
  TSidebarFooterProps,
  TSidebarGroupActionProps,
  TSidebarGroupContentProps,
  TSidebarGroupLabelProps,
  TSidebarGroupProps,
  TSidebarHeaderProps,
  TSidebarInsetProps,
  TSidebarItemProps,
  TSidebarMenuActionProps,
  TSidebarMenuBadgeProps,
  TSidebarMenuItemProps,
  TSidebarMenuProps,
  TSidebarRailProps,
  TSidebarRootProps,
  TSidebarSubmenuItemProps,
  TSidebarSubmenuProps,
  TSidebarTriggerProps,
} from './types.js';

export interface SidebarComponent extends ForwardRefExoticComponent<
  TSidebarRootProps & RefAttributes<HTMLDivElement>
> {
  /** Renders the layout provider, sidebar landmark, and optional inset. */
  Root: typeof SidebarRoot;
  /** Pins brand or utility content above the scrollable navigation. */
  Header: typeof SidebarHeader;
  /** Displays a mark and brand name, hiding the name in icon-only mode. */
  Brand: typeof SidebarBrand;
  /** Provides the scrollable region for sidebar groups. */
  Content: typeof SidebarContent;
  /** Groups related navigation items and optional actions. */
  Group: typeof SidebarGroup;
  /** Renders a heading for a navigation group. */
  GroupLabel: typeof SidebarGroupLabel;
  /** Renders an icon-only action beside a group heading. */
  GroupAction: typeof SidebarGroupAction;
  /** Contains the navigation elements of a group. */
  GroupContent: typeof SidebarGroupContent;
  /** Renders a semantic list of sidebar entries. */
  Menu: typeof SidebarMenu;
  /** Renders a list item within `Sidebar.Menu`. */
  MenuItem: typeof SidebarMenuItem;
  /** Renders a link or action and supports active, collapsed, and tooltip states. */
  Item: typeof SidebarItem;
  /** Renders an icon-only action beside a menu item. */
  MenuAction: typeof SidebarMenuAction;
  /** Renders an optional badge beside a menu item. */
  MenuBadge: typeof SidebarMenuBadge;
  /** Renders a collapsible nested navigation group. */
  Submenu: typeof SidebarSubmenu;
  /** Renders a nested link or action. */
  SubmenuItem: typeof SidebarSubmenuItem;
  /** Pins utility or account content below the scrollable navigation. */
  Footer: typeof SidebarFooter;
  /** Toggles desktop expansion or opens and closes the mobile drawer. */
  Trigger: typeof SidebarTrigger;
  /** Renders a narrow toggle target at the sidebar's inner edge. */
  Rail: typeof SidebarRail;
  /** Renders page content beside the sidebar. */
  Inset: typeof SidebarInsetElement;
}

/**
 * Composable navigation layout. Use `Sidebar.Root` around sidebar sections and
 * place an optional `Sidebar.Inset` directly inside it as a sibling section.
 */
export const Sidebar: SidebarComponent = Object.assign(SidebarRoot, {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Brand: SidebarBrand,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  Item: SidebarItem,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  Submenu: SidebarSubmenu,
  SubmenuItem: SidebarSubmenuItem,
  Footer: SidebarFooter,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
  Inset: SidebarInsetElement,
});
