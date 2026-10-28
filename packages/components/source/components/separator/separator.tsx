import type { CSSProperties, HTMLAttributes } from 'react';
import type { TCssCustomProperties } from '../../internal/helpers/css-custom-properties.js';
import './separator.css';

/** Direction of the dividing line. */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/** Notable border color token names. */
export type SeparatorColor = 'subtle' | 'default' | 'strong';

/** Props for {@link Separator}, in addition to native `div` attributes. */
export type SeparatorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role'
> & {
  /** Additional CSS class for the separator element. */
  className?: string;
  /**
   * Line color. A Notable token name maps to its border token, and any other
   * string is used as CSS as provided. Defaults to the standard border color.
   */
  color?: SeparatorColor | string;
  /**
   * Whether the separator is purely visual. Decorative separators are removed
   * from the accessibility tree; semantic separators expose `role="separator"`.
   * Defaults to `false`.
   */
  decorative?: boolean;
  /** Orientation of the line. Defaults to `horizontal`. */
  orientation?: SeparatorOrientation;
  /**
   * Line thickness. A number is treated as pixels, and any other string is used
   * as CSS as provided. Defaults to the standard border width.
   */
  thickness?: number | string;
};

const colorTokens: Readonly<Record<SeparatorColor, string>> = {
  subtle: 'var(--notable-color-border-subtle)',
  default: 'var(--notable-color-border)',
  strong: 'var(--notable-color-border-strong)',
};

function resolveColor(color: SeparatorProps['color']): string | undefined {
  if (color === undefined) {
    return undefined;
  }
  if (color === 'subtle' || color === 'default' || color === 'strong') {
    return colorTokens[color];
  }
  return color;
}

function resolveThickness(
  thickness: SeparatorProps['thickness'],
): string | undefined {
  if (thickness === undefined) {
    return undefined;
  }
  return typeof thickness === 'number' ? `${thickness}px` : thickness;
}

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
    inlineStyle['--notable-separator-thickness'] = resolvedThickness;
  }
  const resolvedColor = resolveColor(color);
  if (resolvedColor !== undefined) {
    inlineStyle['--notable-separator-color'] = resolvedColor;
  }

  const classes = [
    'notable-separator',
    `notable-separator--${orientation}`,
    className,
  ]
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
