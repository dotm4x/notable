import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cloneElement, useId, type ReactElement } from 'react';
import './tooltip.css';

/** Preferred side of the trigger where the tooltip is displayed. */
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

/** Props for {@link Tooltip}. */
export type TooltipProps = {
  /** Single trigger element. Receives the tooltip's `aria-describedby` automatically. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** Additional CSS class for the trigger wrapper. */
  className?: string;
  /** Text displayed in the tooltip. */
  content: string;
  /** Delay before showing the tooltip, in milliseconds. Defaults to `350`. */
  delay?: number;
  /** Prevents the tooltip from being shown. Defaults to `false`. */
  disabled?: boolean;
  /** Preferred position; Base UI flips and shifts it to fit within the viewport. */
  placement?: TooltipPlacement;
};

/**
 * Adds a tooltip that appears on hover or focus. The popup is rendered in a
 * portal and associated with the trigger through `aria-describedby`.
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
  const existingDescribedBy = children.props['aria-describedby'];
  const describedBy = disabled
    ? existingDescribedBy
    : [existingDescribedBy, tooltipId].filter(Boolean).join(' ') || undefined;
  const wrapperClassName = ['notable-tooltip', className]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseTooltip.Root disabled={disabled}>
      <span className={wrapperClassName}>
        <BaseTooltip.Trigger
          delay={delay}
          render={cloneElement(children, { 'aria-describedby': describedBy })}
        />
      </span>
      {!disabled && (
        <BaseTooltip.Portal keepMounted>
          <BaseTooltip.Positioner side={placement} sideOffset={6}>
            <BaseTooltip.Popup
              id={tooltipId}
              role="tooltip"
              className="notable-tooltip__content"
            >
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      )}
    </BaseTooltip.Root>
  );
}
