import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { motion, useReducedMotion } from 'motion/react';
import {
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { AnimatedHighlight } from '../../../internal/primitives/animated-highlight/animated-highlight.js';
import {
  useSelectorDrag,
  type SelectorBounds,
  type SelectorDragItem,
} from '../../../internal/helpers/use-selector-drag.js';
import { SPRING_LAYOUT } from '../../../styles/motion.js';
import { TabsHighlightContext, TabsPanelContext } from '../context.js';
import type { TabsListProps } from '../types.js';

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList(
    {
      children,
      className,
      onBlur,
      onClickCapture,
      onFocus,
      onPointerCancel,
      onPointerDown,
      onPointerLeave,
      onPointerMove,
      onPointerOver,
      onPointerUp,
      ...props
    },
    ref,
  ) {
    const listRef = useRef<HTMLDivElement | null>(null);
    const [indicatorBounds, setIndicatorBounds] =
      useState<SelectorBounds | null>(null);
    const [isVertical, setIsVertical] = useState(false);
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);
    const [focusedValue, setFocusedValue] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();
    // The pointer takes precedence over keyboard focus, which keeps its highlight once the pointer leaves.
    const highlightedValue = hoveredValue ?? focusedValue;

    const getHighlightableValue = useCallback((target: EventTarget | null) => {
      const list = listRef.current;
      const tab =
        target instanceof Element
          ? target.closest<HTMLElement>('[role="tab"][data-selector-value]')
          : null;
      if (
        !list ||
        !tab ||
        !list.contains(tab) ||
        tab.hasAttribute('data-disabled')
      ) {
        return null;
      }

      return tab.dataset.selectorValue ?? null;
    }, []);

    const getItems = useCallback(() => {
      const list = listRef.current;
      if (!list) {
        return [];
      }

      return Array.from(
        list.querySelectorAll<HTMLElement>('[role="tab"][data-selector-value]'),
      ).map<SelectorDragItem<string>>((tab) => ({
        value: tab.dataset.selectorValue ?? '',
        disabled: tab.getAttribute('aria-disabled') === 'true',
      }));
    }, []);

    const getItemElement = useCallback((value: string) => {
      const list = listRef.current;
      if (!list) {
        return undefined;
      }

      return Array.from(
        list.querySelectorAll<HTMLElement>('[role="tab"][data-selector-value]'),
      ).find((tab) => tab.dataset.selectorValue === value);
    }, []);

    const getItemBounds = useCallback(
      (value: string): SelectorBounds | null => {
        const list = listRef.current;
        const tab = getItemElement(value);
        if (!list || !tab) {
          return null;
        }

        const listRect = list.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        return {
          left: tabRect.left - listRect.left - list.clientLeft,
          width: tabRect.width,
          top: tabRect.top - listRect.top - list.clientTop,
          height: tabRect.height,
        };
      },
      [getItemElement],
    );

    const selectTab = useCallback(
      (value: string) => {
        getItemElement(value)?.focus();
      },
      [getItemElement],
    );

    const measureIndicator = useCallback(() => {
      const list = listRef.current;
      const activeTab = list?.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]',
      );

      if (!list || !activeTab) {
        setIndicatorBounds(null);
        return;
      }

      const listRect = list.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      const vertical =
        list.closest('.one-tabs')?.getAttribute('data-orientation') ===
        'vertical';
      setIsVertical(vertical);
      setIndicatorBounds({
        left: tabRect.left - listRect.left - list.clientLeft,
        width: tabRect.width,
        top: tabRect.top - listRect.top - list.clientTop,
        height: tabRect.height,
      });
    }, []);

    const panelContext = useContext(TabsPanelContext);
    const selectedValue = panelContext?.value ?? undefined;

    const drag = useSelectorDrag({
      containerRef: listRef,
      disabled: false,
      indicatorBounds,
      getItems,
      getItemElement,
      getItemBounds,
      onBoundsChange: setIndicatorBounds,
      onSelect: selectTab,
      measureIndicator,
      selectedValue,
      orientation: isVertical ? 'vertical' : 'horizontal',
    });

    const setListRef = useCallback(
      (element: HTMLDivElement | null) => {
        listRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref],
    );

    useLayoutEffect(() => {
      const list = listRef.current;
      if (!list) {
        return;
      }

      measureIndicator();
      const mutationObserver = new MutationObserver(measureIndicator);
      mutationObserver.observe(list, {
        attributes: true,
        subtree: true,
        attributeFilter: ['aria-selected'],
      });

      const resizeObserver =
        typeof ResizeObserver === 'undefined'
          ? undefined
          : new ResizeObserver(measureIndicator);
      resizeObserver?.observe(list);
      for (const tab of list.querySelectorAll<HTMLElement>('[role="tab"]')) {
        resizeObserver?.observe(tab);
      }
      window.addEventListener('resize', measureIndicator);

      return () => {
        mutationObserver.disconnect();
        resizeObserver?.disconnect();
        window.removeEventListener('resize', measureIndicator);
      };
    }, [children, measureIndicator]);

    return (
      <BaseTabs.List
        {...props}
        ref={setListRef}
        activateOnFocus
        className={['one-tabs__list', className].filter(Boolean).join(' ')}
        data-dragging={drag.isDragging || undefined}
        onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
          onPointerDown?.(event);
          drag.onPointerDown(event);
        }}
        onPointerMove={(event: ReactPointerEvent<HTMLDivElement>) => {
          onPointerMove?.(event);
          drag.onPointerMove(event);
        }}
        onPointerUp={(event: ReactPointerEvent<HTMLDivElement>) => {
          onPointerUp?.(event);
          drag.onPointerUp(event);
        }}
        onPointerCancel={(event: ReactPointerEvent<HTMLDivElement>) => {
          onPointerCancel?.(event);
          drag.onPointerCancel(event);
        }}
        onClickCapture={(event: ReactMouseEvent<HTMLDivElement>) => {
          onClickCapture?.(event);
          drag.onClickCapture(event);
        }}
        onFocus={(event: ReactFocusEvent<HTMLDivElement>) => {
          onFocus?.(event);
          const isKeyboardFocus =
            event.target instanceof Element &&
            event.target.matches(':focus-visible');
          setFocusedValue(
            isKeyboardFocus ? getHighlightableValue(event.target) : null,
          );
        }}
        onBlur={(event: ReactFocusEvent<HTMLDivElement>) => {
          onBlur?.(event);
          setFocusedValue(null);
        }}
        onPointerOver={(event: ReactPointerEvent<HTMLDivElement>) => {
          onPointerOver?.(event);
          if (event.pointerType === 'touch') {
            return;
          }
          setHoveredValue(getHighlightableValue(event.target));
        }}
        onPointerLeave={(event: ReactPointerEvent<HTMLDivElement>) => {
          onPointerLeave?.(event);
          setHoveredValue(null);
        }}
      >
        <TabsHighlightContext.Provider value={highlightedValue}>
          <AnimatedHighlight className="one-tabs__highlight" />
          {children}
        </TabsHighlightContext.Provider>
        {indicatorBounds && (
          <motion.span
            className="one-tabs__indicator"
            data-orientation={isVertical ? 'vertical' : 'horizontal'}
            aria-hidden="true"
            initial={false}
            animate={
              isVertical
                ? {
                    top: indicatorBounds.top ?? 0,
                    height: indicatorBounds.height ?? 0,
                  }
                : {
                    left: indicatorBounds.left,
                    width: indicatorBounds.width,
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : drag.isDragging
                  ? {
                      left: { duration: 0 },
                      top: { duration: 0 },
                      width: SPRING_LAYOUT,
                      height: SPRING_LAYOUT,
                    }
                  : SPRING_LAYOUT
            }
          />
        )}
      </BaseTabs.List>
    );
  },
);
