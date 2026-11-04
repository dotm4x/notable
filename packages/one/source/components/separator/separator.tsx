import type { CSSProperties } from 'react';
import type { TCssCustomProperties } from '../../internal/helpers/css-custom-properties.js';
import { resolveColor, resolveThickness } from './helpers/resolve.js';
import type { SeparatorProps } from './types.js';
import './separator.css';

export type {
  SeparatorColor,
  SeparatorOrientation,
  SeparatorProps,
} from './types.js';

/**
 * Renders a thin line that divides content. It stretches across its container
 * on the cross axis, so a vertical separator needs a container with a height.
 */
export function Separator({
  className,
  color,
  decorative = false,
  orientation = 'horizontal',
  style,
  thickness,
  ...props
}: SeparatorProps) {
  const inlineStyle: CSSProperties & TCssCustomProperties = { ...style };
  const resolvedThickness = resolveThickness(thickness);
  if (resolvedThickness !== undefined) {
    inlineStyle['--_separator-thickness'] = resolvedThickness;
  }
  const resolvedColor = resolveColor(color);
  if (resolvedColor !== undefined) {
    inlineStyle['--_separator-color'] = resolvedColor;
  }

  const classes = ['one-separator', `one-separator--${orientation}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...props}
      className={classes}
      style={inlineStyle}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
    />
  );
}
