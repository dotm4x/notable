import type { HTMLAttributes } from 'react';

/** Props for {@link NumberFlow}, in addition to native `span` attributes. */
export type NumberFlowProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> & {
  /** Number to display. Changes animate digit by digit. */
  value: number;
  /** Options passed to `Intl.NumberFormat`, such as currency or percent styles. */
  format?: Intl.NumberFormatOptions;
  /** BCP 47 locale for grouping and numerals. Defaults to the platform locale. */
  locale?: string;
  /** Transition duration in milliseconds. Defaults to the base motion duration. */
  duration?: number;
  /** Additional CSS class for the root element. */
  className?: string;
};
