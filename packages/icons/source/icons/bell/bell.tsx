import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M10.268 21a2 2 0 0 0 3.464 0', key: 'vwvbt9' }],
  [
    'path',
    {
      d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
      key: '11g9vi',
    },
  ],
];

/**
 * Bell, used to represent notifications or alerts.
 *
 * @example
 * ```tsx
 * <Bell size={24} />
 * ```
 */
export const Bell = createIcon({
  name: 'Bell',
  iconNode,
});
