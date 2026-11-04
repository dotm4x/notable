import type { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Props for the select root. Options are declared as `Select.Item` children. */
export type SelectProps = {
  /** Selected option value. Pass `null` for no selection. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Field name used when the select is submitted with a form. */
  name?: string;
  children?: ReactNode;
};

/** Base UI props with `className` narrowed to a string, since One composes class names directly. */
type TWithStringClassName<TProps extends { className?: unknown }> = Omit<
  TProps,
  'className'
> & { className?: string };

export type SelectLabelProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Label>
>;

export type SelectTriggerProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>;

export type SelectValueProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Value>
>;

export type SelectIconProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Icon>
>;

export type SelectContentProps = ComponentPropsWithoutRef<'div'> & {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
};

export type SelectListProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.List>
>;

export type SelectItemProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Item>
>;

export type SelectGroupProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Group>
>;

export type SelectGroupLabelProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>;

export type SelectSeparatorProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Separator>
>;
