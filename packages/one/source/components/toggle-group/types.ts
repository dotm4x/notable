import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import type { TToggleSize, TToggleVariant } from '../toggle/toggle.js';

/** Selection mode for a toggle group. */
export type TToggleGroupType = 'single' | 'multiple';

/** Direction in which the toggle items are laid out. */
export type TToggleGroupOrientation = 'horizontal' | 'vertical';

type TToggleGroupBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'value'
> & {
  /** Disables every item in the group. Defaults to `false`. */
  disabled?: boolean;
  /** Layout direction. Defaults to `horizontal`. */
  orientation?: TToggleGroupOrientation;
  /** Visual appearance inherited by each item. Defaults to `default`. */
  variant?: TToggleVariant;
  /** Visual size inherited by each item. Defaults to `medium`. */
  size?: TToggleSize;
};

/** Props for a single-selection toggle group. */
export type TToggleGroupSingleProps = TToggleGroupBaseProps & {
  /** Enables exclusive single selection. */
  type: 'single';
  /** Selected non-empty item value, or `null` for no selection. */
  value?: string | null;
  /** Initial non-empty item value in uncontrolled mode. */
  defaultValue?: string;
  /** Called with the selected value, or `null` when the selection is cleared. */
  onValueChange?: (value: string | null) => void;
};

/** Props for a multiple-selection toggle group. */
export type TToggleGroupMultipleProps = TToggleGroupBaseProps & {
  /** Enables independent multiple selection. */
  type: 'multiple';
  /** Selected non-empty item values in controlled mode. */
  value?: readonly string[];
  /** Initial non-empty item values in uncontrolled mode. */
  defaultValue?: readonly string[];
  /** Called with the complete list of selected values after a change. */
  onValueChange?: (value: string[]) => void;
};

/** Props for a single- or multiple-selection toggle group. */
export type TToggleGroupProps =
  TToggleGroupSingleProps | TToggleGroupMultipleProps;

/** Props for an individual toggle button within a `ToggleGroup`. */
export type TToggleGroupItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-pressed' | 'value'
> & {
  /** Non-empty value represented by this item. */
  value: string;
};
