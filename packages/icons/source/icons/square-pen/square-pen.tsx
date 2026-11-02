import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  [
    'path',
    {
      d: 'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
      key: '1m0v6g',
    },
  ],
  [
    'path',
    {
      d: 'M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z',
      key: 'ohrbg2',
    },
  ],
] as TIconNode;

/**
 * SquarePen icon.
 */
export const SquarePen = createIcon({
  name: 'SquarePen',
  iconNode,
});
