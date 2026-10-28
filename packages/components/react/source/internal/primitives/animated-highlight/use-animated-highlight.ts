import type { RefObject } from 'react';
import { useEffect } from 'react';

/** Position, size, and corner radius of a highlight, relative to its container's padding box. */
export type HighlightBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
  /** Target's corner radius in pixels, clamped to half its shortest side. */
  radius: number;
};

export type HighlightUpdate = {
  /** Measured target bounds. Kept while no target exists so the highlight can fade out in place. */
  bounds: HighlightBounds | null;
  /** Whether a valid target is currently highlighted. */
  hasTarget: boolean;
  /**
   * Whether the bounds should be applied without animation. True for the first
   * position, for movement of the same target, and for any change while the
   * container is scrolling, so the highlight stays locked to the content.
   */
  skipAnimation: boolean;
};

/**
 * Selects the element that receives the highlight. Base UI sets
 * `data-highlighted` on the active item and disabled items never become
 * highlight targets.
 */
const TARGET_SELECTOR = '[data-highlighted]:not([data-disabled])';

/** Time without scroll events after which the highlight animates target changes again. */
const SCROLL_SETTLE_MS = 150;

/**
 * Resolves the target's top-left corner radius to pixels. Percentages are
 * relative to the shortest side, and the result is clamped so that fully
 * rounded targets (such as circles) stay round.
 */
function resolveRadius(target: HTMLElement, width: number, height: number) {
  const value = getComputedStyle(target).borderTopLeftRadius;
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) {
    return 0;
  }
  const shortestSide = Math.min(width, height);
  const pixels = value.endsWith('%') ? (amount / 100) * shortestSide : amount;
  return Math.min(Math.max(pixels, 0), shortestSide / 2);
}

/**
 * Measures the target relative to the container using layout offsets rather
 * than `getBoundingClientRect`. Offsets ignore transforms, so the measurement
 * stays correct while a popup is still scaling in. Scroll offsets of scrolled
 * ancestors between the target and the container are subtracted.
 */
function measureTarget(
  container: HTMLElement,
  target: HTMLElement,
): HighlightBounds | null {
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

  const width = target.offsetWidth;
  const height = target.offsetHeight;
  return {
    top,
    left,
    width,
    height,
    radius: resolveRadius(target, width, height),
  };
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
    first.height === second.height &&
    first.radius === second.radius
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
  onUpdate: (update: HighlightUpdate) => void,
): void {
  useEffect(() => {
    const container = highlightRef.current?.parentElement;
    if (!container) {
      return;
    }

    let frame: number | null = null;
    let scrolling = false;
    let settleTimer: number | null = null;
    let lastTarget: HTMLElement | null = null;
    let lastBounds: HighlightBounds | null = null;
    let lastHasTarget = false;

    const update = () => {
      frame = null;
      const target = container.querySelector<HTMLElement>(TARGET_SELECTOR);
      const nextBounds = target ? measureTarget(container, target) : null;

      if (target === null || nextBounds === null) {
        if (lastHasTarget) {
          lastHasTarget = false;
          onUpdate({
            bounds: lastBounds,
            hasTarget: false,
            skipAnimation: false,
          });
        }
        return;
      }

      if (
        lastHasTarget &&
        lastTarget === target &&
        isSameBounds(lastBounds, nextBounds)
      ) {
        return;
      }

      // While content scrolls under a stationary pointer, the highlighted item
      // changes every frame. Those changes follow the content, so they are not
      // animated.
      const skipAnimation =
        scrolling || lastBounds === null || lastTarget === target;

      lastTarget = target;
      lastBounds = nextBounds;
      lastHasTarget = true;
      onUpdate({ bounds: nextBounds, hasTarget: true, skipAnimation });
    };

    const scheduleUpdate = () => {
      if (frame === null) {
        frame = requestAnimationFrame(update);
      }
    };

    // Scrolling moves the content under the highlight, so it is measured in the
    // scroll event itself rather than a frame later, which would trail the content.
    const handleScroll = () => {
      scrolling = true;
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
      }
      settleTimer = window.setTimeout(() => {
        scrolling = false;
        settleTimer = null;
      }, SCROLL_SETTLE_MS);
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      update();
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

    container.addEventListener('scroll', handleScroll, {
      capture: true,
      passive: true,
    });

    scheduleUpdate();

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
      }
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('scroll', handleScroll, {
        capture: true,
      });
    };
  }, [highlightRef, onUpdate]);
}
