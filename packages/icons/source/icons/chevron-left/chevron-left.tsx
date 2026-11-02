import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [['path', { d: 'm15 18-6-6 6-6', key: '1wnfg3' }]];

/**
 * Left chevron, used for back navigation.
 *
 * @example
 * ```tsx
 * <ChevronLeft size={24} />
 * ```
 */
export const ChevronLeft = createIcon({
  name: 'ChevronLeft',
  iconNode,
});
