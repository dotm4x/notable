import { forwardRef, useId, useState } from 'react';
import {
  CheckboxGroupContext,
  type CheckboxGroupContextValue,
} from '../context.js';
import type { CheckboxGroupProps } from '../types.js';

export const CheckboxGroupRoot = forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(function CheckboxGroup(
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
  const [uncontrolledValue, setUncontrolledValue] = useState<readonly string[]>(
    defaultValue ?? [],
  );
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
        className={['one-checkbox-group', className].filter(Boolean).join(' ')}
        aria-describedby={describedBy}
        disabled={disabled}
        data-disabled={disabled || undefined}
      >
        {label && (
          <legend className="one-checkbox-group__label">{label}</legend>
        )}
        {description && (
          <span className="one-checkbox-group__description" id={descriptionId}>
            {description}
          </span>
        )}
        <div className="one-checkbox-group__options">{children}</div>
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
});
