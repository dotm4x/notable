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

/**
 * `none` shows no edge indicator, `fade` fades the content at edges with hidden content,
 * and `blur` blurs the content at those edges, gradually sharpening toward the middle.
 * The blur needs `backdrop-filter` support. Without it, `blur` falls back to `fade`.
 */
export type ScrollAreaEdgeEffect = 'none' | 'fade' | 'blur';

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
  /**
   * Edge indicator for the sides that have hidden content in the scroll direction. Defaults to `none`.
   * Takes precedence over the deprecated `fadeEdges`.
   */
  edgeEffect?: ScrollAreaEdgeEffect;
  /**
   * Length of the edge effect, such as `"24px"`. Defaults to `--notable-scroll-area-fade-size`.
   * Takes precedence over the deprecated `fadeSize`.
   */
  edgeEffectSize?: string;
  /**
   * @deprecated Use `edgeEffect="fade"` instead.
   */
  fadeEdges?: boolean;
  /**
   * @deprecated Use `edgeEffectSize` instead.
   */
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
      edgeEffect,
      edgeEffectSize,
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
    const resolvedEdgeEffect: ScrollAreaEdgeEffect =
      edgeEffect ?? (fadeEdges ? 'fade' : 'none');

    const rootClassName = [
      'notable-scroll-area',
      scrollbar === 'auto' && 'notable-scroll-area--auto-scrollbar',
      resolvedEdgeEffect !== 'none' &&
        `notable-scroll-area--${resolvedEdgeEffect}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // `fadeSize` still sets the fade size that the edge size falls back to, so existing overrides keep working.
    const rootStyle: CSSProperties = {
      ...style,
      ...(fadeSize === undefined
        ? {}
        : { '--notable-scroll-area-fade-size': fadeSize }),
      ...(edgeEffectSize === undefined
        ? {}
        : { '--notable-scroll-area-edge-size': edgeEffectSize }),
    } as CSSProperties;

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
          <BaseScrollArea.Content
            className={
              hasHorizontalAxis
                ? 'notable-scroll-area__content'
                : 'notable-scroll-area__content notable-scroll-area__content--vertical'
            }
            // Overrides Base UI's inline `min-width: fit-content`, which would let content widen past the viewport.
            style={hasHorizontalAxis ? undefined : { minWidth: '100%' }}
          >
            {children}
          </BaseScrollArea.Content>
        </BaseScrollArea.Viewport>

        {resolvedEdgeEffect === 'blur' && (
          <>
            {hasVerticalAxis && (
              <>
                <div className="notable-scroll-area__edge notable-scroll-area__edge--top" />
                <div className="notable-scroll-area__edge notable-scroll-area__edge--bottom" />
              </>
            )}
            {hasHorizontalAxis && (
              <>
                <div className="notable-scroll-area__edge notable-scroll-area__edge--start" />
                <div className="notable-scroll-area__edge notable-scroll-area__edge--end" />
              </>
            )}
          </>
        )}

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
