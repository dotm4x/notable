import { forwardRef, type MouseEvent, type Ref } from 'react';
import { Button } from '../../button/button.js';
import { Tooltip } from '../../tooltip/tooltip.js';
import { useSidebarContext } from '../context.js';
import type {
  TSidebarItemProps,
  TSidebarMenuActionProps,
  TSidebarMenuBadgeProps,
  TSidebarMenuItemProps,
  TSidebarMenuProps,
} from '../types.js';

export const SidebarMenu = forwardRef<HTMLUListElement, TSidebarMenuProps>(
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

export const SidebarMenuItem = forwardRef<HTMLLIElement, TSidebarMenuItemProps>(
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

export const SidebarItem = forwardRef<HTMLElement, TSidebarItemProps>(
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
        ref={ref as Ref<HTMLAnchorElement>}
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
        ref={ref as Ref<HTMLButtonElement>}
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

export const SidebarMenuAction = forwardRef<
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

export const SidebarMenuBadge = forwardRef<
  HTMLSpanElement,
  TSidebarMenuBadgeProps
>(function SidebarMenuBadge({ className, ...props }, ref) {
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
});
