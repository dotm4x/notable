import {
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Button } from '../button/button.js';
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  type MenuAlign,
  type MenuSide,
} from '../../internal/primitives/menu/menu.js';

/** Props for the {@link DropdownMenu} root component. */
export type DropdownMenuProps = {
  /** Controlled open state. Omit to let the menu manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Menu parts, such as `DropdownMenu.Trigger` and `DropdownMenu.Content`. */
  children?: ReactNode;
};

/** Props for `DropdownMenu.Trigger`. */
export type DropdownMenuTriggerProps = {
  /**
   * A single element that opens the menu. Its attributes and `onClick` are
   * preserved. Any other content is wrapped in a `Button`.
   */
  children: ReactNode;
};

/** Props for `DropdownMenu.Content`, which renders the menu popup. */
export type DropdownMenuContentProps = ComponentPropsWithoutRef<'div'> & {
  /** Side of the trigger where the menu appears. Defaults to `bottom`. */
  side?: MenuSide;
  /** Alignment along the chosen side. Defaults to `start`. */
  align?: MenuAlign;
  /** Distance in pixels between the trigger and the menu. Defaults to `4`. */
  sideOffset?: number;
  /** Distance in pixels to shift the menu along the aligned edge. */
  alignOffset?: number;
};

/**
 * Props for `DropdownMenu.Item`. Activating an item closes the menu. Use
 * `disabled` to keep an item visible but unavailable.
 */
export type DropdownMenuItemProps = ComponentPropsWithoutRef<'div'> & {
  /** Disables the item. Disabled items are skipped by keyboard navigation. */
  disabled?: boolean;
};

/** Props for `DropdownMenu.Group`. */
export type DropdownMenuGroupProps = ComponentPropsWithoutRef<'div'>;

/** Props for `DropdownMenu.GroupLabel`. */
export type DropdownMenuGroupLabelProps = ComponentPropsWithoutRef<'div'>;

/** Props for `DropdownMenu.Separator`. */
export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<'div'>;

function DropdownMenuRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  return (
    <MenuRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </MenuRoot>
  );
}

/**
 * Toggles the menu when activated. A single child element is rendered as the
 * trigger; other content is wrapped in a `Button`.
 */
function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const trigger = isValidElement(children) ? (
    children
  ) : (
    <Button>{children}</Button>
  );

  return <MenuTrigger render={trigger} />;
}

/**
 * Renders the menu popup in a portal beside the trigger. Arrow keys, Home and
 * End, typeahead, Escape, and outside presses are handled by Base UI.
 */
const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { side, align, sideOffset, alignOffset, className, children, ...props },
  ref,
) {
  return (
    <MenuPopup
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={className}
      {...props}
    >
      {children}
    </MenuPopup>
  );
});

/** A selectable action in the menu. */
const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, ...props }, ref) {
    return <MenuItem ref={ref} className={className} {...props} />;
  },
);

const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup(props, ref) {
    return <MenuGroup ref={ref} {...props} />;
  },
);

const DropdownMenuGroupLabel = forwardRef<
  HTMLDivElement,
  DropdownMenuGroupLabelProps
>(function DropdownMenuGroupLabel(props, ref) {
  return <MenuGroupLabel ref={ref} {...props} />;
});

const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator(props, ref) {
  return <MenuSeparator ref={ref} {...props} />;
});

/**
 * Action menu opened from a trigger. Compose it with `DropdownMenu.Trigger`,
 * `DropdownMenu.Content`, `DropdownMenu.Item`, and the optional group,
 * label, and separator parts. Use `Shortcut` inside an item to show a key
 * combination. Forwards refs to the DOM element each part renders.
 */
export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  GroupLabel: DropdownMenuGroupLabel,
  Separator: DropdownMenuSeparator,
});
