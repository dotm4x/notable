import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import {
  cloneElement,
  isValidElement,
  useRef,
  type MouseEventHandler,
} from 'react';
import { Button } from '../../button/button.js';
import { DialogContext, useDialogContext } from '../context.js';
import { withConsumerClick } from '../../../internal/helpers/with-consumer-click.js';
import type { DialogProps, DialogTriggerProps } from '../types.js';

export function DialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const closeOnBackdropClickRef = useRef(true);

  const handleOpenChange = (
    nextOpen: boolean,
    eventDetails: BaseDialog.Root.ChangeEventDetails,
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
    <DialogContext.Provider value={{ closeOnBackdropClickRef }}>
      <BaseDialog.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
      >
        {children}
      </BaseDialog.Root>
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  useDialogContext('Dialog.Trigger');

  const trigger = isValidElement<{ onClick?: MouseEventHandler<HTMLElement> }>(
    children,
  ) ? (
    children
  ) : (
    <Button>{children}</Button>
  );

  return (
    <BaseDialog.Trigger
      render={cloneElement(trigger, {
        onClick: withConsumerClick(trigger.props.onClick),
      })}
    />
  );
}
