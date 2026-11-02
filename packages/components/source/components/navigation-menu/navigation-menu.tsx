import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import {
  forwardRef,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronDown } from '@notable/icons';
import '../../internal/styles/floating-surface.css';
import './navigation-menu.css';

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

function joinClasses(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const NavigationMenuRoot = forwardRef<HTMLElement, NavigationMenuProps>(
  function NavigationMenuRoot(
    {
      value,
      defaultValue,
      onValueChange,
      delay,
      closeDelay,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? null,
    );
    const openValue = value !== undefined ? value : uncontrolledValue;

    return (
      <BaseNavigationMenu.Root
        {...props}
        ref={ref}
        value={openValue}
        onValueChange={(nextValue) => {
          if (value === undefined) {
            setUncontrolledValue(nextValue);
          }
          onValueChange?.(nextValue);
        }}
        delay={delay}
        closeDelay={closeDelay}
        className={joinClasses('notable-navigation-menu', className)}
      >
        {children}
        <BaseNavigationMenu.Portal>
          <BaseNavigationMenu.Positioner
            className="notable-navigation-menu__positioner"
            sideOffset={8}
            align="start"
          >
            <BaseNavigationMenu.Popup
              render={<div />}
              className="notable-floating-surface notable-navigation-menu__popup"
            >
              <BaseNavigationMenu.Viewport className="notable-navigation-menu__viewport" />
            </BaseNavigationMenu.Popup>
          </BaseNavigationMenu.Positioner>
        </BaseNavigationMenu.Portal>
      </BaseNavigationMenu.Root>
    );
  },
);

const NavigationMenuList = forwardRef<
  HTMLUListElement,
  NavigationMenuListProps
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <BaseNavigationMenu.List
      {...props}
      ref={ref}
      className={joinClasses('notable-navigation-menu__list', className)}
    />
  );
});

const NavigationMenuItem = forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  function NavigationMenuItem({ value, className, ...props }, ref) {
    const generatedValue = useId();
    const itemValue = value ?? generatedValue;

    return (
      <BaseNavigationMenu.Item
        {...props}
        ref={ref}
        value={itemValue}
        className={joinClasses('notable-navigation-menu__item', className)}
      />
    );
  },
);

const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <BaseNavigationMenu.Trigger
      {...props}
      ref={ref}
      className={joinClasses('notable-navigation-menu__trigger', className)}
    >
      {children}
      <ChevronDown
        className="notable-navigation-menu__trigger-icon"
        aria-hidden="true"
        focusable="false"
        size={16}
      />
    </BaseNavigationMenu.Trigger>
  );
});

const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(function NavigationMenuContent({ className, children, ...props }, ref) {
  return (
    <BaseNavigationMenu.Content
      {...props}
      ref={ref}
      className={joinClasses('notable-navigation-menu__content', className)}
    >
      {children}
    </BaseNavigationMenu.Content>
  );
});

const NavigationMenuGroup = forwardRef<
  HTMLDivElement,
  NavigationMenuGroupProps
>(function NavigationMenuGroup({ className, children, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      role="group"
      className={joinClasses('notable-navigation-menu__group', className)}
    >
      {children}
    </div>
  );
});

const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(function NavigationMenuLink(
  { active, closeOnClick, className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Link
      {...props}
      ref={ref}
      active={active}
      closeOnClick={closeOnClick}
      className={joinClasses('notable-navigation-menu__link', className)}
    />
  );
});

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
