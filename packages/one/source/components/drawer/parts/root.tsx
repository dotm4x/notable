import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import {
  cloneElement,
  isValidElement,
  useRef,
  type MouseEventHandler,
} from 'react';
import { Button } from '../../button/button.js';
import { DrawerContext, useDrawerContext } from '../context.js';
import { withConsumerClick } from '../../../internal/helpers/with-consumer-click.js';
import { swipeDirectionBySide } from '../helpers/swipe.js';
import { useDrawerStack } from '../hooks/use-drawer-stack.js';
import type { DrawerProps, DrawerTriggerProps } from '../types.js';

export function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  side = 'right',
  children,
}: DrawerProps) {
  const actionsRef = useRef<BaseDrawer.Root.Actions | null>(null);
  const { closeOnBackdropClickRef, stackEntry } = useDrawerStack(actionsRef);

  const handleOpenChange = (
    nextOpen: boolean,
    eventDetails: BaseDrawer.Root.ChangeEventDetails,
  ) => {
    if (
      !nextOpen &&
      eventDetails.reason === 'outside-press' &&
      !closeOnBackdropClickRef.current
    ) {
      eventDetails.cancel();

      return;
    }

    onOpenChange?.(nextOpen);
  };

  return (
    <DrawerContext.Provider
      value={{ closeOnBackdropClickRef, side, stackEntry }}
    >
      <BaseDrawer.Root
        open={open}
        defaultOpen={defaultOpen}
        actionsRef={actionsRef}
        onOpenChange={handleOpenChange}
        swipeDirection={swipeDirectionBySide[side]}
      >
        {children}
      </BaseDrawer.Root>
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({ children }: DrawerTriggerProps) {
  useDrawerContext('Drawer.Trigger');

  const trigger = isValidElement<{ onClick?: MouseEventHandler<HTMLElement> }>(
    children,
  ) ? (
    children
  ) : (
    <Button>{children}</Button>
  );

  return (
    <BaseDrawer.Trigger
      render={cloneElement(trigger, {
        onClick: withConsumerClick(trigger.props.onClick),
      })}
    />
  );
}
