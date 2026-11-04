import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { forwardRef } from 'react';
import { Check } from '../../../icons';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  ComboboxGroupLabelProps,
  ComboboxGroupProps,
  ComboboxItemProps,
  ComboboxSeparatorProps,
} from '../types.js';

export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  function ComboboxItem({ className, children, ...props }, ref) {
    return (
      <BaseCombobox.Item
        ref={ref}
        className={joinClassNames('one-combobox__item', className)}
        {...props}
      >
        <span className="one-combobox__item-text">{children}</span>
        <BaseCombobox.ItemIndicator className="one-combobox__item-indicator">
          <Check size={16} aria-hidden="true" />
        </BaseCombobox.ItemIndicator>
      </BaseCombobox.Item>
    );
  },
);

export const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  function ComboboxGroup({ className, ...props }, ref) {
    return (
      <BaseCombobox.Group
        ref={ref}
        className={joinClassNames('one-combobox__group', className)}
        {...props}
      />
    );
  },
);

export const ComboboxGroupLabel = forwardRef<
  HTMLDivElement,
  ComboboxGroupLabelProps
>(function ComboboxGroupLabel({ className, ...props }, ref) {
  return (
    <BaseCombobox.GroupLabel
      ref={ref}
      className={joinClassNames('one-combobox__group-label', className)}
      {...props}
    />
  );
});

export const ComboboxSeparator = forwardRef<
  HTMLDivElement,
  ComboboxSeparatorProps
>(function ComboboxSeparator({ className, ...props }, ref) {
  return (
    <BaseCombobox.Separator
      ref={ref}
      className={joinClassNames('one-combobox__separator', className)}
      {...props}
    />
  );
});
