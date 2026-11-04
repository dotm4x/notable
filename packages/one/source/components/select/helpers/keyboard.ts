import type { KeyboardEvent } from 'react';

/**
 * Base UI handles Home but not End for select options, so End moves the
 * highlight to the last enabled option.
 */
export function focusLastEnabledOptionOnEnd(
  event: KeyboardEvent<HTMLDivElement>,
) {
  if (event.key !== 'End') {
    return;
  }

  const enabledOptions = event.currentTarget.querySelectorAll<HTMLElement>(
    '[role="option"]:not([aria-disabled="true"])',
  );
  const lastOption = enabledOptions.item(enabledOptions.length - 1);
  if (!lastOption) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  lastOption.focus();
}
