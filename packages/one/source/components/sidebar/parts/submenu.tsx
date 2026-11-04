import { forwardRef, useId, useState } from 'react';
import { ChevronDown } from '../../../icons';
import { Button } from '../../button/button.js';
import { Collapsible } from '../../collapsible/collapsible.js';
import { Tooltip } from '../../tooltip/tooltip.js';
import { useSidebarContext } from '../context.js';
import type {
  TSidebarSubmenuItemProps,
  TSidebarSubmenuProps,
} from '../types.js';
import { SidebarItem } from './menu.js';

export const SidebarSubmenu = forwardRef<HTMLDivElement, TSidebarSubmenuProps>(
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

export const SidebarSubmenuItem = forwardRef<
  HTMLElement,
  TSidebarSubmenuItemProps
>(function SidebarSubmenuItem({ className, ...props }, ref) {
  return (
    <li
      className={['one-sidebar__submenu-item', className]
        .filter(Boolean)
        .join(' ')}
    >
      <SidebarItem {...props} ref={ref} />
    </li>
  );
});
