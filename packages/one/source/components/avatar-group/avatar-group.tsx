import { Children, type CSSProperties } from 'react';
import { itemKey } from './helpers/item-key.js';
import type { AvatarGroupProps } from './types.js';
import './avatar-group.css';

export type { AvatarGroupProps } from './types.js';

type AvatarGroupStyle = CSSProperties & {
  '--_avatar-group-overlap': string;
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
    '--_avatar-group-overlap': `${overlap}px`,
  };
  const classes = [
    'one-avatar-group',
    `one-avatar-group--${size}`,
    `one-avatar-group--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...props} className={classes} style={style}>
      {visibleItems.map((item, index) => (
        <div className="one-avatar-group__item" key={itemKey(item, index)}>
          {item}
        </div>
      ))}
      {hiddenCount > 0 && (
        <div className="one-avatar-group__item">
          <span
            className="one-avatar-group__overflow"
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
