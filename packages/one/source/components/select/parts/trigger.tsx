import { Select as BaseSelect } from '@base-ui/react/select';
import { forwardRef } from 'react';
import { ChevronDown } from '../../../icons';
import { AutoSize } from '../../../internal/primitives/auto-size/auto-size.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  SelectIconProps,
  SelectLabelProps,
  SelectTriggerProps,
  SelectValueProps,
} from '../types.js';

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  function SelectLabel({ className, ...props }, ref) {
    return (
      <BaseSelect.Label
        ref={ref}
        className={joinClassNames('one-select__label', className)}
        {...props}
      />
    );
  },
);

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, ...props }, ref) {
    return (
      <BaseSelect.Trigger
        ref={ref}
        className={joinClassNames('one-select__trigger', className)}
        {...props}
      />
    );
  },
);

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue({ className, ...props }, ref) {
    return (
      <AutoSize axis="horizontal" className="one-select__value-container">
        <BaseSelect.Value
          ref={ref}
          className={joinClassNames('one-select__value', className)}
          {...props}
        />
      </AutoSize>
    );
  },
);

export const SelectIcon = forwardRef<HTMLSpanElement, SelectIconProps>(
  function SelectIcon({ className, children, ...props }, ref) {
    return (
      <BaseSelect.Icon
        ref={ref}
        className={joinClassNames('one-select__icon', className)}
        {...props}
      >
        {children ?? <ChevronDown size={16} aria-hidden="true" />}
      </BaseSelect.Icon>
    );
  },
);
