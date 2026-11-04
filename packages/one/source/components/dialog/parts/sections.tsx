import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { useDialogContext } from '../context.js';
import type {
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogTitleProps,
} from '../types.js';

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      {...props}
      className={['one-dialog__header', className].filter(Boolean).join(' ')}
    />
  );
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  useDialogContext('Dialog.Title');

  return (
    <BaseDialog.Title
      {...props}
      className={['one-dialog__title', className].filter(Boolean).join(' ')}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  useDialogContext('Dialog.Description');

  return (
    <BaseDialog.Description
      {...props}
      className={['one-dialog__description', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      {...props}
      className={['one-dialog__footer', className].filter(Boolean).join(' ')}
    />
  );
}
