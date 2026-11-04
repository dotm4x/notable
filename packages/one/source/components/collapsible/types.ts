import type {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

/** Props for {@link Collapsible}, in addition to native `div` attributes. */
export type CollapsibleProps = HTMLAttributes<HTMLDivElement> & {
  /** Trigger and content of the collapsible. */
  children?: ReactNode;
  /** Expanded state for controlled use. Omit it to let the component manage its own state. */
  open?: boolean;
  /** Expanded state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the new expanded state whenever the trigger opens or closes the content. */
  onOpenChange?: (open: boolean) => void;
  /** Prevents the trigger from opening or closing the content. Defaults to `false`. */
  disabled?: boolean;
};

/** Props for {@link CollapsibleTrigger}, in addition to native `button` attributes. */
export type CollapsibleTriggerProps = ComponentPropsWithoutRef<'button'>;

/** Props for {@link CollapsibleContent}, in addition to native `div` attributes. */
export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement>;
