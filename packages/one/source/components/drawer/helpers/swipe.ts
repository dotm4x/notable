import type { DrawerSide } from '../types.js';

export const swipeDirectionBySide = {
  right: 'right',
  left: 'left',
  top: 'up',
  bottom: 'down',
} as const satisfies Record<DrawerSide, 'up' | 'down' | 'left' | 'right'>;
