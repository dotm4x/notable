import type { ComboboxOption, ComboboxOptionGroup } from '../types.js';

export function isOptionGroup(
  entry: ComboboxOption | ComboboxOptionGroup,
): entry is ComboboxOptionGroup {
  return 'items' in entry;
}
