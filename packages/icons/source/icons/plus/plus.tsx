import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
  ['path', { d: 'M12 5v14', key: 's699le' }],
];

/**
 * Plus sign, used for add/create actions.
 *
 * @example
 * ```tsx
 * <Plus size={24} />
 * ```
 */
export const Plus = createIcon({
  name: 'Plus',
  iconNode,
});
