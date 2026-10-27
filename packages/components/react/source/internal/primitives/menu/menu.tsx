import { Menu as BaseMenu } from '@base-ui/react/menu';
import {
  forwardRef,
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
export const MenuPopup = forwardRef<HTMLDivElement, MenuPopupProps>(
  function MenuPopup(
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className="notable-menu__positioner"
        >
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
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    );
  },
);

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
