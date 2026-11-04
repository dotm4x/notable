import { useEffect, useState, type RefObject } from 'react';
import {
  FLOAT_THRESHOLD,
  reduceDynamicHeaderState,
} from '../helpers/dynamic-state.js';
import type { DynamicHeaderState, ScrollTracker } from '../types.js';

/**
 * Tracks window scroll and returns the dynamic header state. The listener is
 * only attached while `enabled` is true.
 */
export function useDynamicHeaderState(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): DynamicHeaderState {
  const [state, setState] = useState<DynamicHeaderState>('attached');

  useEffect(() => {
    if (!enabled) {
      setState('attached');
      return;
    }

    const tracker: ScrollTracker = {
      lastY: window.scrollY,
      direction: 0,
      distance: 0,
    };
    let current: DynamicHeaderState =
      window.scrollY > FLOAT_THRESHOLD ? 'floating' : 'attached';
    setState(current);

    const handleScroll = () => {
      const canHide = !elementRef.current?.contains(document.activeElement);
      const next = reduceDynamicHeaderState(
        current,
        window.scrollY,
        tracker,
        canHide,
      );
      if (next !== current) {
        current = next;
        setState(next);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, elementRef]);

  return state;
}
