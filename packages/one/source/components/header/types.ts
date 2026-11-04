import type { HTMLAttributes, ReactNode } from 'react';

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
export type DynamicHeaderState = 'attached' | 'floating' | 'hidden';

export type ScrollTracker = {
  lastY: number;
  direction: -1 | 0 | 1;
  distance: number;
};
