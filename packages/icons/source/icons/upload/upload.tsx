import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['path', { d: 'M12 3v12', key: '1x0j5s' }],
  ['path', { d: 'm17 8-5-5-5 5', key: '7q97r8' }],
  ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', key: 'ih7n3h' }],
];

/**
 * Upload arrow, used for uploading files.
 *
 * @example
 * ```tsx
 * <Upload size={24} />
 * ```
 */
export const Upload = createIcon({
  name: 'Upload',
  iconNode,
});
