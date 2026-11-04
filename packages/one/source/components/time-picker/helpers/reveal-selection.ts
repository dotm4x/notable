/** Scrolls a column so its selected option is visible when the popup opens. */
export function revealSelection(list: HTMLDivElement | null) {
  const checked = list?.querySelector('input:checked')?.closest('label');

  if (list && checked) {
    list.scrollTop =
      checked.offsetTop - list.clientHeight / 2 + checked.offsetHeight / 2;
  }
}
