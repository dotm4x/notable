import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7', key: '132q7q' }],
  [
    'rect',
    { x: '2', y: '4', width: '20', height: '16', rx: '2', key: 'izxlao' },
  ],
] as TIconNode;

/**
 * Mail icon.
 */
export const Mail = createIcon({
  name: 'Mail',
  iconNode,
});
