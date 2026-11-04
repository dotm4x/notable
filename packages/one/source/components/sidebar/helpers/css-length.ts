export function toCssLength(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}
