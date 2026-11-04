export function hasEmptyValue(
  value: string | null | readonly string[] | undefined,
) {
  return value === '' || (Array.isArray(value) && value.includes(''));
}
