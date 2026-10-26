import { renderHook } from '@testing-library/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  useSelectorDrag,
  type SelectorBounds,
  type SelectorDragItem,
} from './use-selector-drag.js';

type Value = 'day' | 'week' | 'month';

const ITEMS: readonly SelectorDragItem<Value>[] = [
  { value: 'day' },
  { value: 'week' },
  { value: 'month', disabled: true },
];

const ITEM_BOUNDS: Record<Value, SelectorBounds> = {
  day: { left: 0, width: 100 },
  week: { left: 100, width: 100 },
  month: { left: 200, width: 100 },
};

function createPointerEvent(
  target: Element,
  clientX: number,
): ReactPointerEvent<HTMLDivElement> {
  return {
    target,
    button: 0,
    pointerId: 1,
    clientX,
    clientY: 0,
  } as unknown as ReactPointerEvent<HTMLDivElement>;
}

function setUp() {
  const container = document.createElement('div');
  const elements = new Map<Value, HTMLElement>();
  for (const item of ITEMS) {
    const element = document.createElement('div');
    element.dataset.selectorItem = '';
    element.dataset.selectorValue = item.value;
    if (item.value === 'day') {
      element.dataset.selected = '';
    }
    element.getBoundingClientRect = () =>
      ({
        left: ITEM_BOUNDS[item.value].left,
        width: ITEM_BOUNDS[item.value].width,
        top: 0,
        height: 40,
        right: 0,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    container.append(element);
    elements.set(item.value, element);
  }
  container.getBoundingClientRect = () =>
    ({
      left: 0,
      top: 0,
      width: 300,
      height: 40,
      right: 300,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  document.body.append(container);

  const onBoundsChange = vi.fn<(bounds: SelectorBounds) => void>();
  const onSelect = vi.fn<(value: Value) => void>();
  const measureIndicator = vi.fn();
  const containerRef = { current: container };

  const { result } = renderHook(() =>
    useSelectorDrag<Value>({
      containerRef,
      disabled: false,
      indicatorBounds: ITEM_BOUNDS.day,
      getItems: () => ITEMS,
      getItemElement: (value) => elements.get(value),
      getItemBounds: (value) => ITEM_BOUNDS[value],
      onBoundsChange,
      onSelect,
      measureIndicator,
      selectedValue: 'day',
    }),
  );

  const selectedElement = elements.get('day');
  if (!selectedElement) {
    throw new Error('Expected the selected item element to exist');
  }

  return {
    result,
    container,
    selectedElement,
    onBoundsChange,
    onSelect,
    measureIndicator,
  };
}

describe('useSelectorDrag', () => {
  it('moves the indicator with the pointer over enabled options', () => {
    // Arrange
    const { result, selectedElement, onBoundsChange } = setUp();

    // Act
    result.current.onPointerDown(createPointerEvent(selectedElement, 40));
    result.current.onPointerMove(createPointerEvent(selectedElement, 150));

    // Assert
    expect(onBoundsChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ left: 110, width: 100 }),
    );
  });

  it('does not move the indicator onto a disabled option', () => {
    // Arrange
    const { result, selectedElement, onBoundsChange } = setUp();
    result.current.onPointerDown(createPointerEvent(selectedElement, 40));
    result.current.onPointerMove(createPointerEvent(selectedElement, 150));
    onBoundsChange.mockClear();

    // Act
    result.current.onPointerMove(createPointerEvent(selectedElement, 240));

    // Assert
    expect(onBoundsChange).not.toHaveBeenCalled();
  });

  it('keeps the previous selection when released over a disabled option', () => {
    // Arrange
    const { result, selectedElement, onSelect, measureIndicator } = setUp();
    result.current.onPointerDown(createPointerEvent(selectedElement, 40));
    result.current.onPointerMove(createPointerEvent(selectedElement, 150));

    // Act
    result.current.onPointerUp(createPointerEvent(selectedElement, 240));

    // Assert
    expect(onSelect).not.toHaveBeenCalled();
    expect(measureIndicator).toHaveBeenCalled();
  });
});
