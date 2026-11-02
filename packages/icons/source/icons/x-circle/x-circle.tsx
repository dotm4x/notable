import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
  ['path', { d: 'm9 9 6 6', key: 'z0biqf' }],
];

/**
 * Circle with cross, used for errors or remove.
 *
 * @example
 * ```tsx
 * <XCircle size={24} />
 * ```
 */
export const XCircle = createIcon({
  name: 'XCircle',
  iconNode,
});
