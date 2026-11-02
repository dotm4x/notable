import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }],
];

/**
 * Spinning loader, used for loading states.
 *
 * @example
 * ```tsx
 * <LoaderCircle size={24} />
 * ```
 */
export const LoaderCircle = createIcon({
  name: 'LoaderCircle',
  iconNode,
});
