import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { findHighlightTarget } from '../helpers/highlight.js';

type TUseSidebarHighlightOptions = {
  animateOnHover: boolean;
  sidebarRef: RefObject<HTMLElement | null>;
};

export function useSidebarHighlight({
  animateOnHover,
  sidebarRef,
}: TUseSidebarHighlightOptions) {
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
    if (!animateOnHover) {
      pointerTargetRef.current = null;
      highlightSourceRef.current = 'pointer';
      updateHighlight();
      return;
    }

    pointerTargetRef.current =
      event.pointerType === 'touch'
        ? null
        : findHighlightTarget(event.target, sidebarRef.current);
    highlightSourceRef.current = 'pointer';
    updateHighlight();
  };

  const handlePointerLeave = () => {
    pointerTargetRef.current = null;
    highlightSourceRef.current = 'pointer';
    updateHighlight();
  };

  const handleFocusCapture = (event: ReactFocusEvent<HTMLElement>) => {
    focusedTargetRef.current = animateOnHover
      ? findHighlightTarget(event.target, sidebarRef.current)
      : null;
    highlightSourceRef.current = 'focus';
    updateHighlight();
  };

  const handleBlurCapture = (event: ReactFocusEvent<HTMLElement>) => {
    focusedTargetRef.current = animateOnHover
      ? findHighlightTarget(event.relatedTarget, sidebarRef.current)
      : null;
    highlightSourceRef.current = 'focus';
    updateHighlight();
  };

  useEffect(() => {
    if (animateOnHover) {
      return;
    }

    pointerTargetRef.current = null;
    focusedTargetRef.current = null;
    updateHighlight();
  }, [animateOnHover, updateHighlight]);

  return {
    handlePointerOver,
    handlePointerLeave,
    handleFocusCapture,
    handleBlurCapture,
  };
}
