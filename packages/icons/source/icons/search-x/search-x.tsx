import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'm13.5 8.5-5 5', key: '1cs55j' }],
  ['path', { d: 'm8.5 8.5 5 5', key: 'a8mexj' }],
  ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
  ['path', { d: 'm21 21-4.3-4.3', key: '1qie3q' }],
] as TIconNode;

/**
 * SearchX icon.
 */
export const SearchX = createIcon({
  name: 'SearchX',
  iconNode,
});
