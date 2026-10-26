import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { DURATION_FAST, SPRING_HIGHLIGHT } from '../../../styles/motion.js';
import './animated-highlight.css';
import { useAnimatedHighlight } from './use-animated-highlight.js';

/** Props for {@link AnimatedHighlight}. */
export type AnimatedHighlightProps = {
  /** Extra class for component-specific shape, such as corner radii. */
  className?: string;
};

/**
 * A single background surface that glides between highlighted items. Render it
 * as the first child of a positioned container that holds the items, and mark
 * the highlighted item with `data-highlighted`.
 */
export function AnimatedHighlight({ className }: AnimatedHighlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { bounds, hasTarget, isInitialPosition } = useAnimatedHighlight(ref);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const instant = prefersReducedMotion || isInitialPosition;
  const movement = instant ? { duration: 0 } : SPRING_HIGHLIGHT;

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={['notable-animated-highlight', className]
        .filter(Boolean)
        .join(' ')}
      initial={false}
      animate={{
        x: bounds?.left ?? 0,
        y: bounds?.top ?? 0,
        width: bounds?.width ?? 0,
        height: bounds?.height ?? 0,
        opacity: hasTarget ? 1 : 0,
      }}
      transition={{
        x: movement,
        y: movement,
        width: movement,
        height: movement,
        opacity: { duration: prefersReducedMotion ? 0 : DURATION_FAST },
      }}
    />
  );
}
