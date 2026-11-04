import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { forwardRef } from 'react';
import { ChevronDown, X } from '../../../icons';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type { ComboboxClearProps, ComboboxTriggerProps } from '../types.js';

export const ComboboxTrigger = forwardRef<
  HTMLButtonElement,
  ComboboxTriggerProps
>(function ComboboxTrigger({ children, className, ...props }, ref) {
  return (
    <BaseCombobox.Trigger
      ref={ref}
      className={joinClassNames('one-combobox__trigger', className)}
      aria-label={props['aria-label'] ?? 'Show options'}
      {...props}
    >
      {children ?? <ChevronDown size={16} aria-hidden="true" />}
    </BaseCombobox.Trigger>
  );
});

export const ComboboxClear = forwardRef<HTMLButtonElement, ComboboxClearProps>(
  function ComboboxClear({ children, className, ...props }, ref) {
    return (
      <BaseCombobox.Clear
        ref={ref}
        className={joinClassNames('one-combobox__clear', className)}
        aria-label={props['aria-label'] ?? 'Clear selection'}
        {...props}
      >
        {children ?? <X size={16} aria-hidden="true" />}
      </BaseCombobox.Clear>
    );
  },
);
