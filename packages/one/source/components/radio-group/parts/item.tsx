import { forwardRef, useId, type ChangeEvent } from 'react';
import { useRadioGroupContext } from '../context.js';
import type { RadioGroupItemProps } from '../types.js';

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
    const group = useRadioGroupContext('RadioGroupItem');
    const generatedId = useId();
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
        className="one-radio-group__item"
        data-disabled={disabled || undefined}
      >
        <label className="one-radio-group__option" htmlFor={inputId}>
          <span className="one-radio-group__control">
            <input
              {...props}
              ref={ref}
              id={inputId}
              type="radio"
              name={group.name}
              value={value}
              className={['one-radio-group__input', className]
                .filter(Boolean)
                .join(' ')}
              checked={group.selectedValue === value}
              onChange={handleChange}
              disabled={disabled}
              required={group.required}
              aria-describedby={describedBy}
            />
            <span className="one-radio-group__indicator" aria-hidden="true" />
          </span>
          {label && <span className="one-radio-group__text">{label}</span>}
        </label>
        {description && (
          <span
            className="one-radio-group__item-description"
            id={descriptionId}
          >
            {description}
          </span>
        )}
      </div>
    );
  },
);
