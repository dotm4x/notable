import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [['path', { d: 'm6 9 6 6 6-6', key: 'qrunsl' }]];

/**
 * Down chevron, used for dropdowns and expand actions.
 *
 * @example
 * ```tsx
 * <ChevronDown size={24} />
 * ```
 */
export const ChevronDown = createIcon({
  name: 'ChevronDown',
  iconNode,
});
