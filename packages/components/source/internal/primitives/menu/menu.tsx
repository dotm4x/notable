import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import '../../styles/floating-surface.css';
import { AnimatedHighlight } from '../animated-highlight/animated-highlight.js';
import './menu.css';

/** Side of the trigger where the menu popup is placed. */
export type MenuSide = 'top' | 'right' | 'bottom' | 'left';

/** Alignment of the menu popup along the chosen side. */
export type MenuAlign = 'start' | 'center' | 'end';

export type MenuRootProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export type MenuTriggerProps = {
  /** Element that toggles the menu. Base UI merges its handlers into it. */
  render: ReactElement;
};

export type MenuContextTriggerProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.Trigger
>;

export type MenuPopupProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.Popup>,
  'className'
> & {
  className?: string;
  side?: MenuSide;
  align?: MenuAlign;
  sideOffset?: number;
  alignOffset?: number;
};

export type MenuItemProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.Item>,
  'className'
> & {
  className?: string;
};

export type MenuCheckboxItemProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>,
  'className'
> & {
  className?: string;
};

export type MenuRadioGroupProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.RadioGroup>,
  'className'
> & {
  className?: string;
};

export type MenuRadioItemProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>,
  'className'
> & {
  className?: string;
};

export type MenuSubmenuRootProps = {
  /** Controlled open state of the submenu. */
  open?: boolean;
  /** Initial open state of the submenu when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the submenu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export type MenuSubmenuTriggerProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger>,
  'className'
> & {
  className?: string;
};

export type MenuGroupProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.Group>,
  'className'
> & {
  className?: string;
};

export type MenuGroupLabelProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>,
  'className'
> & {
  className?: string;
};

export type MenuSeparatorProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.Separator>,
  'className'
> & {
  className?: string;
};

function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

/**
 * Wires Base UI's menu state into Notable. Keyboard navigation, focus
 * management, and dismissal come from Base UI.
 */
export function MenuRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: MenuRootProps) {
  return (
    <BaseMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      {children}
    </BaseMenu.Root>
  );
}

/** Renders the trigger element, delegating its rendering to Base UI. */
export function MenuTrigger({ render }: MenuTriggerProps) {
  return <BaseMenu.Trigger render={render} />;
}

/**
 * Renders the popup in a portal beside the trigger. The highlight is the first
 * child so that it sits behind the items.
 */
const MenuSubmenuContext = createContext(false);

type MenuPopupSurfaceProps = Omit<
  ComponentPropsWithoutRef<typeof BaseMenu.Popup>,
  'className'
> & {
  className?: string;
};

/** The styled popup shared by root menus and context menus. */
const MenuPopupSurface = forwardRef<HTMLDivElement, MenuPopupSurfaceProps>(
  function MenuPopupSurface({ className, children, ...props }, ref) {
    return (
      <BaseMenu.Popup
        ref={ref}
        className={joinClassNames(
          'notable-menu__popup notable-floating-surface',
          className,
        )}
        {...props}
      >
        <AnimatedHighlight />
        {children}
      </BaseMenu.Popup>
    );
  },
);

export const MenuPopup = forwardRef<HTMLDivElement, MenuPopupProps>(
  function MenuPopup(
    { side, align, sideOffset = 4, alignOffset, className, children, ...props },
    ref,
  ) {
    const isSubmenu = useContext(MenuSubmenuContext);
    const resolvedSide = side ?? (isSubmenu ? undefined : 'bottom');
    const resolvedAlign = align ?? (isSubmenu ? undefined : 'start');

    return (
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          side={resolvedSide}
          align={resolvedAlign}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className="notable-menu__positioner"
        >
          <MenuPopupSurface ref={ref} className={className} {...props}>
            {children}
          </MenuPopupSurface>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    );
  },
);

/** Wraps a context menu's root. Its popup opens at the pointer. */
export function MenuContextRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: MenuRootProps) {
  return (
    <BaseContextMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      {children}
    </BaseContextMenu.Root>
  );
}

/** Region that opens the context menu on right click or long press. */
export const MenuContextTrigger = forwardRef<
  HTMLDivElement,
  MenuContextTriggerProps
>(function MenuContextTrigger({ children, ...props }, ref) {
  return (
    <BaseContextMenu.Trigger ref={ref} {...props}>
      {children}
    </BaseContextMenu.Trigger>
  );
});

/**
 * Renders a context menu popup at the pointer. Base UI supplies the default
 * offsets and places submenus beside their trigger.
 */
export const MenuContextPopup = forwardRef<
  HTMLDivElement,
  MenuPopupSurfaceProps
>(function MenuContextPopup({ className, children, ...props }, ref) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className="notable-menu__positioner">
        <MenuPopupSurface ref={ref} className={className} {...props}>
          {children}
        </MenuPopupSurface>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
});

/**
 * Wraps a submenu's trigger and popup. Its popup is rendered with
 * `MenuPopup`, so it shares the same portal and styling as the root menu.
 */
export function MenuSubmenuRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: MenuSubmenuRootProps) {
  return (
    <BaseMenu.SubmenuRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      <MenuSubmenuContext.Provider value={true}>
        {children}
      </MenuSubmenuContext.Provider>
    </BaseMenu.SubmenuRoot>
  );
}

/** Styled like a menu item, with a trailing chevron that marks the submenu. */
export const MenuSubmenuTrigger = forwardRef<
  HTMLDivElement,
  MenuSubmenuTriggerProps
>(function MenuSubmenuTrigger({ className, children, ...props }, ref) {
  return (
    <BaseMenu.SubmenuTrigger
      ref={ref}
      className={joinClassNames(
        'notable-menu__item notable-menu__submenu-trigger',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight
        size={16}
        aria-hidden="true"
        className="notable-menu__submenu-chevron"
      />
    </BaseMenu.SubmenuTrigger>
  );
});

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem({ className, ...props }, ref) {
    return (
      <BaseMenu.Item
        ref={ref}
        className={joinClassNames('notable-menu__item', className)}
        {...props}
      />
    );
  },
);

/** A menu item that toggles a checked state and shows a check mark when on. */
export const MenuCheckboxItem = forwardRef<
  HTMLDivElement,
  MenuCheckboxItemProps
>(function MenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <BaseMenu.CheckboxItem
      ref={ref}
      className={joinClassNames(
        'notable-menu__item notable-menu__item--selectable',
        className,
      )}
      {...props}
    >
      <BaseMenu.CheckboxItemIndicator
        className="notable-menu__item-indicator"
        keepMounted
      >
        <Check size={16} aria-hidden="true" />
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  );
});

/** Groups radio items so that exactly one of them is checked at a time. */
export const MenuRadioGroup = forwardRef<HTMLDivElement, MenuRadioGroupProps>(
  function MenuRadioGroup({ className, ...props }, ref) {
    return (
      <BaseMenu.RadioGroup
        ref={ref}
        className={joinClassNames('notable-menu__radio-group', className)}
        {...props}
      />
    );
  },
);

/** A menu item within a `MenuRadioGroup` that shows a dot when selected. */
export const MenuRadioItem = forwardRef<HTMLDivElement, MenuRadioItemProps>(
  function MenuRadioItem({ className, children, ...props }, ref) {
    return (
      <BaseMenu.RadioItem
        ref={ref}
        className={joinClassNames(
          'notable-menu__item notable-menu__item--selectable',
          className,
        )}
        {...props}
      >
        <BaseMenu.RadioItemIndicator
          className="notable-menu__item-indicator"
          keepMounted
        >
          <Circle size={8} fill="currentColor" aria-hidden="true" />
        </BaseMenu.RadioItemIndicator>
        {children}
      </BaseMenu.RadioItem>
    );
  },
);

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  function MenuGroup({ className, ...props }, ref) {
    return (
      <BaseMenu.Group
        ref={ref}
        className={joinClassNames('notable-menu__group', className)}
        {...props}
      />
    );
  },
);

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>(
  function MenuGroupLabel({ className, ...props }, ref) {
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        className={joinClassNames('notable-menu__group-label', className)}
        {...props}
      />
    );
  },
);

export const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  function MenuSeparator({ className, ...props }, ref) {
    return (
      <BaseMenu.Separator
        ref={ref}
        className={joinClassNames('notable-menu__separator', className)}
        {...props}
      />
    );
  },
);
