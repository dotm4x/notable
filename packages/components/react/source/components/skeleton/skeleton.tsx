import type { CSSProperties, HTMLAttributes, PointerEvent } from 'react';
import {
  resolveRadius,
  type NotableRadiusToken,
} from '../../internal/helpers/resolve-radius.js';
import './skeleton.css';

/** Basic placeholder shapes. Dimensions can always be overridden. */
export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

/** Placeholder animations. */
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

/** Notable radius token names. */
export type SkeletonRadiusToken = NotableRadiusToken;

/** Props for {@link Skeleton}, in addition to native `span` attributes. */
export type SkeletonProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> & {
  /** Additional CSS class for the placeholder element. */
  className?: string;
  /**
   * Placeholder animation. Defaults to `shimmer`. Both animations are disabled
   * when the user prefers reduced motion.
   */
  animation?: SkeletonAnimation;
  /**
   * Border radius. A Notable token name maps to its radius token, a number is
   * treated as pixels, and any other string is used as CSS as provided.
   */
  radius?: SkeletonRadiusToken | number | string;
  /** Placeholder height. A number is treated as pixels. */
  height?: number | string;
  /** Placeholder width. A number is treated as pixels. */
  width?: number | string;
  /**
   * Basic shape. `text` is a short line, `rectangular` is a block, and
   * `circular` is a circle. Circular keeps its shape when only one dimension
   * is set. When both dimensions are set, they are honored as given, so the
   * result can be an ellipse.
   */
  variant?: SkeletonVariant;
};

/**
 * Renders a decorative loading placeholder. Compose several skeletons to build
 * any loading layout. The element is hidden from assistive technology and is
 * not focusable, so announce the loading state on a surrounding container.
 */
export function Skeleton({
  className,
  animation = 'shimmer',
  height,
  onPointerMove,
  radius,
  style,
  variant = 'rectangular',
  width,
  ...props
}: SkeletonProps) {
  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerMove?.(event);
    // The spotlight is positioned with CSS variables so pointer moves never re-render.
    event.currentTarget.style.setProperty(
      '--notable-skeleton-pointer-x',
      `${event.nativeEvent.offsetX}px`,
    );
    event.currentTarget.style.setProperty(
      '--notable-skeleton-pointer-y',
      `${event.nativeEvent.offsetY}px`,
    );
  };

  // A circle needs equal sides, so a height-only circle reuses the height as its width.
  const resolvedWidth =
    variant === 'circular' && width === undefined ? height : width;

  const inlineStyle: CSSProperties = { ...style };
  if (resolvedWidth !== undefined) {
    inlineStyle.width = resolvedWidth;
  }
  if (height !== undefined) {
    inlineStyle.height = height;
  }
  const resolvedRadius = resolveRadius(radius);
  if (resolvedRadius !== undefined) {
    inlineStyle.borderRadius = resolvedRadius;
  }

  const classes = [
    'notable-skeleton',
    `notable-skeleton--${variant}`,
    `notable-skeleton--${animation}`,
    animation !== 'none' && 'notable-skeleton--spotlight',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      aria-hidden="true"
      {...props}
      className={classes}
      style={inlineStyle}
      onPointerMove={handlePointerMove}
    />
  );
}
