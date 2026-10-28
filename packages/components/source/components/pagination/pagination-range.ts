/** A visible entry of the pagination range: a page number or an omitted gap. */
export type TPaginationRangeItem =
  { type: 'page'; page: number } | { type: 'ellipsis'; key: 'start' | 'end' };

/**
 * Returns the entries to show for a page count, centered on the current page.
 * The current page is clamped into range. A gap of a single page is shown as
 * that page rather than as an ellipsis, because an ellipsis would hide no more
 * than the button it replaces.
 */
export function getPaginationRange(
  page: number,
  pageCount: number,
  siblingCount: number,
): TPaginationRangeItem[] {
  if (pageCount < 1) {
    return [];
  }

  const siblings = Math.max(0, Math.floor(siblingCount));
  const current = Math.min(Math.max(Math.floor(page), 1), pageCount);
  const boundaryTotal = siblings * 2 + 5;

  const pages = (from: number, to: number): TPaginationRangeItem[] =>
    Array.from({ length: to - from + 1 }, (_, index) => ({
      type: 'page',
      page: from + index,
    }));

  if (pageCount <= boundaryTotal) {
    return pages(1, pageCount);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, pageCount);
  const showStartEllipsis = leftSibling > 3;
  const showEndEllipsis = rightSibling < pageCount - 2;
  const edgeCount = 3 + siblings * 2;

  if (!showStartEllipsis && showEndEllipsis) {
    return [
      ...pages(1, edgeCount),
      { type: 'ellipsis', key: 'end' },
      { type: 'page', page: pageCount },
    ];
  }

  if (showStartEllipsis && !showEndEllipsis) {
    return [
      { type: 'page', page: 1 },
      { type: 'ellipsis', key: 'start' },
      ...pages(pageCount - edgeCount + 1, pageCount),
    ];
  }

  return [
    { type: 'page', page: 1 },
    { type: 'ellipsis', key: 'start' },
    ...pages(leftSibling, rightSibling),
    { type: 'ellipsis', key: 'end' },
    { type: 'page', page: pageCount },
  ];
}
