import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { AvatarSize } from './avatar.js';

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  size?: AvatarSize;
  /** Maximum visible avatars. Non-positive values hide all avatars. */
  max?: number;
  /** Overlap between adjacent items, in pixels. Defaults to 8px. */
  spacing?: number;
  /** Direction in which avatars overlap. Defaults to horizontal. */
  orientation?: 'horizontal' | 'vertical';
  /** Visual-only content replacing the default +N indicator. */
  overflow?: ReactNode;
};

type AvatarGroupStyle = CSSProperties & {
  '--bodypop-avatar-group-overlap': string;
};

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
    '--bodypop-avatar-group-overlap': `${overlap}px`,
  };
  const classes = [
    'bodypop-avatar-group',
    `bodypop-avatar-group--${size}`,
    `bodypop-avatar-group--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...props} className={classes} style={style}>
      {visibleItems.map((item, index) => (
        <div className="bodypop-avatar-group__item" key={itemKey(item, index)}>
          {item}
        </div>
      ))}
      {hiddenCount > 0 && (
        <div className="bodypop-avatar-group__item">
          <span
            className="bodypop-avatar-group__overflow"
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
