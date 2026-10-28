import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { BaseUIEvent } from '@base-ui/react/types';
import { X } from 'lucide-react';
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
} from 'react';
import { Button, type ButtonProps } from '../button/button.js';
import './drawer.css';

/** Edge of the viewport that the drawer slides in from. */
export type DrawerSide = 'right' | 'left' | 'top' | 'bottom';

/**
 * Size of the drawer. Sets the width of `left` and `right` drawers and the
 * height of `top` and `bottom` drawers.
 */
export type DrawerSize = 'small' | 'medium' | 'large';

/** Props for the {@link Drawer} root component. */
export type DrawerProps = {
  /** Controlled open state. Omit to let the drawer manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the drawer opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Edge the drawer slides in from. Defaults to `right`. */
  side?: DrawerSide;
  /** Drawer parts, such as `Drawer.Trigger` and `Drawer.Content`. */
  children?: ReactNode;
};

/** Props for `Drawer.Trigger`. */
export type DrawerTriggerProps = {
  /** A single element that opens the drawer. Other content is wrapped in a `Button`. */
  children: ReactNode;
};

/** Props for `Drawer.Content`, which renders the drawer surface. */
export type DrawerContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Size of the drawer. Defaults to `medium`. */
  size?: DrawerSize;
  /** Shows a close button in the top-right corner. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Closes the drawer when the backdrop is clicked. Defaults to `true`. */
  closeOnBackdropClick?: boolean;
};

/** Props for `Drawer.Header`. */
export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Drawer.Title`. */
export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for `Drawer.Description`. */
export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Props for `Drawer.Footer`. */
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Drawer.Close`. Always renders with `type="button"`. */
export type DrawerCloseProps = ButtonProps;

/** One mounted drawer in the stack, used to close it and the drawers in front of it. */
type DrawerStackEntry = {
  popupRef: RefObject<HTMLElement | null>;
  close: () => void;
  closeOnBackdropClickRef: RefObject<boolean>;
};

type DrawerContextValue = {
  closeOnBackdropClickRef: RefObject<boolean>;
  side: DrawerSide;
  stackEntry: DrawerStackEntry;
};

/** Pointer movement above this many pixels is a swipe, not a click. */
const clickTolerancePx = 4;

/** Mounted drawers, ordered from the back-most to the front-most. */
const openDrawerStack: DrawerStackEntry[] = [];
let pressOrigin: { x: number; y: number } | null = null;
/** How many drawers were mounted before the current press, so drawers it opens are ignored. */
let pressStackLength = 0;

function handleDocumentPointerDown(event: globalThis.PointerEvent) {
  pressOrigin = { x: event.clientX, y: event.clientY };
  pressStackLength = openDrawerStack.length;
}

/**
 * Base UI dismisses only the front-most drawer on an outside click, and it
 * ignores clicks on a lower drawer when that drawer is nested. Clicking a lower
 * drawer, or the page behind the stack, closes the drawers in front of it.
 */
function handleDocumentClick(event: globalThis.MouseEvent) {
  const origin = pressOrigin;
  pressOrigin = null;

  if (
    !origin ||
    Math.hypot(event.clientX - origin.x, event.clientY - origin.y) >
      clickTolerancePx
  ) {
    return;
  }

  // Drawers that this press opened are not dismissed by it.
  const stack = openDrawerStack.slice(0, pressStackLength);
  const frontIndex = stack.length - 1;
  let clickedIndex = -1;

  for (let index = frontIndex; index >= 0; index -= 1) {
    const entry = stack[index];

    if (
      isPointInsideElement(entry.popupRef.current, event.clientX, event.clientY)
    ) {
      clickedIndex = index;
      break;
    }
  }

  if (clickedIndex === frontIndex) {
    return;
  }

  // An outside click on a single drawer is Base UI's job.
  if (clickedIndex === -1 && frontIndex === 0) {
    return;
  }

  const firstIndexToClose = clickedIndex === -1 ? frontIndex : clickedIndex + 1;

  for (let index = frontIndex; index >= firstIndexToClose; index -= 1) {
    const entry = stack[index];

    if (!entry.closeOnBackdropClickRef.current) {
      return;
    }

    entry.close();
  }
}

function addOpenDrawer(entry: DrawerStackEntry) {
  if (openDrawerStack.length === 0) {
    document.addEventListener('pointerdown', handleDocumentPointerDown, true);
    document.addEventListener('click', handleDocumentClick);
  }

  openDrawerStack.push(entry);
}

function removeOpenDrawer(entry: DrawerStackEntry) {
  const index = openDrawerStack.indexOf(entry);

  if (index !== -1) {
    openDrawerStack.splice(index, 1);
  }

  if (openDrawerStack.length === 0) {
    document.removeEventListener(
      'pointerdown',
      handleDocumentPointerDown,
      true,
    );
    document.removeEventListener('click', handleDocumentClick);
    pressOrigin = null;
  }
}

type ConsumerClickEvent = MouseEvent<HTMLElement> &
  Partial<Pick<BaseUIEvent<MouseEvent<HTMLElement>>, 'preventBaseUIHandler'>>;

const swipeDirectionBySide = {
  right: 'right',
  left: 'left',
  top: 'up',
  bottom: 'down',
} as const satisfies Record<DrawerSide, 'up' | 'down' | 'left' | 'right'>;

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(componentName: string) {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Drawer.`);
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
 * Root component that owns the open state of a modal drawer. Pass `open` and
 * `onOpenChange` for controlled use, or `defaultOpen` for uncontrolled use.
 * `side` sets the edge the drawer slides in from and the swipe-to-dismiss direction.
 */
function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  side = 'right',
  children,
}: DrawerProps) {
  const closeOnBackdropClickRef = useRef(true);
  const actionsRef = useRef<BaseDrawer.Root.Actions | null>(null);
  const popupRef = useRef<HTMLElement | null>(null);
  const stackEntry = useMemo<DrawerStackEntry>(
    () => ({
      popupRef,
      close: () => actionsRef.current?.close(),
      closeOnBackdropClickRef,
    }),
    [],
  );

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

/**
 * Opens the drawer when activated. Attributes and `onClick` of the single child
 * element are preserved; calling `preventDefault` in `onClick` skips opening.
 */
function DrawerTrigger({ children }: DrawerTriggerProps) {
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

/**
 * Separates `Drawer.Header` and `Drawer.Footer` from the remaining content, so
 * they stay outside the scroll container wherever a consumer places them.
 */
function partitionDrawerChildren(children: ReactNode) {
  const headers: ReactNode[] = [];
  const body: ReactNode[] = [];
  const footers: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === DrawerHeader) {
      headers.push(child);
    } else if (isValidElement(child) && child.type === DrawerFooter) {
      footers.push(child);
    } else {
      body.push(child);
    }
  }

  return { headers, body, footers };
}

/**
 * Renders the modal drawer surface with its backdrop. The body is the only
 * scroll container, so `Drawer.Header` and `Drawer.Footer` stay pinned to the
 * top and bottom. Escape, focus trapping, scroll locking, swipe-to-dismiss, and
 * focus restoration are handled by Base UI. Pass `className` and HTML attributes
 * to style or extend the surface element, which also receives the ref.
 */
const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(
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
    const { closeOnBackdropClickRef, side, stackEntry } =
      useDrawerContext('Drawer.Content');
    // Base UI reads this ref when a press lands outside the drawer, so it is
    // updated before the next pointer event rather than during render.
    useLayoutEffect(() => {
      closeOnBackdropClickRef.current = closeOnBackdropClick;
    }, [closeOnBackdropClick, closeOnBackdropClickRef]);

    const setPopupElement = useCallback(
      (element: HTMLDivElement | null) => {
        const previousElement = stackEntry.popupRef.current;
        stackEntry.popupRef.current = element;

        // Only a mounted popup is an open drawer, so registration follows the popup.
        if (previousElement && !element) {
          removeOpenDrawer(stackEntry);
        } else if (element && !previousElement) {
          addOpenDrawer(stackEntry);
        }

        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref, stackEntry],
    );

    const classes = [
      'notable-drawer',
      `notable-drawer--${side}`,
      `notable-drawer--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const { headers, body, footers } = partitionDrawerChildren(children);

    // The close button stays last in the DOM so the first tabbable element in
    // the body receives initial focus. Without a header, it sits in a toolbar
    // above the body instead of floating over content.
    const closeButton = showCloseButton ? (
      <BaseDrawer.Close
        render={
          <Button
            variant="ghost"
            size="icon"
            className="notable-drawer__close-button"
            aria-label="Close drawer"
          />
        }
      >
        <X aria-hidden="true" />
      </BaseDrawer.Close>
    ) : null;

    return (
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="notable-drawer__backdrop" />
        <BaseDrawer.Viewport className="notable-drawer__viewport">
          <BaseDrawer.Popup
            {...props}
            ref={setPopupElement}
            className={classes}
          >
            {headers}
            <BaseDrawer.Content className="notable-drawer__body">
              {body}
            </BaseDrawer.Content>
            {footers}
            {headers.length > 0
              ? closeButton
              : closeButton && (
                  <div className="notable-drawer__toolbar">{closeButton}</div>
                )}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    );
  },
);

function isPointInsideElement(
  element: HTMLElement | null,
  x: number,
  y: number,
) {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/** Lays out the title and description at the top of the drawer. Stays pinned while the body scrolls. */
function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return (
    <div
      {...props}
      className={['notable-drawer__header', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/** Accessible name of the drawer. Renders an `h2` linked to the popup. */
function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  useDrawerContext('Drawer.Title');

  return (
    <BaseDrawer.Title
      {...props}
      className={['notable-drawer__title', className].filter(Boolean).join(' ')}
    />
  );
}

/** Accessible description of the drawer. Linked to the popup automatically. */
function DrawerDescription({ className, ...props }: DrawerDescriptionProps) {
  useDrawerContext('Drawer.Description');

  return (
    <BaseDrawer.Description
      {...props}
      className={['notable-drawer__description', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/** Lays out action buttons at the bottom of the drawer. Stays pinned while the body scrolls. */
function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return (
    <div
      {...props}
      className={['notable-drawer__footer', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/**
 * Closes the drawer when activated. Renders an outline `Button` by default and
 * always uses `type="button"`, so it never submits a surrounding form.
 */
function DrawerClose({ onClick, ...props }: DrawerCloseProps) {
  useDrawerContext('Drawer.Close');

  return (
    <BaseDrawer.Close
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
 * Compound modal drawer built on Base UI. Compose `Drawer.Trigger`,
 * `Drawer.Content`, `Drawer.Header`, `Drawer.Title`, `Drawer.Description`,
 * `Drawer.Footer`, and `Drawer.Close` inside the root.
 */
export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Close: DrawerClose,
});
