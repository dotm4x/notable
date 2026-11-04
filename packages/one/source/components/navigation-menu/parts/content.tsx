import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { forwardRef } from 'react';
import { ChevronDown } from '../../../icons';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  NavigationMenuContentProps,
  NavigationMenuGroupProps,
  NavigationMenuTriggerProps,
} from '../types.js';

export const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <BaseNavigationMenu.Trigger
      {...props}
      ref={ref}
      className={joinClassNames('one-navigation-menu__trigger', className)}
    >
      {children}
      <ChevronDown
        className="one-navigation-menu__trigger-icon"
        aria-hidden="true"
        focusable="false"
        size={16}
      />
    </BaseNavigationMenu.Trigger>
  );
});

export const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(function NavigationMenuContent({ className, children, ...props }, ref) {
  return (
    <BaseNavigationMenu.Content
      {...props}
      ref={ref}
      className={joinClassNames('one-navigation-menu__content', className)}
    >
      {children}
    </BaseNavigationMenu.Content>
  );
});

export const NavigationMenuGroup = forwardRef<
  HTMLDivElement,
  NavigationMenuGroupProps
>(function NavigationMenuGroup({ className, children, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      role="group"
      className={joinClassNames('one-navigation-menu__group', className)}
    >
      {children}
    </div>
  );
});
