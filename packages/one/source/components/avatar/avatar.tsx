import type { FC } from 'react';
import { AvatarFallback, AvatarImage, AvatarRoot } from './parts/sections.js';
import type { AvatarProps } from './types.js';
import './avatar.css';

export type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
  AvatarSize,
} from './types.js';

export interface AvatarComponent extends FC<AvatarProps> {
  /**
   * Shows the avatar image after it loads and accepts native image attributes.
   * Renders no image when both `src` and `srcSet` are omitted.
   */
  Image: typeof AvatarImage;
  /** Shows fallback content until the current image has loaded. */
  Fallback: typeof AvatarFallback;
}

/**
 * Compound avatar component. Compose `Avatar.Image` and `Avatar.Fallback` as
 * children of the root component.
 */
export const Avatar: AvatarComponent = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
