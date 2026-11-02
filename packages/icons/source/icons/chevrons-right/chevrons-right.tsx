import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'm6 17 5-5-5-5', key: 'xnjwq' }],
  ['path', { d: 'm13 17 5-5-5-5', key: '17xmmf' }],
];

/**
 * Double right chevron, used for last/jump forward.
 *
 * @example
 * ```tsx
 * <ChevronsRight size={24} />
 * ```
 */
export const ChevronsRight = createIcon({
  name: 'ChevronsRight',
  iconNode,
});
