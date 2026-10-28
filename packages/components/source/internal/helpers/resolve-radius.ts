/** Notable radius token names. */
export type NotableRadiusToken =
  'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

const radiusTokens: ReadonlySet<string> = new Set<NotableRadiusToken>([
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
  radius: NotableRadiusToken | number | string | undefined,
): string | undefined {
  if (radius === undefined) {
    return undefined;
  }
  if (typeof radius === 'number') {
    return `${radius}px`;
  }
  if (radiusTokens.has(radius)) {
    return `var(--notable-radius-${radius})`;
  }
  return radius;
}
