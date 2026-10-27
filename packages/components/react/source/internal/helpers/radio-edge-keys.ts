import type { KeyboardEvent } from 'react';

/**
 * Selects the first or last enabled native radio inside the event's container
 * when Home or End is pressed. Browsers do not define these keys consistently
 * for radio groups, so the group handles them explicitly.
 */
export function selectEdgeRadioOnKeyDown(
  event: KeyboardEvent<HTMLElement>,
): void {
  if (event.key !== 'Home' && event.key !== 'End') {
    return;
  }

  const enabledRadios = Array.from(
    event.currentTarget.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]:not(:disabled)',
    ),
  );
  const target =
    event.key === 'Home' ? enabledRadios.at(0) : enabledRadios.at(-1);
  if (!target) {
    return;
  }

  event.preventDefault();
  target.focus();
  target.click();
}
