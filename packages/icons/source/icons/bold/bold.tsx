import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  [
    'path',
    {
      d: 'M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8',
      key: 'mg9rjx',
    },
  ],
] as TIconNode;

/**
 * Bold icon.
 */
export const Bold = createIcon({
  name: 'Bold',
  iconNode,
});
