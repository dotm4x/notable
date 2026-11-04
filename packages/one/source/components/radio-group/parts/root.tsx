import { forwardRef, useId, useState } from 'react';
import { selectEdgeRadioOnKeyDown } from '../../../internal/helpers/radio-edge-keys.js';
import { RadioGroupContext } from '../context.js';
import type { RadioGroupProps } from '../types.js';

export const RadioGroupRoot = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroupRoot(
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

    const contextValue = {
      name: name ?? generatedName,
      selectedValue,
      disabled,
      required,
      onSelect: (nextValue: string) => {
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
            'one-radio-group',
            `one-radio-group--${size}`,
            `one-radio-group--${orientation}`,
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
          {label && <legend className="one-radio-group__label">{label}</legend>}
          {description && (
            <span className="one-radio-group__description" id={descriptionId}>
              {description}
            </span>
          )}
          <div className="one-radio-group__options">{children}</div>
        </fieldset>
      </RadioGroupContext.Provider>
    );
  },
);
