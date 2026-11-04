import type { ReactNode } from 'react';

type TAccordionBaseProps = {
  /** Accordion items, rendered with `Accordion.Item`. */
  children: ReactNode;
  /** Additional CSS class for the root element. */
  className?: string;
  /** Disables every item. Defaults to `false`. */
  disabled?: boolean;
};

/** Props for {@link Accordion} in single mode, where at most one item is expanded. */
export type AccordionSingleProps = TAccordionBaseProps & {
  type: 'single';
  /**
   * Value of the expanded item, or `null` when none is expanded. Omit the
   * prop entirely to let the accordion manage its own state.
   */
  value?: string | null;
  /** Expanded item in uncontrolled mode. Defaults to `null`. */
  defaultValue?: string | null;
  /** Called with the value of the newly expanded item, or `null` when it collapses. */
  onValueChange?: (value: string | null) => void;
};

/** Props for {@link Accordion} in multiple mode, where any number of items may be expanded. */
export type AccordionMultipleProps = TAccordionBaseProps & {
  type: 'multiple';
  /** Values of the expanded items. Omit the prop to let the accordion manage its own state. */
  value?: string[];
  /** Expanded items in uncontrolled mode. Defaults to `[]`. */
  defaultValue?: string[];
  /** Called with the values of all expanded items after each change. */
  onValueChange?: (value: string[]) => void;
};

/** Props for {@link Accordion}. */
export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

/** Props for `Accordion.Item`. */
export type AccordionItemProps = {
  /** Content shown when the item is expanded. */
  children: ReactNode;
  /** Additional CSS class for the item element. */
  className?: string;
  /** Prevents the item from being toggled. Defaults to `false`. */
  disabled?: boolean;
  /** Trigger label. */
  title: ReactNode;
  /** Stable identifier used for expansion state. */
  value: string;
};
