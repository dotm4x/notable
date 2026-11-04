import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { forwardRef, useState } from 'react';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type { NavigationMenuProps } from '../types.js';

export const NavigationMenuRoot = forwardRef<HTMLElement, NavigationMenuProps>(
  function NavigationMenuRoot(
    {
      value,
      defaultValue,
      onValueChange,
      delay,
      closeDelay,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? null,
    );
    const openValue = value !== undefined ? value : uncontrolledValue;

    return (
      <BaseNavigationMenu.Root
        {...props}
        ref={ref}
        value={openValue}
        onValueChange={(nextValue) => {
          if (value === undefined) {
            setUncontrolledValue(nextValue);
          }
          onValueChange?.(nextValue);
        }}
        delay={delay}
        closeDelay={closeDelay}
        className={joinClassNames('one-navigation-menu', className)}
      >
        {children}
        <BaseNavigationMenu.Portal>
          <BaseNavigationMenu.Positioner
            className="one-navigation-menu__positioner"
            sideOffset={8}
            align="start"
          >
            <BaseNavigationMenu.Popup
              render={<div />}
              className="one-floating-surface one-navigation-menu__popup"
            >
              <BaseNavigationMenu.Viewport className="one-navigation-menu__viewport" />
            </BaseNavigationMenu.Popup>
          </BaseNavigationMenu.Positioner>
        </BaseNavigationMenu.Portal>
      </BaseNavigationMenu.Root>
    );
  },
);
