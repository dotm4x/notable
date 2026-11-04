import { Select as BaseSelect } from '@base-ui/react/select';
import { Children, isValidElement, type ReactNode } from 'react';
import type { SelectProps } from '../types.js';
import { SelectItem } from './item.js';

/**
 * Maps each option value to its label by walking the declared `Select.Item`
 * children. Base UI needs this to show the selected label while the popup is
 * closed, such as for a `defaultValue`.
 */
function collectItemLabels(
  children: ReactNode,
  labels: Record<string, ReactNode> = {},
): Record<string, ReactNode> {
  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: unknown; children?: ReactNode }>(child)) {
      return;
    }
    if (child.type === SelectItem && typeof child.props.value === 'string') {
      labels[child.props.value] = child.props.children;
      return;
    }
    collectItemLabels(child.props.children, labels);
  });
  return labels;
}

export function SelectRoot({
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
}: SelectProps) {
  return (
    <BaseSelect.Root
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
      items={collectItemLabels(children)}
    >
      {children}
    </BaseSelect.Root>
  );
}
