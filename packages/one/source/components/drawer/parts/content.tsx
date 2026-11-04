import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { X } from '../../../icons';
import {
  Children,
  forwardRef,
  isValidElement,
  useLayoutEffect,
  type ReactNode,
} from 'react';
import { Button } from '../../button/button.js';
import { useDrawerContext } from '../context.js';
import { useDrawerPopupRegistration } from '../hooks/use-drawer-stack.js';
import type { DrawerContentProps } from '../types.js';
import { DrawerFooter, DrawerHeader } from './sections.js';

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

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
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

    const setPopupElement = useDrawerPopupRegistration(stackEntry, ref);

    const classes = [
      'one-drawer',
      `one-drawer--${side}`,
      `one-drawer--${size}`,
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
            className="one-drawer__close-button"
            aria-label="Close drawer"
          />
        }
      >
        <X aria-hidden="true" />
      </BaseDrawer.Close>
    ) : null;

    return (
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="one-drawer__backdrop" />
        <BaseDrawer.Viewport className="one-drawer__viewport">
          <BaseDrawer.Popup
            {...props}
            ref={setPopupElement}
            className={classes}
          >
            {headers}
            <BaseDrawer.Content className="one-drawer__body">
              {body}
            </BaseDrawer.Content>
            {footers}
            {headers.length > 0
              ? closeButton
              : closeButton && (
                  <div className="one-drawer__toolbar">{closeButton}</div>
                )}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    );
  },
);
