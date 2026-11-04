import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { ChevronDown, PanelLeft } from '../../icons';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import { Button, type ButtonProps } from '../button/button.js';
import { Collapsible } from '../collapsible/collapsible.js';
import { Drawer } from '../drawer/drawer.js';
import { Tooltip } from '../tooltip/tooltip.js';
import type { TCssCustomProperties } from '../../internal/helpers/css-custom-properties.js';
import './sidebar.css';

const mobileQuery = '(max-width: 48rem)';
const highlightTargetSelector = [
  '.one-sidebar__item',
  '.one-sidebar__submenu-trigger',
  '.one-sidebar__group-action',
  '.one-sidebar__menu-action',
  '.one-sidebar__trigger',
].join(', ');

function findHighlightTarget(
  target: EventTarget | null,
  container: HTMLElement | null,
) {
  if (!(target instanceof Element) || !container) {
    return null;
  }

  const highlightTarget = target.closest<HTMLElement>(highlightTargetSelector);

  return highlightTarget &&
    container.contains(highlightTarget) &&
    !highlightTarget.matches(
      ':disabled, [aria-disabled="true"], [data-disabled]',
    )
    ? highlightTarget
    : null;
}

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

type TSidebarItemLabelProps =
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

type TSidebarContextValue = {
  open: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  sidebarId: string;
  setOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<TSidebarContextValue | null>(null);

function useSidebarContext(componentName: string) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Sidebar.Root.`);
  }

  return context;
}

function subscribeToMobile(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(mobileQuery);
  mediaQuery.addEventListener('change', callback);

  return () => mediaQuery.removeEventListener('change', callback);
}

function getIsMobile() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia(mobileQuery).matches
    : false;
}

function toCssLength(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}

function SidebarInsetElement({ className, ...props }: TSidebarInsetProps) {
  return (
    <div
      {...props}
      className={['one-sidebar__inset', className].filter(Boolean).join(' ')}
    />
  );
}

const SidebarRoot = forwardRef<HTMLDivElement, TSidebarRootProps>(
  function SidebarRoot(
    {
      open,
      defaultOpen = true,
      onOpenChange,
      width = '16rem',
      collapsedWidth = '3rem',
      mobileWidth = '18rem',
      keyboardShortcut = 'b',
      animateOnHover = true,
      label = 'Sidebar',
      className,
      style,
      children,
      ...props
    },
    ref,
  ) {
    const sidebarId = useId();
    const sidebarRef = useRef<HTMLElement | null>(null);
    const pointerTargetRef = useRef<HTMLElement | null>(null);
    const focusedTargetRef = useRef<HTMLElement | null>(null);
    const highlightedTargetRef = useRef<HTMLElement | null>(null);
    const highlightSourceRef = useRef<'pointer' | 'focus'>('pointer');
    const isMobile = useSyncExternalStore(
      subscribeToMobile,
      getIsMobile,
      () => false,
    );
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isOpen = open ?? uncontrolledOpen;

    const updateHighlight = useCallback(() => {
      const nextTarget =
        highlightSourceRef.current === 'pointer'
          ? (pointerTargetRef.current ?? focusedTargetRef.current)
          : (focusedTargetRef.current ?? pointerTargetRef.current);
      const previousTarget = highlightedTargetRef.current;

      if (previousTarget === nextTarget) {
        return;
      }

      previousTarget?.removeAttribute('data-highlighted');
      nextTarget?.setAttribute('data-highlighted', '');
      highlightedTargetRef.current = nextTarget;
    }, []);

    const handlePointerOver = (event: ReactPointerEvent<HTMLElement>) => {
      if (!animateOnHover) {
        pointerTargetRef.current = null;
        highlightSourceRef.current = 'pointer';
        updateHighlight();
        return;
      }

      pointerTargetRef.current =
        event.pointerType === 'touch'
          ? null
          : findHighlightTarget(event.target, sidebarRef.current);
      highlightSourceRef.current = 'pointer';
      updateHighlight();
    };

    const handlePointerLeave = () => {
      pointerTargetRef.current = null;
      highlightSourceRef.current = 'pointer';
      updateHighlight();
    };

    const handleFocusCapture = (event: ReactFocusEvent<HTMLElement>) => {
      focusedTargetRef.current = animateOnHover
        ? findHighlightTarget(event.target, sidebarRef.current)
        : null;
      highlightSourceRef.current = 'focus';
      updateHighlight();
    };

    const handleBlurCapture = (event: ReactFocusEvent<HTMLElement>) => {
      focusedTargetRef.current = animateOnHover
        ? findHighlightTarget(event.relatedTarget, sidebarRef.current)
        : null;
      highlightSourceRef.current = 'focus';
      updateHighlight();
    };

    useEffect(() => {
      if (animateOnHover) {
        return;
      }

      pointerTargetRef.current = null;
      focusedTargetRef.current = null;
      updateHighlight();
    }, [animateOnHover, updateHighlight]);

    const setOpen = useCallback(
      (nextOpen: boolean) => {
        if (open === undefined) {
          setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [onOpenChange, open],
    );

    const toggleSidebar = useCallback(() => {
      if (isMobile) {
        setMobileOpen((currentOpen) => !currentOpen);
      } else {
        setOpen(!isOpen);
      }
    }, [isMobile, isOpen, setOpen]);

    useEffect(() => {
      if (keyboardShortcut === false) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        const target = event.target;
        const isEditing =
          target instanceof HTMLElement &&
          (target.isContentEditable ||
            target.matches('input, textarea, select, [role="textbox"]'));

        if (
          !isEditing &&
          !event.repeat &&
          !event.shiftKey &&
          (event.metaKey || event.ctrlKey) &&
          !event.altKey &&
          event.key.toLowerCase() === keyboardShortcut.toLowerCase()
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [keyboardShortcut, toggleSidebar]);

    const context: TSidebarContextValue = {
      open: isOpen,
      isMobile,
      mobileOpen,
      sidebarId,
      setOpen,
      setMobileOpen,
      toggleSidebar,
    };
    const sidebarStyle: CSSProperties & TCssCustomProperties = {
      '--_sidebar-width': toCssLength(width),
      '--_sidebar-collapsed-width': toCssLength(collapsedWidth),
    };
    const mobileDrawerStyle: CSSProperties & TCssCustomProperties = {
      '--_drawer-horizontal-size': toCssLength(mobileWidth),
    };
    const layoutChildren = Children.toArray(children);
    const sidebarChildren = layoutChildren.filter(
      (child) => !isValidElement(child) || child.type !== SidebarInsetElement,
    );
    const insetChildren = layoutChildren.filter(
      (child) => isValidElement(child) && child.type === SidebarInsetElement,
    );
    const classes = ['one-sidebar-layout', className].filter(Boolean).join(' ');

    const sidebar = (
      <nav
        ref={sidebarRef}
        id={sidebarId}
        aria-label={label}
        data-state={isMobile || isOpen ? 'expanded' : 'collapsed'}
        data-collapsible={isMobile || isOpen ? 'none' : 'icon'}
        data-animate-on-hover={animateOnHover ? 'true' : 'false'}
        className="one-sidebar"
        style={sidebarStyle}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
      >
        <AnimatedHighlight
          className="one-sidebar__highlight"
          followTargetShape
        />
        {sidebarChildren}
      </nav>
    );

    return (
      <SidebarContext.Provider value={context}>
        <div
          {...props}
          ref={ref}
          className={classes}
          data-state={isOpen ? 'expanded' : 'collapsed'}
          data-mobile={isMobile ? 'true' : undefined}
          style={{ ...style }}
        >
          {isMobile ? (
            <Drawer open={mobileOpen} onOpenChange={setMobileOpen} side="left">
              <Drawer.Content
                className="one-sidebar__mobile-drawer"
                showCloseButton={false}
                aria-label={label}
                style={mobileDrawerStyle}
              >
                {sidebar}
              </Drawer.Content>
            </Drawer>
          ) : (
            sidebar
          )}
          {insetChildren}
        </div>
      </SidebarContext.Provider>
    );
  },
);

const SidebarHeader = forwardRef<HTMLDivElement, TSidebarHeaderProps>(
  function SidebarHeader({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={['one-sidebar__header', className].filter(Boolean).join(' ')}
      />
    );
  },
);

const SidebarBrand = forwardRef<HTMLDivElement, TSidebarBrandProps>(
  function SidebarBrand({ icon, children, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={['one-sidebar__brand', className].filter(Boolean).join(' ')}
      >
        {icon && (
          <span className="one-sidebar__brand-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="one-sidebar__brand-label" data-sidebar="brand-label">
          {children}
        </span>
      </div>
    );
  },
);

const SidebarContent = forwardRef<HTMLDivElement, TSidebarContentProps>(
  function SidebarContent({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={['one-sidebar__content', className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  },
);

const SidebarGroup = forwardRef<HTMLElement, TSidebarGroupProps>(
  function SidebarGroup({ className, ...props }, ref) {
    return (
      <section
        {...props}
        ref={ref}
        className={['one-sidebar__group', className].filter(Boolean).join(' ')}
      />
    );
  },
);

const SidebarGroupLabel = forwardRef<
  HTMLHeadingElement,
  TSidebarGroupLabelProps
>(function SidebarGroupLabel({ className, ...props }, ref) {
  return (
    <h2
      {...props}
      ref={ref}
      data-sidebar="group-label"
      className={['one-sidebar__group-label', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

const SidebarGroupAction = forwardRef<
  HTMLButtonElement,
  TSidebarGroupActionProps
>(function SidebarGroupAction({ className, ...props }, ref) {
  return (
    <Button
      {...props}
      ref={ref}
      data-sidebar="group-action"
      variant="ghost"
      size="icon-small"
      className={['one-sidebar__group-action', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

const SidebarGroupContent = forwardRef<
  HTMLDivElement,
  TSidebarGroupContentProps
>(function SidebarGroupContent({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={['one-sidebar__group-content', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

const SidebarMenu = forwardRef<HTMLUListElement, TSidebarMenuProps>(
  function SidebarMenu({ className, ...props }, ref) {
    return (
      <ul
        {...props}
        ref={ref}
        className={['one-sidebar__menu', className].filter(Boolean).join(' ')}
      />
    );
  },
);

const SidebarMenuItem = forwardRef<HTMLLIElement, TSidebarMenuItemProps>(
  function SidebarMenuItem({ className, ...props }, ref) {
    return (
      <li
        {...props}
        ref={ref}
        className={['one-sidebar__menu-item', className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  },
);

const SidebarItem = forwardRef<HTMLElement, TSidebarItemProps>(
  function SidebarItem(
    {
      href,
      icon,
      active = false,
      label: accessibleLabel,
      tooltip,
      disabled = false,
      target,
      rel,
      type = 'button',
      onClick,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const { isMobile, open, setMobileOpen } = useSidebarContext('Sidebar.Item');
    const label =
      tooltip ??
      accessibleLabel ??
      (typeof children === 'string' ? children : undefined);
    const classes = ['one-sidebar__item', className].filter(Boolean).join(' ');

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      onClick?.(event);

      if (disabled) {
        event.preventDefault();
        return;
      }

      if (!event.defaultPrevented && isMobile && href) {
        setMobileOpen(false);
      }
    };

    const content = (
      <>
        {icon && (
          <span className="one-sidebar__item-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="one-sidebar__item-label">{children}</span>
      </>
    );

    const item = href ? (
      <a
        {...props}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        aria-current={active ? 'page' : props['aria-current']}
        aria-label={
          !open || typeof children !== 'string'
            ? (props['aria-label'] ?? label)
            : props['aria-label']
        }
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : props.tabIndex}
        data-sidebar="menu-button"
        data-active={active ? 'true' : undefined}
        className={classes}
        onClick={handleClick}
      >
        {content}
      </a>
    ) : (
      <button
        {...props}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        aria-current={active ? 'page' : props['aria-current']}
        data-sidebar="menu-button"
        aria-label={
          !open || typeof children !== 'string'
            ? (props['aria-label'] ?? label)
            : props['aria-label']
        }
        data-active={active ? 'true' : undefined}
        className={classes}
        onClick={handleClick}
      >
        {content}
      </button>
    );

    return label ? (
      <Tooltip content={label} placement="right" disabled={open || isMobile}>
        {item}
      </Tooltip>
    ) : (
      item
    );
  },
);

const SidebarMenuAction = forwardRef<
  HTMLButtonElement,
  TSidebarMenuActionProps
>(function SidebarMenuAction({ className, ...props }, ref) {
  return (
    <Button
      {...props}
      ref={ref}
      data-sidebar="menu-action"
      variant="ghost"
      size="icon-small"
      className={['one-sidebar__menu-action', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

const SidebarMenuBadge = forwardRef<HTMLSpanElement, TSidebarMenuBadgeProps>(
  function SidebarMenuBadge({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        data-sidebar="menu-badge"
        className={['one-sidebar__menu-badge', className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  },
);

const SidebarSubmenu = forwardRef<HTMLDivElement, TSidebarSubmenuProps>(
  function SidebarSubmenu(
    {
      label,
      icon,
      open,
      defaultOpen = false,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const {
      isMobile,
      open: sidebarOpen,
      setOpen: setSidebarOpen,
    } = useSidebarContext('Sidebar.Submenu');
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [hasBeenOpened, setHasBeenOpened] = useState(false);
    const isOpen = open ?? uncontrolledOpen;
    const submenuId = useId();

    const handleOpenChange = (nextOpen: boolean) => {
      if (nextOpen) {
        setHasBeenOpened(true);
      }

      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    };

    const handleClick = () => {
      if (!sidebarOpen && !isMobile) {
        setSidebarOpen(true);
      } else {
        handleOpenChange(!isOpen);
      }
    };

    const trigger = (
      <Button
        variant="ghost"
        className="one-sidebar__submenu-trigger"
        data-sidebar="menu-button"
        aria-label={label}
        aria-expanded={isOpen && (sidebarOpen || isMobile)}
        aria-controls={submenuId}
        onClick={handleClick}
      >
        {icon && (
          <span className="one-sidebar__item-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="one-sidebar__item-label">{label}</span>
        <ChevronDown
          aria-hidden="true"
          className="one-sidebar__submenu-chevron"
        />
      </Button>
    );

    return (
      <Collapsible.Root
        {...props}
        ref={ref}
        open={isOpen}
        onOpenChange={handleOpenChange}
        data-sidebar-stagger={hasBeenOpened ? 'true' : undefined}
        className={['one-sidebar__submenu', className]
          .filter(Boolean)
          .join(' ')}
      >
        {!sidebarOpen && !isMobile ? (
          <Tooltip content={label} placement="right">
            {trigger}
          </Tooltip>
        ) : (
          trigger
        )}
        <Collapsible.Content
          id={submenuId}
          className="one-sidebar__submenu-content"
        >
          <ul className="one-sidebar__submenu-list">{children}</ul>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  },
);

const SidebarSubmenuItem = forwardRef<HTMLElement, TSidebarSubmenuItemProps>(
  function SidebarSubmenuItem({ className, ...props }, ref) {
    return (
      <li
        className={['one-sidebar__submenu-item', className]
          .filter(Boolean)
          .join(' ')}
      >
        <SidebarItem {...props} ref={ref} />
      </li>
    );
  },
);

const SidebarFooter = forwardRef<HTMLDivElement, TSidebarFooterProps>(
  function SidebarFooter({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={['one-sidebar__footer', className].filter(Boolean).join(' ')}
      />
    );
  },
);

const SidebarTrigger = forwardRef<HTMLButtonElement, TSidebarTriggerProps>(
  function SidebarTrigger(
    { 'aria-label': accessibleName, onClick, className, children, ...props },
    ref,
  ) {
    const { open, isMobile, mobileOpen, sidebarId, toggleSidebar } =
      useSidebarContext('Sidebar.Trigger');
    const expanded = isMobile ? mobileOpen : open;
    const defaultName = isMobile
      ? mobileOpen
        ? 'Close sidebar'
        : 'Open sidebar'
      : open
        ? 'Collapse sidebar'
        : 'Expand sidebar';

    return (
      <Button
        {...props}
        ref={ref}
        variant="ghost"
        size="icon"
        className={['one-sidebar__trigger', className]
          .filter(Boolean)
          .join(' ')}
        aria-label={accessibleName ?? defaultName}
        aria-expanded={expanded}
        aria-controls={sidebarId}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            toggleSidebar();
          }
        }}
      >
        {children ?? (
          <PanelLeft aria-hidden="true" className="one-sidebar__trigger-icon" />
        )}
      </Button>
    );
  },
);

const SidebarRail = forwardRef<HTMLButtonElement, TSidebarRailProps>(
  function SidebarRail(
    {
      'aria-label': accessibleName = 'Toggle sidebar',
      onClick,
      className,
      ...props
    },
    ref,
  ) {
    const { open, isMobile, mobileOpen, sidebarId, toggleSidebar } =
      useSidebarContext('Sidebar.Rail');

    return (
      <Button
        {...props}
        ref={ref}
        variant="ghost"
        size="icon-small"
        className={['one-sidebar__rail', className].filter(Boolean).join(' ')}
        aria-label={accessibleName}
        aria-controls={sidebarId}
        aria-expanded={isMobile ? mobileOpen : open}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            toggleSidebar();
          }
        }}
      />
    );
  },
);

export interface SidebarComponent extends React.ForwardRefExoticComponent<
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
