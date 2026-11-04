import { forwardRef, useCallback, useRef } from 'react';
import { useDynamicHeaderState } from './hooks/use-dynamic-header-state.js';
import type { HeaderProps } from './types.js';
import './header.css';

export type { HeaderMode, HeaderProps } from './types.js';

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
    'one-header',
    `one-header--${mode}`,
    isDynamic && `one-header--${state}`,
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
