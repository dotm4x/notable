import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from 'react';
import { Checkbox, type CheckboxProps } from './checkbox.js';
import './checkbox-group.css';

type CheckboxGroupContextValue = {
  selectedValues: readonly string[];
  disabled: boolean;
  onToggle: (value: string, checked: boolean) => void;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null,
);

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

const CheckboxGroupRoot = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroup(
    {
      className,
      children,
      defaultValue,
      description,
      disabled = false,
      label,
      onValueChange,
      value,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const groupId = useId();
    const [uncontrolledValue, setUncontrolledValue] = useState<
      readonly string[]
    >(defaultValue ?? []);
    const isControlled = value !== undefined;
    const selectedValues = isControlled ? value : uncontrolledValue;
    const descriptionId = description ? `${groupId}-description` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;

    const contextValue: CheckboxGroupContextValue = {
      selectedValues,
      disabled,
      onToggle: (itemValue, checked) => {
        const remainingValues = selectedValues.filter(
          (selectedValue) => selectedValue !== itemValue,
        );
        const nextValues = checked
          ? [...remainingValues, itemValue]
          : remainingValues;

        if (!isControlled) {
          setUncontrolledValue(nextValues);
        }
        onValueChange?.(nextValues);
      },
    };

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <fieldset
          {...props}
          ref={ref}
          className={['notable-checkbox-group', className]
            .filter(Boolean)
            .join(' ')}
          aria-describedby={describedBy}
          disabled={disabled}
          data-disabled={disabled || undefined}
        >
          {label && (
            <legend className="notable-checkbox-group__label">{label}</legend>
          )}
          {description && (
            <span
              className="notable-checkbox-group__description"
              id={descriptionId}
            >
              {description}
            </span>
          )}
          <div className="notable-checkbox-group__options">{children}</div>
        </fieldset>
      </CheckboxGroupContext.Provider>
    );
  },
);

const CheckboxGroupItem = forwardRef<HTMLInputElement, CheckboxGroupItemProps>(
  function CheckboxGroupItem(
    { disabled: itemDisabled = false, value, ...props },
    ref,
  ) {
    const group = useContext(CheckboxGroupContext);

    if (!group) {
      throw new Error(
        'CheckboxGroup.Item must be rendered inside a CheckboxGroup.',
      );
    }

    const disabled = group.disabled || itemDisabled;

    return (
      <Checkbox
        {...props}
        ref={ref}
        value={value}
        checked={group.selectedValues.includes(value)}
        disabled={disabled}
        onChange={(event) => {
          group.onToggle(value, event.currentTarget.checked);
        }}
      />
    );
  },
);

/** Compound checkbox group: `CheckboxGroup` is the root and `CheckboxGroup.Item` its options. */
export const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Item: CheckboxGroupItem,
});
