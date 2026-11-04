import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { forwardRef, useId } from 'react';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  NavigationMenuItemProps,
  NavigationMenuListProps,
} from '../types.js';

export const NavigationMenuList = forwardRef<
  HTMLUListElement,
  NavigationMenuListProps
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <BaseNavigationMenu.List
      {...props}
      ref={ref}
      className={joinClassNames('one-navigation-menu__list', className)}
    />
  );
});

export const NavigationMenuItem = forwardRef<
  HTMLLIElement,
  NavigationMenuItemProps
>(function NavigationMenuItem({ value, className, ...props }, ref) {
  const generatedValue = useId();
  const itemValue = value ?? generatedValue;

  return (
    <BaseNavigationMenu.Item
      {...props}
      ref={ref}
      value={itemValue}
      className={joinClassNames('one-navigation-menu__item', className)}
    />
  );
});
