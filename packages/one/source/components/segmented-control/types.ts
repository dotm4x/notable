import type { HTMLAttributes, ReactNode } from 'react';

/** Available segmented control sizes. */
export type SegmentedControlSize = 'small' | 'medium' | 'large';

/** A selectable option in a {@link SegmentedControl}. */
export type SegmentedControlOption<TValue extends string = string> = {
  /** Visible label content. */
  label: ReactNode;
  /** Unique value for this option. */
  value: TValue;
  /** Whether this option is disabled. */
  disabled?: boolean;
  /** Optional icon displayed alongside the label. */
  icon?: ReactNode;
  /** Optional explicit accessible name for the option. */
  'aria-label'?: string;
};

/** Props for a single-selection options group. */
export type SegmentedControlProps<TValue extends string = string> = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> & {
  /** Options displayed in the group. */
  options: readonly SegmentedControlOption<TValue>[];
  /** Selected value in controlled mode. */
  value?: TValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: TValue;
  /** Called with the selected value when the selection changes. */
  onChange?: (value: TValue) => void;
  /** Disables all options. */
  disabled?: boolean;
  /** Visual size. Defaults to `medium`. */
  size?: SegmentedControlSize;
  /** Name shared by native radio inputs for form submission. */
  name?: string;
  /** Optional visible group label rendered above the control. */
  label?: ReactNode;
};
