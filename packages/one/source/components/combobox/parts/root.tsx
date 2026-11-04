import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { forwardRef, useMemo } from 'react';
import { Input } from '../../input/input.js';
import type {
  ComboboxInputProps,
  ComboboxOption,
  ComboboxProps,
} from '../types.js';

export function ComboboxRoot({
  items,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  readOnly,
  required,
  name,
  children,
}: ComboboxProps) {
  const collection = useMemo(
    () =>
      BaseCombobox.createItems<ComboboxOption, string>(items, {
        getValue: (option) => option.value,
        getLabel: (option) => option.label,
      }),
    [items],
  );

  return (
    <BaseCombobox.Root
      items={collection}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      name={name}
    >
      {children}
    </BaseCombobox.Root>
  );
}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(
    {
      children,
      className,
      description,
      error,
      invalid,
      label,
      leadingIcon,
      ...props
    },
    ref,
  ) {
    return (
      <BaseCombobox.Input
        ref={ref}
        className={className}
        render={
          <Input
            description={description}
            error={error}
            invalid={invalid}
            label={label}
            leadingIcon={leadingIcon}
            trailingIcon={children}
            trailingIconInteractive
          />
        }
        {...props}
      />
    );
  },
);
