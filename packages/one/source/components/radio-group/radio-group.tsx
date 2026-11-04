import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { RadioGroupItem } from './parts/item.js';
import { RadioGroupRoot } from './parts/root.js';
import type { RadioGroupProps } from './types.js';
import './radio-group.css';

export { RadioGroupItem };

export type {
  RadioGroupItemProps,
  RadioGroupOrientation,
  RadioGroupProps,
  RadioGroupSize,
} from './types.js';

export interface RadioGroupComponent extends ForwardRefExoticComponent<
  RadioGroupProps & RefAttributes<HTMLFieldSetElement>
> {
  /** Renders a native radio option within the group. */
  Item: typeof RadioGroupItem;
}

/** Compound radio group: `RadioGroup` is the root and `RadioGroup.Item` its options. */
export const RadioGroup: RadioGroupComponent = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});
