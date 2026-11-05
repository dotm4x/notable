import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { findHighlightTarget } from './find-highlight-target.js';

type TUseHighlightTargetOptions = {
  enabled: boolean;
  containerRef: RefObject<HTMLElement | null>;
  selector: string;
};

export function useHighlightTarget({
  enabled,
  containerRef,
  selector,
}: TUseHighlightTargetOptions) {
  const pointerTargetRef = useRef<HTMLElement | null>(null);
  const focusedTargetRef = useRef<HTMLElement | null>(null);
  const highlightedTargetRef = useRef<HTMLElement | null>(null);
  const highlightSourceRef = useRef<'pointer' | 'focus'>('pointer');

  const updateHighlight = useCallback(() => {
    const nextTarget =
      highlightSourceRef.current === 'pointer'
        ? (pointerTargetRef.current ?? focusedTargetRef.current)
        : (focusedTargetRef.current ?? pointerTargetRef.current);
    const previousTarget = highlightedTargetRef.current;

    if (previousTarget === nextTarget) {
      return;
    }

    previousTarget?.removeAttribute('data-highlighted');
    nextTarget?.setAttribute('data-highlighted', '');
    highlightedTargetRef.current = nextTarget;
  }, []);

  const handlePointerOver = (event: ReactPointerEvent<HTMLElement>) => {
    if (!enabled) {
      pointerTargetRef.current = null;
      highlightSourceRef.current = 'pointer';
      updateHighlight();
      return;
    }

    pointerTargetRef.current =
      event.pointerType === 'touch'
        ? null
        : findHighlightTarget(event.target, containerRef.current, selector);
    highlightSourceRef.current = 'pointer';
    updateHighlight();
  };

  const handlePointerLeave = () => {
    pointerTargetRef.current = null;
    highlightSourceRef.current = 'pointer';
    updateHighlight();
  };

  const handleFocusCapture = (event: ReactFocusEvent<HTMLElement>) => {
    focusedTargetRef.current = enabled
      ? findHighlightTarget(event.target, containerRef.current, selector)
      : null;
    highlightSourceRef.current = 'focus';
    updateHighlight();
  };

  const handleBlurCapture = (event: ReactFocusEvent<HTMLElement>) => {
    focusedTargetRef.current = enabled
      ? findHighlightTarget(event.relatedTarget, containerRef.current, selector)
      : null;
    highlightSourceRef.current = 'focus';
    updateHighlight();
  };

  useEffect(() => {
    if (enabled) {
      return;
    }

    pointerTargetRef.current = null;
    focusedTargetRef.current = null;
    updateHighlight();
  }, [enabled, updateHighlight]);

  return {
    handlePointerOver,
    handlePointerLeave,
    handleFocusCapture,
    handleBlurCapture,
  };
}
