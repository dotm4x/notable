import { Select as BaseSelect } from '@base-ui/react/select';
import { forwardRef } from 'react';
import { Check } from '../../../icons';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  SelectGroupLabelProps,
  SelectGroupProps,
  SelectItemProps,
  SelectSeparatorProps,
} from '../types.js';

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem({ className, children, ...props }, ref) {
    return (
      <BaseSelect.Item
        ref={ref}
        className={joinClassNames('one-select__item', className)}
        {...props}
      >
        <BaseSelect.ItemText className="one-select__item-text">
          {children}
        </BaseSelect.ItemText>
        <BaseSelect.ItemIndicator className="one-select__item-indicator">
          <Check size={16} aria-hidden="true" />
        </BaseSelect.ItemIndicator>
      </BaseSelect.Item>
    );
  },
);

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  function SelectGroup({ className, ...props }, ref) {
    return (
      <BaseSelect.Group
        ref={ref}
        className={joinClassNames('one-select__group', className)}
        {...props}
      />
    );
  },
);

export const SelectGroupLabel = forwardRef<
  HTMLDivElement,
  SelectGroupLabelProps
>(function SelectGroupLabel({ className, ...props }, ref) {
  return (
    <BaseSelect.GroupLabel
      ref={ref}
      className={joinClassNames('one-select__group-label', className)}
      {...props}
    />
  );
});

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  function SelectSeparator({ className, ...props }, ref) {
    return (
      <BaseSelect.Separator
        ref={ref}
        className={joinClassNames('one-select__separator', className)}
        {...props}
      />
    );
  },
);
