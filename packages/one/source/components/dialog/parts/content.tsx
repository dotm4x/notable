import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { forwardRef, useLayoutEffect } from 'react';
import { X } from '../../../icons';
import { Button } from '../../button/button.js';
import { useDialogContext } from '../context.js';
import { withConsumerClick } from '../../../internal/helpers/with-consumer-click.js';
import type { DialogCloseProps, DialogContentProps } from '../types.js';

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    {
      size = 'medium',
      showCloseButton = true,
      closeOnBackdropClick = true,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const { closeOnBackdropClickRef } = useDialogContext('Dialog.Content');

    useLayoutEffect(() => {
      closeOnBackdropClickRef.current = closeOnBackdropClick;
    }, [closeOnBackdropClick, closeOnBackdropClickRef]);

    const classes = ['one-dialog', `one-dialog--${size}`, className]
      .filter(Boolean)
      .join(' ');

    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="one-dialog__backdrop" />
        <BaseDialog.Popup {...props} ref={ref} className={classes}>
          <div className="one-dialog__body">
            {children}
            {showCloseButton && (
              <BaseDialog.Close
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="one-dialog__close-button"
                    aria-label="Close dialog"
                  />
                }
              >
                <X aria-hidden="true" />
              </BaseDialog.Close>
            )}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    );
  },
);

export function DialogClose({ onClick, ...props }: DialogCloseProps) {
  useDialogContext('Dialog.Close');

  return (
    <BaseDialog.Close
      render={
        <Button
          variant="outline"
          {...props}
          type="button"
          onClick={withConsumerClick(onClick)}
        />
      }
    />
  );
}
