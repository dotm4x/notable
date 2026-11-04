import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';

/** Props for the {@link NavigationMenu} root, rendered as a `<nav>` landmark. */
export type NavigationMenuProps = Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue'
> & {
  /** Identifier of the open item when controlled. `null` closes every item. */
  value?: string | null;
  /** Initially open item when uncontrolled. Defaults to `null`. */
  defaultValue?: string | null;
  /** Called with the identifier of the item that opened or closed. */
  onValueChange?: (value: string | null) => void;
  /** Milliseconds before an item opens on hover. Defaults to `50`. */
  delay?: number;
  /** Milliseconds before a hovered item closes. Defaults to `50`. */
  closeDelay?: number;
  /** Navigation list, items, and links. */
  children?: ReactNode;
};

/** Props for `NavigationMenu.List`, a `<ul>` of items. */
export type NavigationMenuListProps = HTMLAttributes<HTMLUListElement>;

/** Props for `NavigationMenu.Item`, a `<li>` that holds a trigger or a link. */
export type NavigationMenuItemProps = HTMLAttributes<HTMLLIElement> & {
  /** Identifier used by `value` and `defaultValue`. Generated when omitted. */
  value?: string;
};

/** Props for `NavigationMenu.Trigger`, a button that opens its item's content. */
export type NavigationMenuTriggerProps =
  ButtonHTMLAttributes<HTMLButtonElement>;

/** Props for `NavigationMenu.Content`, the panel shown when its item is open. */
export type NavigationMenuContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * Props for `NavigationMenu.Group`, a column or section of links inside a
 * panel.
 */
export type NavigationMenuGroupProps = HTMLAttributes<HTMLDivElement>;

/** Props for `NavigationMenu.Link`, a native anchor for navigation. */
export type NavigationMenuLinkProps =
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Marks the link as the current page. Defaults to `false`. */
    active?: boolean;
    /** Closes any open dropdown when the link is activated. Defaults to `false`. */
    closeOnClick?: boolean;
  };
