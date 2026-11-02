import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'M12 16v-4', key: '1dtifu' }],
  ['path', { d: 'M12 8h.01', key: 'e9boi3' }],
];

/**
 * Information, used for help and details.
 *
 * @example
 * ```tsx
 * <Info size={24} />
 * ```
 */
export const Info = createIcon({
  name: 'Info',
  iconNode,
});
