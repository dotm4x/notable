import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';
import type { ButtonProps } from '../button/button.js';

/** Props for `Sidebar.Root`, including layout and expansion controls. */
export type TSidebarRootProps = HTMLAttributes<HTMLDivElement> & {
  /** Current desktop expansion state. Mobile drawer visibility stays internal. */
  open?: boolean;
  /** Initial expanded state when uncontrolled. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Called whenever desktop expansion is requested to change. */
  onOpenChange?: (open: boolean) => void;
  /** Expanded desktop width. Defaults to `16rem`. */
  width?: number | string;
  /** Icon-only desktop width. Defaults to `3rem`. */
  collapsedWidth?: number | string;
  /** Mobile drawer width. Defaults to `18rem`. */
  mobileWidth?: number | string;
  /** Modifier shortcut key. `false` disables the shortcut; defaults to `b`. */
  keyboardShortcut?: string | false;
  /** Enables one shared sliding surface for menu and submenu hover. Defaults to `true`. */
  animateOnHover?: boolean;
  /** Accessible name of the sidebar navigation landmark. */
  label?: string;
  /** Sidebar sections and an optional direct `Sidebar.Inset` child. */
  children?: ReactNode;
};

/** Props for the sidebar's pinned header. */
export type TSidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Props for the sidebar's brand area. */
export type TSidebarBrandProps = HTMLAttributes<HTMLDivElement> & {
  /** Mark displayed beside the brand name, and alone when collapsed. */
  icon?: ReactNode;
  children?: ReactNode;
};

/** Props for the sidebar's scrollable content area. */
export type TSidebarContentProps = HTMLAttributes<HTMLDivElement>;

/** Props for a grouped set of sidebar navigation items. */
export type TSidebarGroupProps = HTMLAttributes<HTMLElement>;

/** Props for a group heading. */
export type TSidebarGroupLabelProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for an icon-only action beside a group heading. */
export type TSidebarGroupActionProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'aria-label'
> & {
  /** Accessible name describing the action. */
  'aria-label': string;
};

/** Props for the content region inside a group. */
export type TSidebarGroupContentProps = HTMLAttributes<HTMLDivElement>;

/** Props for a semantic list of sidebar items. */
export type TSidebarMenuProps = HTMLAttributes<HTMLUListElement>;

/** Props for an item in a sidebar menu. */
export type TSidebarMenuItemProps = HTMLAttributes<HTMLLIElement>;

export type TSidebarItemLabelProps =
  { children: string; label?: string } | { children: ReactNode; label: string };

/** Props for a navigational item. `href` renders an anchor; without it, a button is rendered. */
export type TSidebarItemProps = Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'onClick'
> & {
  /** Destination for a native anchor. Omit to render an action button. */
  href?: string;
  /** Optional Lucide icon or other mark displayed before the label. */
  icon?: ReactNode;
  /** Marks the current destination with `aria-current="page"`. */
  active?: boolean;
  /** Custom tooltip for icon-only mode; string labels are used by default. */
  tooltip?: string;
  /** Accessible label for non-text children and tooltip text in icon-only mode. */
  label?: string;
  /** Prevents activation. */
  disabled?: boolean;
  /** Link target when `href` is provided. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** Link relationship when `href` is provided. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  /** Button type when `href` is omitted. Defaults to `button`. */
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /** Called when the item is activated. */
  onClick?: MouseEventHandler<HTMLElement>;
} & TSidebarItemLabelProps;

/** Props for an icon-only action beside a menu item. */
export type TSidebarMenuActionProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'aria-label'
> & {
  /** Accessible name describing the action. */
  'aria-label': string;
};

/** Props for a count or status badge beside a menu item. */
export type TSidebarMenuBadgeProps = HTMLAttributes<HTMLSpanElement>;

/** Props for a collapsible nested navigation group. */
export type TSidebarSubmenuProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  /** Visible label and accessible name for the disclosure button. */
  label: string;
  /** Optional Lucide icon or other mark displayed before the label. */
  icon?: ReactNode;
  /** Current expanded state. Pass `onOpenChange` to control it. */
  open?: boolean;
  /** Initial expanded state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called whenever the nested navigation state is requested to change. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

/** Props for a nested navigation item. */
export type TSidebarSubmenuItemProps = TSidebarItemProps;

/** Props for the sidebar's pinned footer. */
export type TSidebarFooterProps = HTMLAttributes<HTMLDivElement>;

/** Props for the sidebar toggle button. */
export type TSidebarTriggerProps = {
  /** Accessible name override. The default describes the next state. */
  'aria-label'?: string;
  /** Called after the trigger is activated. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  title?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

/** Props for the narrow sidebar toggle rail. */
export type TSidebarRailProps = {
  /** Accessible name override. */
  'aria-label'?: string;
  /** Called after the rail is activated. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  id?: string;
  title?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

/** Props for the main content area adjacent to the sidebar. */
export type TSidebarInsetProps = HTMLAttributes<HTMLDivElement>;
