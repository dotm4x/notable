import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M6 4v6a6 6 0 0 0 12 0V4', key: '9kb039' }],
  ['line', { x1: '4', x2: '20', y1: '20', y2: '20', key: 'nun2al' }],
] as TIconNode;

/**
 * Underline icon.
 */
export const Underline = createIcon({
  name: 'Underline',
  iconNode,
});
