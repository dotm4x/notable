/** One radius token names. */
export type OneRadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

const radiusTokens: ReadonlySet<string> = new Set<OneRadiusToken>([
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'full',
]);

/**
 * Converts a radius token name to its CSS variable, a number to pixels, and
 * passes any other string through as CSS.
 */
export function resolveRadius(
  radius: OneRadiusToken | number | string | undefined,
): string | undefined {
  if (radius === undefined) {
    return undefined;
  }
  if (typeof radius === 'number') {
    return `${radius}px`;
  }
  if (radiusTokens.has(radius)) {
    return `var(--one-radius-${radius})`;
  }
  return radius;
}
