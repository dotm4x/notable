import { describe, expect, it } from 'vitest';
import {
  getPaginationRange,
  type TPaginationRangeItem,
} from './pagination-range.js';

function labels(items: TPaginationRangeItem[]) {
  return items.map((item) => (item.type === 'page' ? item.page : '…'));
}

describe('getPaginationRange', () => {
  it('returns no items when there are no pages', () => {
    expect(getPaginationRange(1, 0, 1)).toEqual([]);
  });

  it('returns every page when the count fits within the boundary total', () => {
    expect(labels(getPaginationRange(1, 1, 1))).toEqual([1]);
    expect(labels(getPaginationRange(2, 2, 1))).toEqual([1, 2]);
    expect(labels(getPaginationRange(4, 7, 1))).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('shows only the end ellipsis near the start', () => {
    expect(labels(getPaginationRange(1, 10, 1))).toEqual([
      1,
      2,
      3,
      4,
      5,
      '…',
      10,
    ]);
  });

  it('shows only the start ellipsis near the end', () => {
    expect(labels(getPaginationRange(10, 10, 1))).toEqual([
      1,
      '…',
      6,
      7,
      8,
      9,
      10,
    ]);
    expect(labels(getPaginationRange(7, 10, 1))).toEqual([
      1,
      '…',
      6,
      7,
      8,
      9,
      10,
    ]);
  });

  it('shows both ellipses around the current page in the middle', () => {
    expect(labels(getPaginationRange(5, 10, 1))).toEqual([
      1,
      '…',
      4,
      5,
      6,
      '…',
      10,
    ]);
  });

  it('shows a single hidden page as a number instead of an ellipsis', () => {
    expect(labels(getPaginationRange(4, 10, 1))).toEqual([
      1,
      2,
      3,
      4,
      5,
      '…',
      10,
    ]);
  });

  it('keeps the current page visible with no sibling pages', () => {
    expect(labels(getPaginationRange(10, 20, 0))).toEqual([
      1,
      '…',
      10,
      '…',
      20,
    ]);
    expect(labels(getPaginationRange(3, 6, 0))).toEqual([1, 2, 3, '…', 6]);
  });

  it('clamps the current page into range', () => {
    expect(labels(getPaginationRange(0, 20, 1))).toEqual([
      1,
      2,
      3,
      4,
      5,
      '…',
      20,
    ]);
    expect(labels(getPaginationRange(99, 20, 1))).toEqual([
      1,
      '…',
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it('treats negative and fractional sibling counts as whole non-negative values', () => {
    expect(getPaginationRange(10, 20, -1)).toEqual(
      getPaginationRange(10, 20, 0),
    );
    expect(getPaginationRange(10, 20, 1.7)).toEqual(
      getPaginationRange(10, 20, 1),
    );
  });

  it('uses distinct keys for the start and end ellipses', () => {
    const items = getPaginationRange(10, 20, 1);
    expect(items).toContainEqual({ type: 'ellipsis', key: 'start' });
    expect(items).toContainEqual({ type: 'ellipsis', key: 'end' });
  });

  it('always includes the first and last page for large counts', () => {
    for (let page = 1; page <= 50; page += 1) {
      const items = getPaginationRange(page, 50, 2);
      expect(items[0]).toEqual({ type: 'page', page: 1 });
      expect(items.at(-1)).toEqual({ type: 'page', page: 50 });
      expect(items).toContainEqual({ type: 'page', page });
    }
  });
});
