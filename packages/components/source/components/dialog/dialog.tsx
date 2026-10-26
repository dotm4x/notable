import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { BaseUIEvent } from '@base-ui/react/types';
import { X } from 'lucide-react';
import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
} from 'react';
import { Button, type ButtonProps } from '../button/button.js';
import './dialog.css';

/** Available dialog widths. */
export type DialogSize = 'small' | 'medium' | 'large';

/** Props for the {@link Dialog} root component. */
export type DialogProps = {
  /** Controlled open state. Omit to let the dialog manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Dialog parts, such as `Dialog.Trigger` and `Dialog.Content`. */
  children?: ReactNode;
};

/** Props for `Dialog.Trigger`. */
export type DialogTriggerProps = {
  /** A single element that opens the dialog. Other content is wrapped in a `Button`. */
  children: ReactNode;
};

/** Props for `Dialog.Content`, which renders the modal popup. */
export type DialogContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Width of the dialog. Defaults to `medium`. */
  size?: DialogSize;
  /** Shows a close button in the top-right corner. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Closes the dialog when the backdrop is clicked. Defaults to `true`. */
  closeOnBackdropClick?: boolean;
};

/** Props for `Dialog.Header`. */
export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Dialog.Title`. */
export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for `Dialog.Description`. */
export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Props for `Dialog.Footer`. */
export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Dialog.Close`. Always renders with `type="button"`. */
export type DialogCloseProps = ButtonProps;

type DialogContextValue = {
  closeOnBackdropClickRef: RefObject<boolean>;
};

type ConsumerClickEvent = MouseEvent<HTMLElement> &
  Partial<Pick<BaseUIEvent<MouseEvent<HTMLElement>>, 'preventBaseUIHandler'>>;

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(componentName: string) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Dialog.`);
  }

  return context;
}

/**
 * Wraps a consumer `onClick` so a call to `preventDefault` also skips Base UI's
 * own click handling, matching the native `<dialog>` behavior.
 */
function withConsumerClick(
  onClick: MouseEventHandler<HTMLElement> | undefined,
): MouseEventHandler<HTMLElement> {
  return (event: ConsumerClickEvent) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      event.preventBaseUIHandler?.();
    }
  };
}

/**
 * Root component that owns the open state of a modal dialog. Pass `open` and
 * `onOpenChange` for controlled use, or `defaultOpen` for uncontrolled use.
 */
function DialogRoot({
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

/**
 * Opens the dialog when activated. Attributes and `onClick` of the single child
 * element are preserved; calling `preventDefault` in `onClick` skips opening.
 */
function DialogTrigger({ children }: DialogTriggerProps) {
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

/**
 * Renders the modal popup with its backdrop and body. Escape, focus trapping,
 * scroll locking, and focus restoration are handled by Base UI. Pass `className`
 * and HTML attributes to style or extend the popup element.
 */
const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
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

    // Base UI reads this ref when a press lands outside the popup, so it is
    // updated before the next pointer event rather than during render.
    useLayoutEffect(() => {
      closeOnBackdropClickRef.current = closeOnBackdropClick;
    }, [closeOnBackdropClick, closeOnBackdropClickRef]);

    const classes = ['notable-dialog', `notable-dialog--${size}`, className]
      .filter(Boolean)
      .join(' ');

    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="notable-dialog__backdrop" />
        <BaseDialog.Popup {...props} ref={ref} className={classes}>
          <div className="notable-dialog__body">
            {children}
            {showCloseButton && (
              <BaseDialog.Close
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="notable-dialog__close-button"
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

/** Lays out the title and description at the top of the dialog. */
function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      {...props}
      className={['notable-dialog__header', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/** Accessible name of the dialog. Renders an `h2` linked to the popup. */
function DialogTitle({ className, ...props }: DialogTitleProps) {
  useDialogContext('Dialog.Title');

  return (
    <BaseDialog.Title
      {...props}
      className={['notable-dialog__title', className].filter(Boolean).join(' ')}
    />
  );
}

/** Accessible description of the dialog. Linked to the popup automatically. */
function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  useDialogContext('Dialog.Description');

  return (
    <BaseDialog.Description
      {...props}
      className={['notable-dialog__description', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/** Lays out action buttons at the bottom of the dialog. */
function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      {...props}
      className={['notable-dialog__footer', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/**
 * Closes the dialog when activated. Renders an outline `Button` by default and
 * always uses `type="button"`, so it never submits a surrounding form.
 */
function DialogClose({ onClick, ...props }: DialogCloseProps) {
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

/**
 * Compound modal dialog built on Base UI. Compose `Dialog.Trigger`,
 * `Dialog.Content`, `Dialog.Header`, `Dialog.Title`, `Dialog.Description`,
 * `Dialog.Footer`, and `Dialog.Close` inside the root.
 */
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
});
