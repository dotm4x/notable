import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'M17 12h.01', key: '1m0b6t' }],
  ['path', { d: 'M12 12h.01', key: '1mp3jc' }],
  ['path', { d: 'M7 12h.01', key: 'eqddd0' }],
] as TIconNode;

/**
 * CircleEllipsis icon.
 */
export const CircleEllipsis = createIcon({
  name: 'CircleEllipsis',
  iconNode,
});
