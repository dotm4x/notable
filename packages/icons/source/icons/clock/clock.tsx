import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'M12 6v6l4 2', key: 'mmk7yg' }],
];

/**
 * Clock, used for time and scheduling.
 *
 * @example
 * ```tsx
 * <Clock size={24} />
 * ```
 */
export const Clock = createIcon({
  name: 'Clock',
  iconNode,
});
