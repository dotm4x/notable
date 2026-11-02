import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '12', r: '4', key: '4exip2' }],
  ['path', { d: 'M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8', key: '7n84p3' }],
] as TIconNode;

/**
 * AtSign icon.
 */
export const AtSign = createIcon({
  name: 'AtSign',
  iconNode,
});
