import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
] as TIconNode;

/**
 * Minus icon.
 */
export const Minus = createIcon({
  name: 'Minus',
  iconNode,
});
