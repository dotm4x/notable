import type { SeparatorColor, SeparatorProps } from '../types.js';

const colorTokens: Readonly<Record<SeparatorColor, string>> = {
  subtle: 'var(--one-color-border-subtle)',
  default: 'var(--one-color-border)',
  strong: 'var(--one-color-border-strong)',
};

export function resolveColor(
  color: SeparatorProps['color'],
): string | undefined {
  if (color === undefined) {
    return undefined;
  }
  if (color === 'subtle' || color === 'default' || color === 'strong') {
    return colorTokens[color];
  }
  return color;
}

export function resolveThickness(
  thickness: SeparatorProps['thickness'],
): string | undefined {
  if (thickness === undefined) {
    return undefined;
  }
  return typeof thickness === 'number' ? `${thickness}px` : thickness;
}
