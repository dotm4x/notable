import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { animate, useReducedMotion } from 'motion/react';
import {
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { DURATION_BASE, EASING_STANDARD } from '../../../styles/motion.js';
import { TabsPanelContext } from '../context.js';
import type { TabsContentProps } from '../types.js';

// Distance panels travel while fading; small enough to need no viewport clipping.
const PANEL_TRAVEL = 24;

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ className, value, ...props }, ref) {
    const context = useContext(TabsPanelContext);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const animationToken = useRef(0);
    const animationControls = useRef<ReturnType<typeof animate> | null>(null);
    const isFirstRender = useRef(true);
    const shouldReduceMotion = useReducedMotion();
    const isActive = context?.value === value;
    const [isExited, setIsExited] = useState(!isActive);

    useLayoutEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      const panel = panelRef.current;
      if (!context || !panel) {
        return;
      }

      const tabValues = Array.from(
        panel
          .closest('.one-tabs')
          ?.querySelectorAll<HTMLElement>(
            '[role="tab"][data-selector-value]',
          ) ?? [],
      ).map((tab) => tab.dataset.selectorValue);
      const isForward =
        tabValues.indexOf(context.value ?? undefined) >
        tabValues.indexOf(context.previousValue.current ?? undefined);
      const property = context.orientation === 'vertical' ? 'y' : 'x';
      const travel = shouldReduceMotion ? 0 : PANEL_TRAVEL;
      // Forward: the outgoing panel exits towards the start, the incoming one
      // enters from the end. Backward is the mirror image.
      const offset = (isForward ? 1 : -1) * travel;
      const token = ++animationToken.current;
      animationControls.current?.stop();
      const options = {
        duration: shouldReduceMotion ? 0 : DURATION_BASE,
        ease: EASING_STANDARD,
      };

      if (isActive) {
        setIsExited(false);
        // A panel reversed mid-exit continues from its current opacity and
        // offset rather than snapping back to the start of a full enter.
        animationControls.current = animate(
          panel,
          {
            opacity: isExited ? [0, 1] : [null, 1],
            [property]: isExited ? [offset, 0] : [null, 0],
          },
          options,
        );
        return;
      }

      const controls = animate(
        panel,
        { opacity: 0, [property]: -offset },
        options,
      );
      animationControls.current = controls;
      controls.then(() => {
        if (token === animationToken.current) {
          setIsExited(true);
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps -- only selection changes start a transition
    }, [isActive]);

    // Stop the in-flight transition on unmount so it cannot keep animating a detached panel.
    useEffect(
      () => () => {
        animationControls.current?.stop();
      },
      [],
    );

    return (
      <BaseTabs.Panel
        {...props}
        ref={(node) => {
          panelRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        keepMounted
        value={value}
        // Base UI hides a panel as soon as it deselects; hold it visible (and
        // inert) until the exit animation completes.
        hidden={!isActive && isExited}
        data-exiting={!isActive && !isExited ? '' : undefined}
        className={['one-tabs__content', className].filter(Boolean).join(' ')}
      />
    );
  },
);
