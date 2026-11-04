import { SelectRoot } from './parts/root.js';
import {
  SelectIcon,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './parts/trigger.js';
import { SelectContent, SelectList } from './parts/popup.js';
import {
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
} from './parts/item.js';
import type { SelectProps } from './types.js';
import '../../internal/styles/floating-surface.css';
import './select.css';

export type {
  SelectContentProps,
  SelectGroupLabelProps,
  SelectGroupProps,
  SelectIconProps,
  SelectItemProps,
  SelectLabelProps,
  SelectListProps,
  SelectProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from './types.js';

export interface SelectComponent extends React.FC<SelectProps> {
  Root: typeof SelectRoot;
  /** Renders the accessible label for the select. */
  Label: typeof SelectLabel;
  /** Renders the trigger button for opening the select popup. */
  Trigger: typeof SelectTrigger;
  /** Renders the currently selected value display. */
  Value: typeof SelectValue;
  /** Renders the dropdown chevron icon. */
  Icon: typeof SelectIcon;
  /** Renders the popup container for options. */
  Content: typeof SelectContent;
  /** Renders the list container of options. */
  List: typeof SelectList;
  /** Renders a selectable option item. */
  Item: typeof SelectItem;
  /** Groups related select options. */
  Group: typeof SelectGroup;
  /** Renders the label of an option group. */
  GroupLabel: typeof SelectGroupLabel;
  /** Renders a line separator between options or groups. */
  Separator: typeof SelectSeparator;
}

/**
 * Single-selection select built on Base UI. Compose it with `Select.Trigger`,
 * `Select.Value`, `Select.Icon`, and `Select.Content`. Forwards refs to the
 * DOM element each part renders.
 */
export const Select: SelectComponent = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Content: SelectContent,
  List: SelectList,
  Item: SelectItem,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
});
