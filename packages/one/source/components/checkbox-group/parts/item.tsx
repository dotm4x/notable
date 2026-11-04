import { forwardRef } from 'react';
import { Checkbox } from '../../checkbox/checkbox.js';
import { useCheckboxGroupContext } from '../context.js';
import type { CheckboxGroupItemProps } from '../types.js';

export const CheckboxGroupItem = forwardRef<
  HTMLInputElement,
  CheckboxGroupItemProps
>(function CheckboxGroupItem(
  { disabled: itemDisabled = false, value, ...props },
  ref,
) {
  const group = useCheckboxGroupContext();
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
});
