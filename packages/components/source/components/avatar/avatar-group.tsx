import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { AvatarSize } from './avatar.js';

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Avatares u otro contenido que se organiza en un grupo superpuesto. */
  children?: ReactNode;
  /** Tamaño heredado por los avatares secundarios. Por defecto, `medium`. */
  size?: AvatarSize;
  /** Máximo de avatares visibles. Los valores no positivos los ocultan todos. */
  max?: number;
  /** Solapamiento entre elementos adyacentes, en píxeles. Por defecto, `8`. */
  spacing?: number;
  /** Dirección del solapamiento. Por defecto, `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Contenido visual que sustituye al indicador de elementos ocultos `+N`. */
  overflow?: ReactNode;
};

type AvatarGroupStyle = CSSProperties & {
  '--notable-avatar-group-overlap': string;
};

/**
 * Organiza los elementos con solapamiento y permite limitar cuántos se muestran.
 * El indicador de elementos ocultos no se incluye en el límite `max`.
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
