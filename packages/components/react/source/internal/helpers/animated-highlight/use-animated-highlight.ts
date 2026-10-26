import { useEffect, useState, type RefObject } from 'react';

/** Position and size of a highlight, relative to its container's padding box. */
export type HighlightBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type HighlightState = {
  /** Last measured target bounds. Kept while no target exists so the highlight can fade out in place. */
  bounds: HighlightBounds | null;
  /** Whether a valid target is currently highlighted. */
  hasTarget: boolean;
  /** Whether the next bounds update should be applied without animation (the first position). */
  isInitialPosition: boolean;
};

/**
 * Selects the element that receives the highlight. Base UI sets
 * `data-highlighted` on the active item and disabled items never become
 * highlight targets.
 */
const TARGET_SELECTOR = '[data-highlighted]:not([data-disabled])';

const INITIAL_STATE: HighlightState = {
  bounds: null,
  hasTarget: false,
  isInitialPosition: true,
};

/**
 * Measures the target relative to the container using layout offsets rather
 * than `getBoundingClientRect`. Offsets ignore transforms, so the measurement
 * stays correct while a popup is still scaling in. Scroll offsets of scrolled
 * ancestors between the target and the container are subtracted.
 */
function measureTarget(container: HTMLElement): HighlightBounds | null {
  const target = container.querySelector<HTMLElement>(TARGET_SELECTOR);
  if (!target) {
    return null;
  }

  let top = 0;
  let left = 0;
  let node: HTMLElement | null = target;

  while (node && node !== container) {
    const parent: HTMLElement | null =
      node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
    top += node.offsetTop;
    left += node.offsetLeft;
    if (parent && parent !== container) {
      top -= parent.scrollTop;
      left -= parent.scrollLeft;
    }
    node = parent;
  }

  if (!node) {
    return null;
  }

  return { top, left, width: target.offsetWidth, height: target.offsetHeight };
}

function isSameBounds(
  first: HighlightBounds | null,
  second: HighlightBounds | null,
): boolean {
  if (first === null || second === null) {
    return first === second;
  }
  return (
    first.top === second.top &&
    first.left === second.left &&
    first.width === second.width &&
    first.height === second.height
  );
}

/**
 * Tracks the highlighted item inside the element that contains the highlight
 * surface. The highlight element must be a direct child of the container that
 * holds the items, so that `parentElement` resolves to it.
 *
 * Measurements are batched into animation frames and refreshed when the
 * highlighted item changes, the container resizes, or any scrollable
 * descendant scrolls.
 */
export function useAnimatedHighlight(
  highlightRef: RefObject<HTMLElement | null>,
): HighlightState {
  const [state, setState] = useState<HighlightState>(INITIAL_STATE);

  useEffect(() => {
    const container = highlightRef.current?.parentElement;
    if (!container) {
      return;
    }

    let frame: number | null = null;

    const update = () => {
      frame = null;
      const nextBounds = measureTarget(container);

      setState((previous) => {
        if (nextBounds === null) {
          return previous.hasTarget
            ? { ...previous, hasTarget: false }
            : previous;
        }
        if (previous.hasTarget && isSameBounds(previous.bounds, nextBounds)) {
          return previous;
        }
        return {
          bounds: nextBounds,
          hasTarget: true,
          isInitialPosition: previous.bounds === null,
        };
      });
    };

    const scheduleUpdate = () => {
      if (frame === null) {
        frame = requestAnimationFrame(update);
      }
    };

    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-highlighted', 'data-disabled'],
    });

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(container);

    container.addEventListener('scroll', scheduleUpdate, {
      capture: true,
      passive: true,
    });

    scheduleUpdate();

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('scroll', scheduleUpdate, {
        capture: true,
      });
    };
  }, [highlightRef]);

  return state;
}
