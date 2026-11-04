import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { forwardRef } from 'react';
import { ToggleGroupStyleContext } from '../context.js';
import { hasEmptyValue } from '../helpers/values.js';
import type { TToggleGroupProps } from '../types.js';

export const ToggleGroupRoot = forwardRef<HTMLDivElement, TToggleGroupProps>(
  function ToggleGroupRoot(
    {
      children,
      className,
      disabled = false,
      orientation = 'horizontal',
      size = 'medium',
      variant = 'default',
      type,
      value: selectedValue,
      defaultValue: initialValue,
      onValueChange: onSelectionChange,
      ...baseProps
    },
    ref,
  ) {
    if (hasEmptyValue(selectedValue) || hasEmptyValue(initialValue)) {
      throw new Error('ToggleGroup values must be non-empty strings.');
    }

    const isControlled = selectedValue !== undefined;
    let value: readonly string[] | undefined;
    let defaultValue: readonly string[] | undefined;
    let onValueChange: ((value: string[]) => void) | undefined;

    if (type === 'single') {
      value =
        selectedValue === undefined
          ? undefined
          : selectedValue === null
            ? []
            : [selectedValue];
      defaultValue = initialValue === undefined ? undefined : [initialValue];
      onValueChange = (nextValue) => {
        onSelectionChange?.(nextValue[0] ?? null);
      };
    } else {
      value = selectedValue;
      defaultValue = initialValue;
      onValueChange = (nextValue) => onSelectionChange?.(nextValue);
    }

    return (
      <ToggleGroupStyleContext.Provider value={{ variant, size }}>
        <BaseToggleGroup
          {...baseProps}
          ref={ref}
          className={['one-toggle-group', className].filter(Boolean).join(' ')}
          disabled={disabled}
          orientation={orientation}
          multiple={type === 'multiple'}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onValueChange={onValueChange}
        >
          {children}
        </BaseToggleGroup>
      </ToggleGroupStyleContext.Provider>
    );
  },
);
