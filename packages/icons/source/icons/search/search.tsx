import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'm21 21-4.34-4.34', key: '14j7rj' }],
  ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
];

/**
 * Magnifying glass, used for search.
 *
 * @example
 * ```tsx
 * <Search size={24} />
 * ```
 */
export const Search = createIcon({
  name: 'Search',
  iconNode,
});
