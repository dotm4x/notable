import { X } from 'lucide-react';
import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
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

/** Props for `Dialog.Content`, which renders the native `<dialog>` element. */
export type DialogContentProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'open'
> & {
  /** Width of the dialog. Defaults to `medium`. */
  size?: DialogSize;
  /** Shows a close button in the top-right corner. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Closes the dialog when the backdrop is clicked. Defaults to `true`. */
  closeOnBackdropClick?: boolean;
  /** Dialog body content. */
  children?: ReactNode;
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
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  setHasTitle: (hasTitle: boolean) => void;
  setHasDescription: (hasDescription: boolean) => void;
};

type TriggerChildProps = {
  onClick?: MouseEventHandler<HTMLElement>;
  'aria-haspopup'?: 'dialog';
  'aria-expanded'?: boolean;
};

const DialogContext = createContext<DialogContextValue | null>(null);

const CLOSING_ATTRIBUTE = 'data-closing';
const EXIT_ANIMATION_NAME = 'notable-dialog-out';

/** True when the dialog runs a CSS animation, so closing must wait for it to end. */
function hasAnimation(element: HTMLElement) {
  const { animationName } = getComputedStyle(element);

  return animationName !== '' && animationName !== 'none';
}

/** Finishes closing once the dialog's own exit animation has ended or been cancelled. */
function completeExitAnimation(
  dialog: HTMLDialogElement,
  event: Pick<globalThis.AnimationEvent, 'target' | 'animationName'>,
) {
  if (
    event.target === dialog &&
    event.animationName === EXIT_ANIMATION_NAME &&
    dialog.hasAttribute(CLOSING_ATTRIBUTE)
  ) {
    dialog.close();
  }
}

function useDialogContext(componentName: string) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Dialog.`);
  }

  return context;
}

/**
 * Root component that owns the open state of a modal dialog. Pass `open` and
 * `onOpenChange` for controlled use, or `defaultOpen` for uncontrolled use.
 */
function DialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : uncontrolledOpen;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      if (nextOpen !== isOpen) {
        onOpenChange?.(nextOpen);
      }
    },
    [isControlled, isOpen, onOpenChange],
  );

  useLayoutEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen) {
      dialog.removeAttribute(CLOSING_ATTRIBUTE);

      if (!dialog.open) {
        dialog.showModal();
      }

      return;
    }

    if (!dialog.open) {
      return;
    }

    // The exit animation finishes by calling `close()` from `Dialog.Content`.
    if (hasAnimation(dialog)) {
      dialog.setAttribute(CLOSING_ATTRIBUTE, '');
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        setOpen,
        dialogRef,
        titleId,
        descriptionId,
        hasTitle,
        hasDescription,
        setHasTitle,
        setHasDescription,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

/**
 * Opens the dialog when activated. Attributes and `onClick` of the single child
 * element are preserved; calling `preventDefault` in `onClick` skips opening.
 */
function DialogTrigger({ children }: DialogTriggerProps) {
  const { isOpen, setOpen } = useDialogContext('Dialog.Trigger');
  const trigger = isValidElement<TriggerChildProps>(children) ? (
    children
  ) : (
    <Button>{children}</Button>
  );
  const triggerOnClick = trigger.props.onClick;

  return cloneElement(trigger, {
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    onClick: (event: MouseEvent<HTMLElement>) => {
      triggerOnClick?.(event);

      if (!event.defaultPrevented) {
        setOpen(true);
      }
    },
  });
}

/**
 * Renders the native modal `<dialog>` with its body. Escape and backdrop clicks
 * request closing through the root state. Pass `className` and HTML attributes
 * to style or extend the dialog element.
 */
function DialogContent({
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className,
  children,
  onCancel,
  onClose,
  onClick,
  onPointerDown,
  ...props
}: DialogContentProps) {
  const {
    dialogRef,
    setOpen,
    titleId,
    descriptionId,
    hasDescription,
    hasTitle,
  } = useDialogContext('Dialog.Content');
  const isPressOnBackdrop = useRef(false);

  const classes = ['notable-dialog', `notable-dialog--${size}`, className]
    .filter(Boolean)
    .join(' ');

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    onCancel?.(event);

    // Closing goes through state so a controlled parent that ignores
    // `onOpenChange` keeps the dialog open.
    if (!event.defaultPrevented) {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
    onClose?.(event);
    setOpen(false);
  };

  // Only the dialog's own exit animation completes the close. Animations on
  // descendants and the backdrop bubble or run alongside it, so they are ignored.
  // Both events are listened to natively: React's synthetic animation handlers
  // do not fire reliably here, and a cancelled exit must still close the dialog.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleNativeExitEnd = (event: globalThis.AnimationEvent) =>
      completeExitAnimation(dialog, event);

    dialog.addEventListener('animationend', handleNativeExitEnd);
    dialog.addEventListener('animationcancel', handleNativeExitEnd);

    return () => {
      dialog.removeEventListener('animationend', handleNativeExitEnd);
      dialog.removeEventListener('animationcancel', handleNativeExitEnd);
    };
  }, [dialogRef]);

  // The backdrop is the `<dialog>` element itself. A click only counts as a
  // backdrop click when the press also started there, so drag-selecting text
  // that ends outside the dialog does not dismiss it.
  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    isPressOnBackdrop.current = event.target === event.currentTarget;
    onPointerDown?.(event);
  };

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event);

    const isBackdropClick =
      isPressOnBackdrop.current && event.target === event.currentTarget;
    isPressOnBackdrop.current = false;

    if (closeOnBackdropClick && isBackdropClick) {
      setOpen(false);
    }
  };

  return (
    <dialog
      {...props}
      ref={dialogRef}
      className={classes}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      onCancel={handleCancel}
      onClose={handleClose}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <div className="notable-dialog__body">
        {children}
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="notable-dialog__close-button"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" />
          </Button>
        )}
      </div>
    </dialog>
  );
}

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

/** Accessible name of the dialog. Renders an `h2` with a generated id. */
function DialogTitle({ className, ...props }: DialogTitleProps) {
  const { titleId, setHasTitle } = useDialogContext('Dialog.Title');

  useEffect(() => {
    setHasTitle(true);

    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <h2
      {...props}
      id={titleId}
      className={['notable-dialog__title', className].filter(Boolean).join(' ')}
    />
  );
}

/** Accessible description of the dialog. */
function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  const { descriptionId, setHasDescription } =
    useDialogContext('Dialog.Description');

  useEffect(() => {
    setHasDescription(true);

    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      {...props}
      id={descriptionId}
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
  const { setOpen } = useDialogContext('Dialog.Close');

  return (
    <Button
      variant="outline"
      {...props}
      type="button"
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
    />
  );
}

/**
 * Compound modal dialog built on the native `<dialog>` element. Compose
 * `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Title`,
 * `Dialog.Description`, `Dialog.Footer`, and `Dialog.Close` inside the root.
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
