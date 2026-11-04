import type {
  FieldsetHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

/** Available sizes for a radio group. */
export type RadioGroupSize = 'small' | 'medium' | 'large';

/** Direction in which the radio options are laid out. */
export type RadioGroupOrientation = 'horizontal' | 'vertical';

/** Props for a radio group. Use `value` with `onValueChange` for controlled state or `defaultValue` for uncontrolled state. */
export type RadioGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'defaultValue' | 'name' | 'onChange' | 'value'
> & {
  /** Shared form name for every radio in the group. Generated when omitted. */
  name?: string;
  /** Visible group label, rendered as the fieldset legend. */
  label?: ReactNode;
  /** Helper text associated with the group for assistive technologies. */
  description?: ReactNode;
  /** Value selected initially when the group is uncontrolled. */
  defaultValue?: string;
  /** Selected value when the group is controlled. */
  value?: string;
  /** Called with the newly selected value when the user changes the selection. */
  onValueChange?: (value: string) => void;
  /** Disables every option in the group. Defaults to `false`. */
  disabled?: boolean;
  /** Requires one option to be selected before form submission. Defaults to `false`. */
  required?: boolean;
  /** Layout direction of the options. Defaults to `vertical`. */
  orientation?: RadioGroupOrientation;
  /** Visual size of the options. Defaults to `medium`. */
  size?: RadioGroupSize;
};

/** Props for a single radio option within a `RadioGroup`. */
export type RadioGroupItemProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'name' | 'size' | 'type'
> & {
  /** Value submitted with the form when this option is selected. */
  value: string;
  /** Visible label associated with the option. */
  label?: ReactNode;
  /** Helper text associated with the option for assistive technologies. */
  description?: ReactNode;
};
