import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { CheckboxGroupItem } from './parts/item.js';
import { CheckboxGroupRoot } from './parts/root.js';
import type { CheckboxGroupProps } from './types.js';
import './checkbox-group.css';

export type { CheckboxGroupItemProps, CheckboxGroupProps } from './types.js';

export interface CheckboxGroupComponent extends ForwardRefExoticComponent<
  CheckboxGroupProps & RefAttributes<HTMLFieldSetElement>
> {
  /** Renders an individual checkbox option within the group. */
  Item: typeof CheckboxGroupItem;
}

/** Compound checkbox group: `CheckboxGroup` is the root and `CheckboxGroup.Item` its options. */
export const CheckboxGroup: CheckboxGroupComponent = Object.assign(
  CheckboxGroupRoot,
  {
    Item: CheckboxGroupItem,
  },
);
