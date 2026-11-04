import type { HTMLAttributes, ReactNode } from 'react';
import type { AvatarSize } from '../avatar/types.js';

/** Props for the {@link AvatarGroup} component. */
export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Avatars or other content arranged in an overlapping group. */
  children?: ReactNode;
  /** Size inherited by child avatars. Defaults to `medium`. */
  size?: AvatarSize;
  /** Maximum number of visible avatars. Non-positive values hide all avatars. */
  max?: number;
  /** Overlap between adjacent items, in pixels. Defaults to `8`. */
  spacing?: number;
  /** Overlap direction. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Visual content that replaces the hidden-items `+N` indicator. */
  overflow?: ReactNode;
};
