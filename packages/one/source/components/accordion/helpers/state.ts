export function toExpandedValues(
  value: string | readonly string[] | null | undefined,
): string[] {
  if (value == null) {
    return [];
  }

  return typeof value === 'string' ? [value] : [...value];
}
