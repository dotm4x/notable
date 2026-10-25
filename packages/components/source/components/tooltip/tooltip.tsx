import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import './tooltip.css';

/** Preferred side of the trigger where the tooltip is displayed. */
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

type TooltipPosition = {
  x: number;
  y: number;
  placement: TooltipPlacement;
};

type TooltipContentStyle = CSSProperties & {
  '--notable-tooltip-delay': string;
};

/** Props for {@link Tooltip}. */
export type TooltipProps = {
  /** Single trigger element; must accept the `aria-describedby` attribute. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** Additional CSS class for the trigger wrapper. */
  className?: string;
  /** Text displayed in the tooltip. */
  content: string;
  /** Delay before showing the tooltip, in milliseconds. Defaults to `350`. */
  delay?: number;
  /** Prevents the tooltip from being shown. Defaults to `false`. */
  disabled?: boolean;
  /** Preferred position; adjusts to fit within the viewport. */
  placement?: TooltipPlacement;
};

/**
 * Adds a tooltip that appears on hover or focus. Renders it in a portal and
 * associates it with the trigger using `aria-describedby`.
 */
export function Tooltip({
  children,
  className,
  content,
  delay = 350,
  disabled = false,
  placement = 'top',
}: TooltipProps) {
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const existingDescription = children.props['aria-describedby'];
  const describedBy = disabled
    ? existingDescription
    : [existingDescription, tooltipId].filter(Boolean).join(' ');
  const trigger = cloneElement(children, {
    'aria-describedby': describedBy,
  });

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useLayoutEffect(() => {
    if (disabled) {
      return;
    }

    const wrapper = wrapperRef.current;
    const tooltip = tooltipRef.current;
    const triggerElement = wrapper?.firstElementChild;

    if (!wrapper || !tooltip || !(triggerElement instanceof HTMLElement)) {
      return;
    }

    const updatePosition = () => {
      const triggerRect = triggerElement.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const gap = 8;
      const margin = 8;
      const space = {
        top: triggerRect.top - viewportTop - margin,
        right: viewportLeft + viewportWidth - triggerRect.right - margin,
        bottom: viewportTop + viewportHeight - triggerRect.bottom - margin,
        left: triggerRect.left - viewportLeft - margin,
      };
      const opposite: Record<TooltipPlacement, TooltipPlacement> = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      };
      const candidates = [
        placement,
        opposite[placement],
        ...(placement === 'top' || placement === 'bottom'
          ? (['right', 'left'] as const)
          : (['top', 'bottom'] as const)),
      ];
      const fits = (candidate: TooltipPlacement) =>
        space[candidate] >=
        (candidate === 'top' || candidate === 'bottom'
          ? tooltipRect.height
          : tooltipRect.width) +
          gap;
      const resolvedPlacement =
        candidates.find(fits) ??
        candidates.reduce((best, candidate) =>
          space[candidate] > space[best] ? candidate : best,
        );
      const centeredX =
        triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      const centeredY =
        triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      const rawX =
        resolvedPlacement === 'right'
          ? triggerRect.right + gap
          : resolvedPlacement === 'left'
            ? triggerRect.left - tooltipRect.width - gap
            : centeredX;
      const rawY =
        resolvedPlacement === 'bottom'
          ? triggerRect.bottom + gap
          : resolvedPlacement === 'top'
            ? triggerRect.top - tooltipRect.height - gap
            : centeredY;
      const minX = viewportLeft + margin;
      const minY = viewportTop + margin;

      setPosition({
        x: Math.max(
          minX,
          Math.min(
            rawX,
            viewportLeft + viewportWidth - tooltipRect.width - margin,
          ),
        ),
        y: Math.max(
          minY,
          Math.min(
            rawY,
            viewportTop + viewportHeight - tooltipRect.height - margin,
          ),
        ),
        placement: resolvedPlacement,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(updatePosition);
    resizeObserver?.observe(triggerElement);
    resizeObserver?.observe(tooltip);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
      resizeObserver?.disconnect();
    };
  }, [content, disabled, isFocused, isHovered, placement, portalTarget]);

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    setIsFocused(
      event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget),
    );
  };

  const tooltipContentStyle: TooltipContentStyle = {
    left: position?.x ?? 0,
    top: position?.y ?? 0,
    '--notable-tooltip-delay': `${Math.max(0, delay)}ms`,
  };

  return (
    <>
      <span
        ref={wrapperRef}
        className={['notable-tooltip', className].filter(Boolean).join(' ')}
        data-placement={position?.placement ?? placement}
        data-disabled={disabled || undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
      >
        {trigger}
      </span>
      {portalTarget &&
        createPortal(
          <span
            ref={tooltipRef}
            className="notable-tooltip__content"
            id={tooltipId}
            role="tooltip"
            data-placement={position?.placement ?? placement}
            data-open={(!disabled && (isHovered || isFocused)) || undefined}
            hidden={disabled}
            style={tooltipContentStyle}
          >
            {content}
          </span>,
          portalTarget,
        )}
    </>
  );
}
