import type { HTMLAttributes, ReactNode } from 'react';

/** Props for {@link Disclosure}, in addition to native `div` attributes. */
export type TDisclosureProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** Visible label of the trigger. */
  title: ReactNode;
  /** Content revealed when the section is open. */
  children?: ReactNode;
  /** Expanded state for controlled use. Omit it to let the component manage its own state. */
  open?: boolean;
  /** Expanded state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the new expanded state whenever the trigger toggles. */
  onOpenChange?: (open: boolean) => void;
  /** Prevents the trigger from opening or closing the content. Defaults to `false`. */
  disabled?: boolean;
};
