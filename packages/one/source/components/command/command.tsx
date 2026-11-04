import type { FC } from 'react';
import {
  CommandEmpty,
  CommandGroupLabel,
  CommandGroupPart,
  CommandSeparator,
} from './parts/group.js';
import { CommandInput } from './parts/input.js';
import { CommandItemPart, CommandList } from './parts/list.js';
import { CommandDialog, CommandRoot } from './parts/root.js';
import type { TCommandRootProps } from './types.js';
import './command.css';

export type {
  CommandDialogProps,
  CommandEmptyProps,
  CommandFilter,
  CommandGroup,
  CommandGroupLabelProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItem,
  CommandItemProps,
  CommandListProps,
  CommandProps,
  CommandSeparatorProps,
} from './types.js';

export interface CommandComponent extends FC<TCommandRootProps> {
  /** Renders a modal command palette. */
  Dialog: typeof CommandDialog;
  /** Renders the input field for the command query. */
  Input: typeof CommandInput;
  /** Renders the list of commands. */
  List: typeof CommandList;
  /** Renders a selectable item in the command list. */
  Item: typeof CommandItemPart;
  /** Renders content shown when no commands match the query. */
  Empty: typeof CommandEmpty;
  /** Groups related commands under a shared label. */
  Group: typeof CommandGroupPart;
  /** Renders the label of a command group. */
  GroupLabel: typeof CommandGroupLabel;
  /** Renders a line separator between commands or groups. */
  Separator: typeof CommandSeparator;
}

/**
 * Searchable list of commands. Use `Command.Dialog` for a modal palette, or compose
 * `Command` inline with `Command.Input` and `Command.List`.
 */
export const Command: CommandComponent = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Item: CommandItemPart,
  Empty: CommandEmpty,
  Group: CommandGroupPart,
  GroupLabel: CommandGroupLabel,
  Separator: CommandSeparator,
});
