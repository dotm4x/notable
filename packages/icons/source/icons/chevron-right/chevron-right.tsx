import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }]];

/**
 * Right chevron, used for forward navigation.
 *
 * @example
 * ```tsx
 * <ChevronRight size={24} />
 * ```
 */
export const ChevronRight = createIcon({
  name: 'ChevronRight',
  iconNode,
});
