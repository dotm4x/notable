import type { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { InputProps } from '../input/input.js';

/** A selectable option. `value` identifies it; `label` is shown and matched against the query. */
export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

/** A labeled set of options rendered under a group heading. */
export type ComboboxOptionGroup = {
  label: string;
  items: readonly ComboboxOption[];
};

/** Props for the combobox root. `items` is either a flat list of options or a list of groups. */
export type ComboboxProps = {
  items: readonly ComboboxOption[] | readonly ComboboxOptionGroup[];
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
  name?: string;
  children?: ReactNode;
};

export type ComboboxInputProps = Omit<
  InputProps,
  'children' | 'trailingIcon'
> & {
  /** Trailing controls, such as `Combobox.Clear` and `Combobox.Trigger`. */
  children?: ReactNode;
};

/** Base UI props with `className` narrowed to a string, since One composes class names directly. */
type TWithStringClassName<TProps extends { className?: unknown }> = Omit<
  TProps,
  'className'
> & { className?: string };

export type ComboboxTriggerProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Trigger>
>;

export type ComboboxClearProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Clear>
>;

export type ComboboxContentProps = ComponentPropsWithoutRef<'div'> & {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
};

export type ComboboxListProps = Omit<
  TWithStringClassName<ComponentPropsWithoutRef<typeof BaseCombobox.List>>,
  'children'
> & {
  /** Renders each option. Defaults to a plain item per option. */
  children?: (option: ComboboxOption, index: number) => ReactNode;
};

export type ComboboxItemProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Item>
>;

export type ComboboxEmptyProps = ComponentPropsWithoutRef<'div'>;

export type ComboboxGroupProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Group>
>;

export type ComboboxGroupLabelProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>
>;

export type ComboboxSeparatorProps = TWithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Separator>
>;
