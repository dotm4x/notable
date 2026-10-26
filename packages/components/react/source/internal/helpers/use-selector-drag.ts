import {
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
const DRAG_THRESHOLD = 3;

export type SelectorBounds = {
  left: number;
  width: number;
  top?: number;
  height?: number;
};

type SelectorDragState = {
  pointerId: number;
  startPosition: number;
  offset: number;
  moved: boolean;
};

export type SelectorDragItem<TValue extends string> = {
  value: TValue;
  disabled?: boolean;
};

type UseSelectorDragOptions<TValue extends string> = {
  containerRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
  indicatorBounds: SelectorBounds | null;
  getItems: () => readonly SelectorDragItem<TValue>[];
  getItemElement: (value: TValue) => HTMLElement | undefined;
  getItemBounds: (value: TValue) => SelectorBounds | null;
  onBoundsChange: (bounds: SelectorBounds) => void;
  onSelect: (value: TValue) => void;
  measureIndicator: () => void;
  selectedValue: TValue | undefined;
  orientation?: 'horizontal' | 'vertical';
};

export function useSelectorDrag<TValue extends string>({
  containerRef,
  disabled,
  indicatorBounds,
  getItems,
  getItemElement,
  getItemBounds,
  onBoundsChange,
  onSelect,
  measureIndicator,
  selectedValue,
  orientation = 'horizontal',
}: UseSelectorDragOptions<TValue>) {
  const dragRef = useRef<SelectorDragState | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const getItemAtPosition = useCallback(
    (clientPosition: number) => {
      let closestItem: SelectorDragItem<TValue> | undefined;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const item of getItems()) {
        const element = getItemElement(item.value);
        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        const center =
          orientation === 'vertical'
            ? rect.top + rect.height / 2
            : rect.left + rect.width / 2;
        const distance = Math.abs(clientPosition - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
        }
      }

      return closestItem;
    },
    [getItemElement, getItems, orientation],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      suppressClickRef.current = false;

      if (disabled || selectedValue === undefined || event.button !== 0) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const item = target.closest<HTMLElement>('[data-selector-item]');
      const isSelected =
        item?.dataset.selected !== undefined ||
        item?.getAttribute('aria-selected') === 'true';
      if (!item || !isSelected || !indicatorBounds) {
        return;
      }

      const container = containerRef.current;
      if (!container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const isVertical = orientation === 'vertical';
      const startPosition = isVertical ? event.clientY : event.clientX;
      const indicatorPosition = isVertical
        ? containerRect.top + container.clientTop + (indicatorBounds.top ?? 0)
        : containerRect.left + container.clientLeft + indicatorBounds.left;

      dragRef.current = {
        pointerId: event.pointerId,
        startPosition,
        offset: startPosition - indicatorPosition,
        moved: false,
      };

      try {
        container.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture may be unavailable in some test environments.
      }
    },
    [containerRef, disabled, indicatorBounds, orientation, selectedValue],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const container = containerRef.current;
      if (!drag || !container || drag.pointerId !== event.pointerId) {
        return;
      }

      if (
        !drag.moved &&
        Math.abs(
          (orientation === 'vertical' ? event.clientY : event.clientX) -
            drag.startPosition,
        ) < DRAG_THRESHOLD
      ) {
        return;
      }

      drag.moved = true;
      setIsDragging(true);

      const isVertical = orientation === 'vertical';
      const clientPosition = isVertical ? event.clientY : event.clientX;
      const item = getItemAtPosition(clientPosition);
      // Disabled options cannot receive a drag, so the indicator stays at its last valid position.
      if (!item || item.disabled) {
        return;
      }

      const itemBounds = item ? getItemBounds(item.value) : null;
      const items = getItems();
      const first = items[0];
      const last = items.at(-1);
      const firstBounds = first ? getItemBounds(first.value) : null;
      const lastBounds = last ? getItemBounds(last.value) : null;

      if (!itemBounds || !firstBounds || !lastBounds) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const pointerPosition =
        clientPosition -
        (isVertical
          ? containerRect.top + container.clientTop
          : containerRect.left + container.clientLeft) -
        drag.offset;

      if (isVertical) {
        const maximumTop =
          (lastBounds.top ?? 0) +
          (lastBounds.height ?? 0) -
          (itemBounds.height ?? 0);
        onBoundsChange({
          left: itemBounds.left,
          width: itemBounds.width,
          top: Math.max(
            firstBounds.top ?? 0,
            Math.min(pointerPosition, maximumTop),
          ),
          height: itemBounds.height,
        });
      } else {
        const maximumLeft =
          lastBounds.left + lastBounds.width - itemBounds.width;
        onBoundsChange({
          left: Math.max(
            firstBounds.left,
            Math.min(pointerPosition, maximumLeft),
          ),
          width: itemBounds.width,
        });
      }
    },
    [
      containerRef,
      getItemAtPosition,
      getItemBounds,
      getItems,
      onBoundsChange,
      orientation,
    ],
  );

  const finishDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
      const drag = dragRef.current;
      const container = containerRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      dragRef.current = null;
      setIsDragging(false);

      if (drag.moved) {
        suppressClickRef.current = true;
        const clientPosition =
          orientation === 'vertical' ? event.clientY : event.clientX;
        const item = cancelled ? undefined : getItemAtPosition(clientPosition);
        // Releasing over a disabled option keeps the previous selection; the
        // indicator then animates back to it via measureIndicator below.
        if (item && !item.disabled) {
          onSelect(item.value);
        }
      }

      if (container?.hasPointerCapture?.(event.pointerId)) {
        container.releasePointerCapture?.(event.pointerId);
      }

      measureIndicator();
    },
    [containerRef, getItemAtPosition, measureIndicator, onSelect, orientation],
  );

  const onClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [],
  );

  return {
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) =>
      finishDrag(event, false),
    onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) =>
      finishDrag(event, true),
    onClickCapture,
  };
}
