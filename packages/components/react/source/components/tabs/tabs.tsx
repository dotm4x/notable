import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { animate, motion, useReducedMotion } from 'motion/react';
import {
  DURATION_BASE,
  EASING_STANDARD,
  SPRING_LAYOUT,
} from '../../styles/motion.js';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import {
  useSelectorDrag,
  type SelectorBounds,
  type SelectorDragItem,
} from '../../internal/helpers/use-selector-drag.js';
import './tabs.css';

/** Orientation of the tab list. */
export type TabsOrientation = 'horizontal' | 'vertical';

/** Props for {@link Tabs}, in addition to native `div` attributes. */
export type TabsProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  /** Selected tab value in controlled mode. Pass `null` to select no tab. */
  value?: string | null;
  /** Initial selected tab value in uncontrolled mode. */
  defaultValue?: string | null;
  /** Called when the selected tab changes. */
  onValueChange?: (value: string | null) => void;
  /** Tab list orientation. Defaults to `horizontal`. */
  orientation?: TabsOrientation;
};

/** Props for `Tabs.List`. */
export type TabsListProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Tabs.Trigger`, in addition to native button attributes. */
export type TabsTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value'
> & {
  /** Value associated with the corresponding `Tabs.Content`. */
  value: string;
};

/** Props for `Tabs.Content`, in addition to native `div` attributes. */
export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Value associated with the corresponding `Tabs.Trigger`. */
  value: string;
};

type TabsPanelContextValue = {
  orientation: TabsOrientation;
  previousValue: { current: string | null };
  value: string | null;
};

const TabsPanelContext = createContext<TabsPanelContextValue | null>(null);

// Value of the tab currently showing the shared animated highlight.
const TabsHighlightContext = createContext<string | null>(null);

// Distance panels travel while fading; small enough to need no viewport clipping.
const PANEL_TRAVEL = 24;

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    className,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    value,
    ...props
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? null,
  );
  const selectedValue = value === undefined ? uncontrolledValue : value;
  const previousValue = useRef(selectedValue);

  // Runs after the panels' own layout effects, which still read the old value.
  useLayoutEffect(() => {
    previousValue.current = selectedValue;
  }, [selectedValue]);

  return (
    <TabsPanelContext.Provider
      value={{ orientation, previousValue, value: selectedValue }}
    >
      <BaseTabs.Root
        {...props}
        ref={ref}
        className={['notable-tabs', className].filter(Boolean).join(' ')}
        orientation={orientation}
        data-orientation={orientation}
        defaultValue={defaultValue}
        value={value}
        onValueChange={(nextValue) => {
          setUncontrolledValue(nextValue);
          onValueChange?.(nextValue);
        }}
      />
    </TabsPanelContext.Provider>
  );
});

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
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
  const [indicatorBounds, setIndicatorBounds] = useState<SelectorBounds | null>(
    null,
  );
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
      list.closest('.notable-tabs')?.getAttribute('data-orientation') ===
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
      className={['notable-tabs__list', className].filter(Boolean).join(' ')}
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
        <AnimatedHighlight className="notable-tabs__highlight" />
        {children}
      </TabsHighlightContext.Provider>
      {indicatorBounds && (
        <motion.span
          className="notable-tabs__indicator"
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
});

const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(
  function TabsTrigger(
    { children, className, type = 'button', ...props },
    ref,
  ) {
    const highlightedValue = useContext(TabsHighlightContext);
    const isHighlighted = !props.disabled && highlightedValue === props.value;

    return (
      <BaseTabs.Tab
        {...props}
        ref={ref}
        type={type}
        data-selector-value={props.value}
        data-highlighted={isHighlighted || undefined}
        data-selector-item
        className={['notable-tabs__trigger', className]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="notable-tabs__trigger-label">{children}</span>
      </BaseTabs.Tab>
    );
  },
);

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
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
          .closest('.notable-tabs')
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
        className={['notable-tabs__content', className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  },
);

/**
 * Compound tabs with automatic keyboard activation. Inactive content panels
 * remain mounted but hidden, preserving their state between tab changes.
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
