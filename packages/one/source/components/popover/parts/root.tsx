import { Popover as BasePopover } from '@base-ui/react/popover';
import { isValidElement } from 'react';
import { Button } from '../../button/button.js';
import type { PopoverProps, PopoverTriggerProps } from '../types.js';

export function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  return (
    <BasePopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      {children}
    </BasePopover.Root>
  );
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const trigger = isValidElement(children) ? (
    children
  ) : (
    <Button>{children}</Button>
  );

  return <BasePopover.Trigger render={trigger} />;
}
