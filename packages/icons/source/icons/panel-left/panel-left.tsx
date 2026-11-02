import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  [
    'rect',
    { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' },
  ],
  ['path', { d: 'M9 3v18', key: 'fh3hqa' }],
];

/**
 * Left panel, used for sidebar toggle.
 *
 * @example
 * ```tsx
 * <PanelLeft size={24} />
 * ```
 */
export const PanelLeft = createIcon({
  name: 'PanelLeft',
  iconNode,
});
