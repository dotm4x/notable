import type { DynamicHeaderState, ScrollTracker } from '../types.js';

/** Scroll offset at which a dynamic header stops being attached to the top. */
export const FLOAT_THRESHOLD = 80;
/** Scroll offset at or below which a dynamic header is attached again. */
const TOP_THRESHOLD = 8;
/** Downward scroll distance required before a floating header hides. */
const HIDE_DISTANCE = 72;
/** Upward scroll distance required before a hidden header reappears. */
const REVEAL_DISTANCE = 16;

/**
 * Computes the next dynamic header state from a scroll event. Direction
 * changes reset the accumulated distance, so small jitter does not toggle
 * the header.
 */
export function reduceDynamicHeaderState(
  state: DynamicHeaderState,
  scrollY: number,
  tracker: ScrollTracker,
  canHide: boolean,
): DynamicHeaderState {
  const next = resolveNextState(state, scrollY, tracker, canHide);
  if (next !== state) {
    tracker.distance = 0;
  }
  return next;
}

function resolveNextState(
  state: DynamicHeaderState,
  scrollY: number,
  tracker: ScrollTracker,
  canHide: boolean,
): DynamicHeaderState {
  const delta = scrollY - tracker.lastY;
  tracker.lastY = scrollY;

  if (scrollY <= TOP_THRESHOLD) {
    tracker.direction = 0;
    return 'attached';
  }

  if (delta === 0) {
    return state;
  }

  const direction = delta > 0 ? 1 : -1;
  if (direction !== tracker.direction) {
    tracker.direction = direction;
    tracker.distance = 0;
  }
  tracker.distance += Math.abs(delta);

  if (state === 'attached') {
    return scrollY > FLOAT_THRESHOLD ? 'floating' : 'attached';
  }

  if (
    state === 'floating' &&
    direction === 1 &&
    canHide &&
    tracker.distance >= HIDE_DISTANCE
  ) {
    return 'hidden';
  }

  if (
    state === 'hidden' &&
    direction === -1 &&
    tracker.distance >= REVEAL_DISTANCE
  ) {
    return 'floating';
  }

  return state;
}
