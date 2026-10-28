import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './avatar-group.css';
import type { AvatarSize } from './avatar.js';

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

type AvatarGroupStyle = CSSProperties & {
  '--notable-avatar-group-overlap': string;
};

/**
 * Arranges items with overlap and optionally limits how many are shown.
 * The hidden-items indicator is not included in the `max` limit.
 */
export function AvatarGroup({
  children,
  className,
  max,
  size = 'medium',
  spacing = 8,
  orientation = 'horizontal',
  overflow,
  ...props
}: AvatarGroupProps) {
  const items = Children.toArray(children);
  const limit =
    max === undefined || !Number.isFinite(max)
      ? items.length
      : Math.max(0, Math.floor(max));
  const visibleItems = items.slice(0, limit);
  const hiddenCount = items.length - visibleItems.length;
  const overlap = Number.isFinite(spacing) ? Math.max(0, spacing) : 8;
  const style: AvatarGroupStyle = {
    ...props.style,
    '--notable-avatar-group-overlap': `${overlap}px`,
  };
  const classes = [
    'notable-avatar-group',
    `notable-avatar-group--${size}`,
    `notable-avatar-group--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...props} className={classes} style={style}>
      {visibleItems.map((item, index) => (
        <div className="notable-avatar-group__item" key={itemKey(item, index)}>
          {item}
        </div>
      ))}
      {hiddenCount > 0 && (
        <div className="notable-avatar-group__item">
          <span
            className="notable-avatar-group__overflow"
            role="img"
            aria-label={`${hiddenCount} more ${hiddenCount === 1 ? 'avatar' : 'avatars'}`}
          >
            <span aria-hidden="true">
              {overflow === undefined ? `+${hiddenCount}` : overflow}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

function itemKey(item: ReactNode, index: number) {
  return item !== null &&
    typeof item === 'object' &&
    'key' in item &&
    item.key !== null
    ? item.key
    : index;
}
