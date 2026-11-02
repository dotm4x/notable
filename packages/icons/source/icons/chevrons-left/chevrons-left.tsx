import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'm11 17-5-5 5-5', key: '13zhaf' }],
  ['path', { d: 'm18 17-5-5 5-5', key: 'h8a8et' }],
];

/**
 * Double left chevron, used for first/jump back.
 *
 * @example
 * ```tsx
 * <ChevronsLeft size={24} />
 * ```
 */
export const ChevronsLeft = createIcon({
  name: 'ChevronsLeft',
  iconNode,
});
