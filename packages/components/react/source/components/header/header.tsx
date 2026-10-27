import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import './header.css';

/** Positioning behavior of the header. */
export type HeaderMode = 'normal' | 'fixed' | 'dynamic';

/** Props for {@link Header}, in addition to native `header` attributes. */
export type HeaderProps = HTMLAttributes<HTMLElement> & {
  /**
   * `normal` stays in the document flow. `fixed` stays at the top of its
   * scroll container. `dynamic` floats after scrolling, hides on scroll down,
   * and reappears on scroll up.
   * @default 'normal'
   */
  mode?: HeaderMode;
  /** Logo, navigation, actions, or any other header content. */
  children?: ReactNode;
};

/** Visual state of a `dynamic` header. */
type DynamicHeaderState = 'attached' | 'floating' | 'hidden';

type ScrollTracker = {
  lastY: number;
  direction: -1 | 0 | 1;
  distance: number;
};

/** Scroll offset at which a dynamic header stops being attached to the top. */
const FLOAT_THRESHOLD = 80;
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
function reduceDynamicHeaderState(
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

/**
 * Tracks window scroll and returns the dynamic header state. The listener is
 * only attached while `enabled` is true.
 */
function useDynamicHeaderState(
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

/**
 * Renders a page header. `normal` stays in the flow, `fixed` sticks to the
 * top of its scroll container, and `dynamic` changes its presentation with
 * scroll direction. Layout and content come entirely from children.
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { mode = 'normal', children, className, ...props },
  ref,
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const state = useDynamicHeaderState(elementRef, mode === 'dynamic');

  const setElement = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const isDynamic = mode === 'dynamic';
  const isHidden = isDynamic && state === 'hidden';
  const classes = [
    'notable-header',
    `notable-header--${mode}`,
    isDynamic && `notable-header--${state}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header
      ref={setElement}
      className={classes}
      data-mode={mode}
      data-state={isDynamic ? state : undefined}
      inert={isHidden}
      {...props}
    >
      {children}
    </header>
  );
});
