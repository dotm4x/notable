import { Popover as BasePopover } from '@base-ui/react/popover';
import {
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button, type ButtonProps } from '../button/button.js';
import '../../internal/styles/floating-surface.css';
import './popover.css';

/** Side of the trigger where the popover is placed. */
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

/** Alignment of the popover along the chosen side. */
export type PopoverAlign = 'start' | 'center' | 'end';

/** Props for the {@link Popover} root component. */
export type PopoverProps = {
  /** Controlled open state. Omit to let the popover manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Popover parts, such as `Popover.Trigger` and `Popover.Content`. */
  children?: ReactNode;
};

/** Props for `Popover.Trigger`. */
export type PopoverTriggerProps = {
  /** A single element that toggles the popover. Other content is wrapped in a `Button`. */
  children: ReactNode;
};

/** Props for `Popover.Content`, which renders the non-modal popup. */
export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Side of the trigger where the popup appears. Defaults to `bottom`. */
  side?: PopoverSide;
  /** Alignment along the chosen side. Defaults to `center`. */
  align?: PopoverAlign;
  /** Distance in pixels between the trigger and the popup. Defaults to `8`. */
  sideOffset?: number;
  /** Distance in pixels to shift the popup along the aligned edge. Defaults to `0`. */
  alignOffset?: number;
};

/** Props for `Popover.Header`. */
export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Popover.Title`. */
export type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for `Popover.Description`. */
export type PopoverDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Props for `Popover.Close`. Always renders with `type="button"`. */
export type PopoverCloseProps = ButtonProps;

function PopoverRoot({
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

/**
 * Toggles the popover when activated. Attributes and `onClick` of the single
 * child element are preserved and merged with Base UI's handlers.
 */
function PopoverTrigger({ children }: PopoverTriggerProps) {
  const trigger = isValidElement(children) ? (
    children
  ) : (
    <Button>{children}</Button>
  );

  return <BasePopover.Trigger render={trigger} />;
}

/**
 * Renders the popup in a portal, positioned next to the trigger. Escape and
 * outside presses close it, and Base UI manages focus and ARIA relationships.
 * Pass `ref`, `className`, and HTML attributes to extend the popup element.
 */
const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    {
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      alignOffset = 0,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const classes = ['notable-popover', 'notable-floating-surface', className]
      .filter(Boolean)
      .join(' ');

    return (
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <BasePopover.Popup {...props} ref={ref} className={classes}>
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    );
  },
);

/** Lays out the title and description at the top of the popover. */
function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
      {...props}
      className={['notable-popover__header', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/** Accessible name of the popover. Renders an `h2` linked to the popup. */
function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <BasePopover.Title
      {...props}
      className={['notable-popover__title', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/** Accessible description of the popover. Linked to the popup automatically. */
function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <BasePopover.Description
      {...props}
      className={['notable-popover__description', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/**
 * Closes the popover when activated. Renders an outline `Button` by default and
 * always uses `type="button"`, so it never submits a surrounding form.
 */
function PopoverClose(props: PopoverCloseProps) {
  return (
    <BasePopover.Close
      render={<Button variant="outline" {...props} type="button" />}
    />
  );
}

/**
 * Compound non-modal popover built on Base UI. Compose `Popover.Trigger`,
 * `Popover.Content`, `Popover.Header`, `Popover.Title`, `Popover.Description`,
 * and `Popover.Close` inside the root.
 */
export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
});
