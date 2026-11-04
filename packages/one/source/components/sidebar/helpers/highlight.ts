const highlightTargetSelector = [
  '.one-sidebar__item',
  '.one-sidebar__submenu-trigger',
  '.one-sidebar__group-action',
  '.one-sidebar__menu-action',
  '.one-sidebar__trigger',
].join(', ');

export function findHighlightTarget(
  target: EventTarget | null,
  container: HTMLElement | null,
) {
  if (!(target instanceof Element) || !container) {
    return null;
  }

  const highlightTarget = target.closest<HTMLElement>(highlightTargetSelector);

  return highlightTarget &&
    container.contains(highlightTarget) &&
    !highlightTarget.matches(
      ':disabled, [aria-disabled="true"], [data-disabled]',
    )
    ? highlightTarget
    : null;
}
