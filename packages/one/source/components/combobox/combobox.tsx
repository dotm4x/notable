import { ComboboxRoot, ComboboxInput } from './parts/root.js';
import { ComboboxClear, ComboboxTrigger } from './parts/trigger.js';
import { ComboboxContent, ComboboxEmpty, ComboboxList } from './parts/popup.js';
import {
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxSeparator,
} from './parts/item.js';
import type { ComboboxProps } from './types.js';
import '../../internal/styles/floating-surface.css';
import './combobox.css';

export type {
  ComboboxClearProps,
  ComboboxContentProps,
  ComboboxEmptyProps,
  ComboboxGroupLabelProps,
  ComboboxGroupProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxListProps,
  ComboboxOption,
  ComboboxOptionGroup,
  ComboboxProps,
  ComboboxSeparatorProps,
  ComboboxTriggerProps,
} from './types.js';

export interface ComboboxComponent extends React.FC<ComboboxProps> {
  /** Renders the input field for the combobox. */
  Input: typeof ComboboxInput;
  /** Renders the trigger button for opening the combobox dropdown. */
  Trigger: typeof ComboboxTrigger;
  /** Renders a button to clear the current selection. */
  Clear: typeof ComboboxClear;
  /** Renders the popup container for combobox options. */
  Content: typeof ComboboxContent;
  /** Renders the list of options. */
  List: typeof ComboboxList;
  /** Renders an individual selectable option. */
  Item: typeof ComboboxItem;
  /** Renders content shown when no options match the query. */
  Empty: typeof ComboboxEmpty;
  /** Groups related options under a shared label. */
  Group: typeof ComboboxGroup;
  /** Renders the label of an option group. */
  GroupLabel: typeof ComboboxGroupLabel;
  /** Renders a line separator between options or groups. */
  Separator: typeof ComboboxSeparator;
}

/**
 * Searchable single-select combobox. Compose it with `Combobox.Input`,
 * `Combobox.Content`, `Combobox.List`, and `Combobox.Item`.
 */
export const Combobox: ComboboxComponent = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Clear: ComboboxClear,
  Content: ComboboxContent,
  List: ComboboxList,
  Item: ComboboxItem,
  Empty: ComboboxEmpty,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
});
