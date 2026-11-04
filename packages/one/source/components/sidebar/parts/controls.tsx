import { forwardRef } from 'react';
import { PanelLeft } from '../../../icons';
import { Button } from '../../button/button.js';
import { useSidebarContext } from '../context.js';
import type { TSidebarRailProps, TSidebarTriggerProps } from '../types.js';

export const SidebarTrigger = forwardRef<
  HTMLButtonElement,
  TSidebarTriggerProps
>(function SidebarTrigger(
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
      className={['one-sidebar__trigger', className].filter(Boolean).join(' ')}
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
});

export const SidebarRail = forwardRef<HTMLButtonElement, TSidebarRailProps>(
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
