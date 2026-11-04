import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { forwardRef } from 'react';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type { NavigationMenuLinkProps } from '../types.js';

export const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(function NavigationMenuLink(
  { active, closeOnClick, className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Link
      {...props}
      ref={ref}
      active={active}
      closeOnClick={closeOnClick}
      className={joinClassNames('one-navigation-menu__link', className)}
    />
  );
});
