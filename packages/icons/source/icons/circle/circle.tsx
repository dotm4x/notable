import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
] as TIconNode;

/**
 * Circle outline.
 */
export const Circle = createIcon({
  name: 'Circle',
  iconNode,
});
