import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useCallback, useRef } from 'react';
import { DURATION_FAST, SPRING_HIGHLIGHT } from '../../../styles/motion.js';
import './animated-highlight.css';
import {
  useAnimatedHighlight,
  type HighlightUpdate,
} from './use-animated-highlight.js';

/** Props for {@link AnimatedHighlight}. */
export type AnimatedHighlightProps = {
  /** Extra class for component-specific shape, such as corner radii. */
  className?: string;
  /**
   * Morphs the corner radius to match the highlighted item, so circular and
   * rounded items keep their shape while the highlight moves between them.
   */
  followTargetShape?: boolean;
};

/**
 * A single background surface that glides between highlighted items. Render it
 * as the first child of a positioned container that holds the items, and mark
 * the highlighted item with `data-highlighted`.
 */
export function AnimatedHighlight({
  className,
  followTargetShape = false,
}: AnimatedHighlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const radius = useMotionValue(0);
  const opacity = useMotionValue(0);
  const borderRadius = useTransform(radius, (value) => `${value}px`);

  const handleUpdate = useCallback(
    ({ bounds, hasTarget, skipAnimation }: HighlightUpdate) => {
      const instant = prefersReducedMotion || skipAnimation;
      const apply = (value: MotionValue<number>, to: number) => {
        if (instant) {
          value.jump(to);
        } else {
          animate(value, to, SPRING_HIGHLIGHT);
        }
      };

      apply(x, bounds?.left ?? 0);
      apply(y, bounds?.top ?? 0);
      apply(width, bounds?.width ?? 0);
      apply(height, bounds?.height ?? 0);
      apply(radius, bounds?.radius ?? 0);

      const targetOpacity = hasTarget ? 1 : 0;
      if (instant) {
        opacity.jump(targetOpacity);
      } else {
        animate(opacity, targetOpacity, { duration: DURATION_FAST });
      }
    },
    [prefersReducedMotion, x, y, width, height, radius, opacity],
  );

  useAnimatedHighlight(ref, handleUpdate);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={['notable-animated-highlight', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        x,
        y,
        width,
        height,
        opacity,
        ...(followTargetShape && { borderRadius }),
      }}
    />
  );
}
