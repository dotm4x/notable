import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { selectEdgeRadioOnKeyDown } from '../../internal/helpers/radio-edge-keys.js';
import './radio-group.css';

/** Available sizes for a radio group. */
export type RadioGroupSize = 'small' | 'medium' | 'large';

/** Direction in which the radio options are laid out. */
export type RadioGroupOrientation = 'horizontal' | 'vertical';

type RadioGroupContextValue = {
  name: string;
  selectedValue: string | undefined;
  disabled: boolean;
  required: boolean;
  onSelect: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

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

/**
 * Renders a native radio group inside a fieldset. Arrow-key navigation, focus
 * management, and form submission are handled by the browser's native radios.
 */
const RadioGroupRoot = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroup(
    {
      className,
      children,
      defaultValue,
      description,
      disabled = false,
      label,
      name,
      onValueChange,
      orientation = 'vertical',
      required = false,
      size = 'medium',
      value,
      'aria-describedby': ariaDescribedBy,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const generatedName = useId();
    const groupId = useId();
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : uncontrolledValue;
    const descriptionId = description ? `${groupId}-description` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;

    const contextValue: RadioGroupContextValue = {
      name: name ?? generatedName,
      selectedValue,
      disabled,
      required,
      onSelect: (nextValue) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
    };

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <fieldset
          {...props}
          ref={ref}
          className={[
            'notable-radio-group',
            `notable-radio-group--${size}`,
            `notable-radio-group--${orientation}`,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-describedby={describedBy}
          disabled={disabled}
          data-disabled={disabled || undefined}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) {
              selectEdgeRadioOnKeyDown(event);
            }
          }}
        >
          {label && (
            <legend className="notable-radio-group__label">{label}</legend>
          )}
          {description && (
            <span
              className="notable-radio-group__description"
              id={descriptionId}
            >
              {description}
            </span>
          )}
          <div className="notable-radio-group__options">{children}</div>
        </fieldset>
      </RadioGroupContext.Provider>
    );
  },
);

/**
 * Renders a native radio option. Must be placed inside a `RadioGroup`.
 * Forwards its ref to the native input.
 */
export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  function RadioGroupItem(
    {
      className,
      description,
      disabled: itemDisabled = false,
      id,
      label,
      onChange,
      value,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const group = useContext(RadioGroupContext);
    const generatedId = useId();

    if (!group) {
      throw new Error('RadioGroupItem must be rendered inside a RadioGroup.');
    }

    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;
    const disabled = group.disabled || itemDisabled;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      group.onSelect(value);
    };

    return (
      <div
        className="notable-radio-group__item"
        data-disabled={disabled || undefined}
      >
        <label className="notable-radio-group__option" htmlFor={inputId}>
          <span className="notable-radio-group__control">
            <input
              {...props}
              ref={ref}
              id={inputId}
              type="radio"
              name={group.name}
              value={value}
              className={['notable-radio-group__input', className]
                .filter(Boolean)
                .join(' ')}
              checked={group.selectedValue === value}
              onChange={handleChange}
              disabled={disabled}
              required={group.required}
              aria-describedby={describedBy}
            />
            <span
              className="notable-radio-group__indicator"
              aria-hidden="true"
            />
          </span>
          {label && <span className="notable-radio-group__text">{label}</span>}
        </label>
        {description && (
          <span
            className="notable-radio-group__item-description"
            id={descriptionId}
          >
            {description}
          </span>
        )}
      </div>
    );
  },
);

/** Compound radio group: `RadioGroup` is the root and `RadioGroup.Item` its options. */
export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});
