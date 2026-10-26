import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './scroll-area.css';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export type ScrollAreaScrollbar = 'auto' | 'visible' | 'hidden';

export type ScrollAreaProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> & {
  /** Axes that can scroll. Overflow on the other axis is clipped. Defaults to `vertical`. */
  orientation?: ScrollAreaOrientation;
  /**
   * `auto` shows the scrollbar on hover or while scrolling, `visible` always shows it when content overflows,
   * and `hidden` removes the scrollbar while keeping the content scrollable.
   */
  scrollbar?: ScrollAreaScrollbar;
  /** Fades the edges that have hidden content in the scroll direction. */
  fadeEdges?: boolean;
  /** Length of the edge fade, such as `"24px"`. Defaults to `--notable-scroll-area-fade-size`. */
  fadeSize?: string;
  /** Applied to the root wrapper. */
  className?: string;
  /** Applied to the root wrapper. */
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * A scrollable region with custom scrollbars. `className` and `style` apply to the root wrapper.
 * All other HTML attributes, and the ref, apply to the scrollable viewport, which is the focusable element.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      orientation = 'vertical',
      scrollbar = 'auto',
      fadeEdges = false,
      fadeSize,
      className,
      style,
      children,
      ...viewportProps
    },
    ref,
  ) {
    const hasVerticalAxis = orientation !== 'horizontal';
    const hasHorizontalAxis = orientation !== 'vertical';
    const hasScrollbars = scrollbar !== 'hidden';

    const rootClassName = [
      'notable-scroll-area',
      scrollbar === 'auto' && 'notable-scroll-area--auto-scrollbar',
      fadeEdges && 'notable-scroll-area--fade',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const rootStyle =
      fadeSize === undefined
        ? style
        : ({
            ...style,
            '--notable-scroll-area-fade-size': fadeSize,
          } as CSSProperties);

    // Base UI sets `overflow: scroll` inline. Clip the unused axis so only the chosen directions scroll.
    const viewportStyle: CSSProperties = {
      ...(hasVerticalAxis ? {} : { overflowY: 'hidden' }),
      ...(hasHorizontalAxis ? {} : { overflowX: 'hidden' }),
    };

    const keepScrollbarsMounted = scrollbar === 'visible';

    return (
      <BaseScrollArea.Root className={rootClassName} style={rootStyle}>
        <BaseScrollArea.Viewport
          ref={ref}
          className="notable-scroll-area__viewport"
          style={viewportStyle}
          {...viewportProps}
        >
          <BaseScrollArea.Content className="notable-scroll-area__content">
            {children}
          </BaseScrollArea.Content>
        </BaseScrollArea.Viewport>

        {hasScrollbars && hasVerticalAxis && (
          <BaseScrollArea.Scrollbar
            orientation="vertical"
            keepMounted={keepScrollbarsMounted}
            className="notable-scroll-area__scrollbar notable-scroll-area__scrollbar--vertical"
          >
            <BaseScrollArea.Thumb className="notable-scroll-area__thumb" />
          </BaseScrollArea.Scrollbar>
        )}

        {hasScrollbars && hasHorizontalAxis && (
          <BaseScrollArea.Scrollbar
            orientation="horizontal"
            keepMounted={keepScrollbarsMounted}
            className="notable-scroll-area__scrollbar notable-scroll-area__scrollbar--horizontal"
          >
            <BaseScrollArea.Thumb className="notable-scroll-area__thumb" />
          </BaseScrollArea.Scrollbar>
        )}

        {hasScrollbars && hasVerticalAxis && hasHorizontalAxis && (
          <BaseScrollArea.Corner className="notable-scroll-area__corner" />
        )}
      </BaseScrollArea.Root>
    );
  },
);
