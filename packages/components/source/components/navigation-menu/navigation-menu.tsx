import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
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
 * panel. Each group has its own highlight, so links only move the highlight
 * within their group.
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

type NavigationMenuHighlightContextValue = {
  highlightedValue: string | null;
  setHoveredValue: (value: string | null) => void;
  setFocusedValue: (value: string | null) => void;
};

const NavigationMenuHighlightContext =
  createContext<NavigationMenuHighlightContextValue | null>(null);

const NavigationMenuItemContext = createContext(false);

type NavigationMenuGroupContextValue = {
  highlightedKey: string | null;
  setHoveredKey: (key: string | null) => void;
  setFocusedKey: (key: string | null) => void;
};

const NavigationMenuGroupContext =
  createContext<NavigationMenuGroupContextValue | null>(null);

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
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);
    const [focusedValue, setFocusedValue] = useState<string | null>(null);
    const openValue = value !== undefined ? value : uncontrolledValue;
    // The pointer and keyboard focus take precedence, and the open item keeps
    // the highlight once both have moved away.
    const highlightedValue = hoveredValue ?? focusedValue ?? openValue;

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
        <AnimatedHighlight className="notable-navigation-menu__highlight" />
        <NavigationMenuHighlightContext.Provider
          value={{ highlightedValue, setHoveredValue, setFocusedValue }}
        >
          {children}
        </NavigationMenuHighlightContext.Provider>
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
  function NavigationMenuItem(
    {
      value,
      className,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const generatedValue = useId();
    const itemValue = value ?? generatedValue;
    const highlight = useContext(NavigationMenuHighlightContext);

    return (
      <NavigationMenuItemContext.Provider
        value={highlight?.highlightedValue === itemValue}
      >
        <BaseNavigationMenu.Item
          {...props}
          ref={ref}
          value={itemValue}
          className={joinClasses('notable-navigation-menu__item', className)}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            highlight?.setHoveredValue(itemValue);
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            highlight?.setHoveredValue(null);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            highlight?.setFocusedValue(itemValue);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            highlight?.setFocusedValue(null);
          }}
        />
      </NavigationMenuItemContext.Provider>
    );
  },
);

const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  const isHighlighted = useContext(NavigationMenuItemContext);

  return (
    <BaseNavigationMenu.Trigger
      {...props}
      ref={ref}
      data-highlighted={isHighlighted && !props.disabled ? '' : undefined}
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
      {/* The panel lives in a portal, so its links must not inherit the item highlight. */}
      <NavigationMenuItemContext.Provider value={false}>
        {children}
      </NavigationMenuItemContext.Provider>
    </BaseNavigationMenu.Content>
  );
});

const NavigationMenuGroup = forwardRef<
  HTMLDivElement,
  NavigationMenuGroupProps
>(function NavigationMenuGroup({ className, children, ...props }, ref) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const highlightedKey = hoveredKey ?? focusedKey;

  return (
    <div
      {...props}
      ref={ref}
      role="group"
      className={joinClasses('notable-navigation-menu__group', className)}
    >
      <AnimatedHighlight className="notable-navigation-menu__highlight" />
      <NavigationMenuGroupContext.Provider
        value={{ highlightedKey, setHoveredKey, setFocusedKey }}
      >
        {children}
      </NavigationMenuGroupContext.Provider>
    </div>
  );
});

const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(function NavigationMenuLink(
  {
    active,
    closeOnClick,
    className,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const itemHighlighted = useContext(NavigationMenuItemContext);
  const group = useContext(NavigationMenuGroupContext);
  const highlightKey = useId();
  const isHighlighted = group
    ? group.highlightedKey === highlightKey
    : itemHighlighted;

  return (
    <BaseNavigationMenu.Link
      {...props}
      ref={ref}
      data-highlighted={isHighlighted ? '' : undefined}
      active={active}
      closeOnClick={closeOnClick}
      className={joinClasses('notable-navigation-menu__link', className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        group?.setHoveredKey(highlightKey);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        group?.setHoveredKey(null);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        group?.setFocusedKey(highlightKey);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        group?.setFocusedKey(null);
      }}
    />
  );
});

/**
 * Accessible site navigation built on Base UI. Compose `NavigationMenu.List`
 * and `NavigationMenu.Item`, then use `NavigationMenu.Link` for direct
 * navigation or `NavigationMenu.Trigger` with `NavigationMenu.Content` for a
 * dropdown panel. The root renders the shared panel popup, so consumers only
 * supply item content.
 */
export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Group: NavigationMenuGroup,
  Link: NavigationMenuLink,
});
