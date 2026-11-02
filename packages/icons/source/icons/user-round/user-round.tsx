import { createIcon } from '../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../internal/primitives/icon.js';

const iconNode: TIconNode = [
  ['circle', { cx: '12', cy: '8', r: '5', key: '1hypcn' }],
  ['path', { d: 'M20 21a8 8 0 0 0-16 0', key: 'rfgkzh' }],
] as TIconNode;

/**
 * UserRound icon.
 */
export const UserRound = createIcon({
  name: 'UserRound',
  iconNode,
});
