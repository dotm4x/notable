import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { ToggleGroupItem } from './parts/item.js';
import { ToggleGroupRoot } from './parts/root.js';
import type { TToggleGroupProps } from './types.js';
import './toggle-group.css';

export type {
  TToggleGroupItemProps,
  TToggleGroupMultipleProps,
  TToggleGroupOrientation,
  TToggleGroupProps,
  TToggleGroupSingleProps,
  TToggleGroupType,
} from './types.js';

export interface TToggleGroupComponent extends ForwardRefExoticComponent<
  TToggleGroupProps & RefAttributes<HTMLDivElement>
> {
  /** Renders an individual toggle button within the group. */
  Item: typeof ToggleGroupItem;
}

/** Compound toggle group: `ToggleGroup` is the root and `ToggleGroup.Item` its options. */
export const ToggleGroup: TToggleGroupComponent = Object.assign(
  ToggleGroupRoot,
  {
    Item: ToggleGroupItem,
  },
);
