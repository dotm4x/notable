/**
 * Selects the element that receives the highlight. Base UI sets
 * `data-highlighted` on the active item and disabled items never become
 * highlight targets.
 */
export function findHighlightTarget(
  target: EventTarget | null,
  container: HTMLElement | null,
  selector: string,
) {
  if (!(target instanceof Element) || !container) {
    return null;
  }

  const highlightTarget = target.closest<HTMLElement>(selector);

  return highlightTarget &&
    container.contains(highlightTarget) &&
    !highlightTarget.matches(
      ':disabled, [aria-disabled="true"], [data-disabled]',
    )
    ? highlightTarget
    : null;
}
