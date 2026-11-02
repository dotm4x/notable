import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]];

/**
 * Check mark, used to confirm or indicate success.
 *
 * @example
 * ```tsx
 * <Check size={24} />
 * ```
 */
export const Check = createIcon({
  name: 'Check',
  iconNode,
});
