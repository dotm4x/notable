import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
  ['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }],
];

/**
 * Right-pointing arrow, commonly used for navigation or "next".
 *
 * @example
 * ```tsx
 * <ArrowRight size={24} />
 * ```
 */
export const ArrowRight = createIcon({
  name: 'ArrowRight',
  iconNode,
});
