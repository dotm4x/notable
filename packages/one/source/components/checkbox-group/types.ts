import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import type { CheckboxProps } from '../checkbox/checkbox.js';

/** Props for a checkbox group. Use `value` with `onValueChange` for controlled state or `defaultValue` for uncontrolled state. */
export type CheckboxGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'defaultValue' | 'onChange' | 'value'
> & {
  /** Visible group label, rendered as the fieldset legend. */
  label?: ReactNode;
  /** Helper text associated with the group for assistive technologies. */
  description?: ReactNode;
  /** Values selected initially when the group is uncontrolled. Defaults to none. */
  defaultValue?: readonly string[];
  /** Selected values when the group is controlled. */
  value?: readonly string[];
  /** Called with the complete list of selected values after each user change. */
  onValueChange?: (value: string[]) => void;
  /** Disables every option in the group. Defaults to `false`. */
  disabled?: boolean;
};

/** Props for a single option within a `CheckboxGroup`. */
export type CheckboxGroupItemProps = Omit<
  CheckboxProps,
  'checked' | 'defaultChecked' | 'indeterminate' | 'onChange'
> & {
  /** Value included in the group's selection when this option is checked. */
  value: string;
};
