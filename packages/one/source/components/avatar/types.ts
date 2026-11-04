import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';

/** Available avatar sizes. */
export type AvatarSize = 'small' | 'medium' | 'large' | 'extra-large';

/** Props for the {@link Avatar} root component. */
export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** Size inherited by the image and fallback content. */
  size?: AvatarSize;
  /** Compose `Avatar.Image`, `Avatar.Fallback`, or both as children. */
  children?: ReactNode;
};

/** Native image attributes accepted by `Avatar.Image`. */
export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

/** Props for `Avatar.Fallback`. */
export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
  /** Text, an icon, or other fallback content. */
  children?: ReactNode;
};
