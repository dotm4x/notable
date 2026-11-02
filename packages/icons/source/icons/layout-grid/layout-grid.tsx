import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['rect', { width: '7', height: '7', x: '3', y: '3', rx: '1', key: '1g98yp' }],
  [
    'rect',
    { width: '7', height: '7', x: '14', y: '3', rx: '1', key: '6d4xhi' },
  ],
  [
    'rect',
    { width: '7', height: '7', x: '14', y: '14', rx: '1', key: 'nxv5o0' },
  ],
  [
    'rect',
    { width: '7', height: '7', x: '3', y: '14', rx: '1', key: '1bb6yr' },
  ],
] as TIconNode;

/**
 * LayoutGrid icon.
 */
export const LayoutGrid = createIcon({
  name: 'LayoutGrid',
  iconNode,
});
