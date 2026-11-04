import {
  NavigationMenuContent,
  NavigationMenuGroup,
  NavigationMenuTrigger,
} from './parts/content.js';
import { NavigationMenuItem, NavigationMenuList } from './parts/list.js';
import { NavigationMenuLink } from './parts/link.js';
import { NavigationMenuRoot } from './parts/root.js';
import type { NavigationMenuProps } from './types.js';
import '../../internal/styles/floating-surface.css';
import './navigation-menu.css';

export type {
  NavigationMenuContentProps,
  NavigationMenuGroupProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
} from './types.js';

export interface NavigationMenuComponent extends React.ForwardRefExoticComponent<
  NavigationMenuProps & React.RefAttributes<HTMLElement>
> {
  /** Renders the list container for navigation items. */
  List: typeof NavigationMenuList;
  /** Renders an individual navigation menu item. */
  Item: typeof NavigationMenuItem;
  /** Renders the trigger button for a dropdown panel. */
  Trigger: typeof NavigationMenuTrigger;
  /** Renders the dropdown content panel. */
  Content: typeof NavigationMenuContent;
  /** Groups related navigation items. */
  Group: typeof NavigationMenuGroup;
  /** Renders a navigation link. */
  Link: typeof NavigationMenuLink;
}

/**
 * Accessible site navigation built on Base UI. Compose `NavigationMenu.List`
 * and `NavigationMenu.Item`, then use `NavigationMenu.Link` for direct
 * navigation or `NavigationMenu.Trigger` with `NavigationMenu.Content` for a
 * dropdown panel. The root renders the shared panel popup, so consumers only
 * supply item content.
 */
export const NavigationMenu: NavigationMenuComponent = Object.assign(
  NavigationMenuRoot,
  {
    List: NavigationMenuList,
    Item: NavigationMenuItem,
    Trigger: NavigationMenuTrigger,
    Content: NavigationMenuContent,
    Group: NavigationMenuGroup,
    Link: NavigationMenuLink,
  },
);
