import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M8 2v3', key: '1ioesn' }],
  ['path', { d: 'M16 2v3', key: 'otl347' }],
  [
    'rect',
    { x: '3', y: '3', width: '18', height: '18', rx: '2', key: 'h1oib' },
  ],
  ['path', { d: 'M3 9h18', key: '1pudct' }],
];

/**
 * Calendar, used for dates and scheduling.
 *
 * @example
 * ```tsx
 * <Calendar size={24} />
 * ```
 */
export const Calendar = createIcon({
  name: 'Calendar',
  iconNode,
});
