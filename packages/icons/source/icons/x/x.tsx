import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
  ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
];

/**
 * Close/cancel cross.
 *
 * @example
 * ```tsx
 * <X size={24} />
 * ```
 */
export const X = createIcon({
  name: 'X',
  iconNode,
});
