import type { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { DialogSize } from '../dialog/dialog.js';
import type { InputProps } from '../input/input.js';

/** A runnable command. `value` identifies it; `label` is shown and matched against the query. */
export type CommandItem = {
  value: string;
  label: string;
  /** Secondary text shown below the label and matched against the query. */
  description?: string;
  /** Extra search terms that match the query without being displayed. */
  keywords?: readonly string[];
  /** Icon shown before the label. Decorative, so it is hidden from assistive technology. */
  icon?: ReactNode;
  /** Key labels shown after the item, for example `['⌘', 'S']`. */
  shortcut?: readonly string[];
  disabled?: boolean;
  /** Runs when the item is chosen. Chosen items close a `Command.Dialog` before this runs. */
  onSelect?: () => void | Promise<void>;
};

/** A labeled set of commands rendered under a group heading. */
export type CommandGroup = {
  label: string;
  items: readonly CommandItem[];
};

/** Decides whether an item matches the current query. Return `true` to show the item. */
export type CommandFilter = (item: CommandItem, query: string) => boolean;

/** Props for the inline `Command` root. `items` is either a flat list or a list of groups. */
export type CommandProps = {
  items: readonly CommandItem[] | readonly CommandGroup[];
  /** Replaces the default filter, which requires every whitespace-separated term to match. */
  filter?: CommandFilter;
  children?: ReactNode;
};

/** Props for `Command.Dialog`, a modal command palette. */
export type CommandDialogProps = CommandProps & {
  /** Controlled open state. Omit to let the palette manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Keyboard shortcut that toggles the palette, such as `'Mod+K'`. `Mod` is Command on
   * macOS and Control elsewhere. Pass `null` to disable it. Defaults to `'Mod+K'`.
   */
  shortcut?: string | null;
  /** Accessible name of the palette. Defaults to `'Command palette'`. */
  label?: string;
  /** Width of the palette. Defaults to `medium`. */
  size?: DialogSize;
};

export type CommandInputProps = Omit<
  InputProps,
  | 'children'
  | 'label'
  | 'description'
  | 'error'
  | 'invalid'
  | 'leadingIcon'
  | 'trailingIcon'
  | 'trailingIconInteractive'
>;

/** Base UI props with `className` narrowed to a string, since One composes class names directly. */
type WithStringClassName<TProps extends { className?: unknown }> = Omit<
  TProps,
  'className'
> & { className?: string };

export type CommandListProps = Omit<
  WithStringClassName<ComponentPropsWithoutRef<typeof BaseAutocomplete.List>>,
  'children'
> & {
  /** Renders each item. Defaults to a `Command.Item` per command. */
  children?: (item: CommandItem, index: number) => ReactNode;
};

export type CommandItemProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'onClick'
> & {
  item: CommandItem;
};

export type CommandEmptyProps = ComponentPropsWithoutRef<'div'>;

export type CommandGroupProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseAutocomplete.Group>
>;

export type CommandGroupLabelProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseAutocomplete.GroupLabel>
>;

export type CommandSeparatorProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseAutocomplete.Separator>
>;

export type TCommandRootProps = CommandProps & { onItemSelect?: () => void };
