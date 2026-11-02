import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '12', r: '1', key: '41hilf' }],
  ['circle', { cx: '19', cy: '12', r: '1', key: '1wjl8i' }],
  ['circle', { cx: '5', cy: '12', r: '1', key: '1pcz8c' }],
];

/**
 * Horizontal ellipsis, used for "more" menus.
 *
 * @example
 * ```tsx
 * <Ellipsis size={24} />
 * ```
 */
export const Ellipsis = createIcon({
  name: 'Ellipsis',
  iconNode,
});
