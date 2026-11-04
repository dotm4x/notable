import { forwardRef } from 'react';
import { Button } from '../../button/button.js';
import type {
  TSidebarBrandProps,
  TSidebarContentProps,
  TSidebarFooterProps,
  TSidebarGroupActionProps,
  TSidebarGroupContentProps,
  TSidebarGroupLabelProps,
  TSidebarGroupProps,
  TSidebarHeaderProps,
} from '../types.js';

export const SidebarHeader = forwardRef<HTMLDivElement, TSidebarHeaderProps>(
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

export const SidebarBrand = forwardRef<HTMLDivElement, TSidebarBrandProps>(
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

export const SidebarContent = forwardRef<HTMLDivElement, TSidebarContentProps>(
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

export const SidebarGroup = forwardRef<HTMLElement, TSidebarGroupProps>(
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

export const SidebarGroupLabel = forwardRef<
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

export const SidebarGroupAction = forwardRef<
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

export const SidebarGroupContent = forwardRef<
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

export const SidebarFooter = forwardRef<HTMLDivElement, TSidebarFooterProps>(
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
