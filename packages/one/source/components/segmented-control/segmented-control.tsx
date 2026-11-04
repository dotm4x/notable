import {
  forwardRef,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { motion } from 'motion/react';
import { selectEdgeRadioOnKeyDown } from '../../internal/helpers/radio-edge-keys.js';
import { SPRING_LAYOUT } from '../../styles/motion.js';
import { useSegmentedControl } from './hooks/use-segmented-control.js';
import { SegmentedControlOptionItem } from './parts/option.js';
import type { SegmentedControlProps } from './types.js';
import './segmented-control.css';

export type {
  SegmentedControlOption,
  SegmentedControlProps,
  SegmentedControlSize,
} from './types.js';

type SegmentedControlComponent = <TValue extends string = string>(
  props: SegmentedControlProps<TValue> & { ref?: Ref<HTMLDivElement> },
) => ReactNode;

/**
 * Renders a single-selection radio group with controlled and uncontrolled modes.
 * Supports dragging the selection indicator with a mouse or touch input.
 */
export const SegmentedControl: SegmentedControlComponent = forwardRef(
  function SegmentedControl<TValue extends string = string>(
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className,
      defaultValue,
      disabled = false,
      id,
      label,
      name,
      onChange,
      onKeyDown,
      options,
      size = 'medium',
      value,
      ...props
    }: SegmentedControlProps<TValue>,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const {
      controlId,
      groupName,
      setContainerRef,
      selectedValue,
      selectedOption,
      indicatorBounds,
      drag,
      shouldReduceMotion,
      registerItem,
      handleSelect,
    } = useSegmentedControl({
      options,
      value,
      defaultValue,
      disabled,
      id,
      name,
      onChange,
      forwardedRef: ref,
    });

    const labelId = label ? `${controlId}-label` : undefined;
    const resolvedAriaLabelledBy = ariaLabelledBy ?? labelId;
    const classes = [
      'one-segmented-control',
      `one-segmented-control--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const controlContent = (
      <div
        {...props}
        ref={setContainerRef}
        id={controlId}
        role="radiogroup"
        className={classes}
        aria-label={ariaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        data-dragging={drag.isDragging || undefined}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onPointerCancel={drag.onPointerCancel}
        onClickCapture={drag.onClickCapture}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented) {
            selectEdgeRadioOnKeyDown(event);
          }
        }}
      >
        {selectedOption && indicatorBounds && (
          <motion.span
            className="one-segmented-control__indicator"
            data-disabled={disabled || selectedOption.disabled || undefined}
            aria-hidden="true"
            initial={false}
            animate={{
              left: indicatorBounds.left,
              width: indicatorBounds.width,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : drag.isDragging
                  ? { left: { duration: 0 }, width: SPRING_LAYOUT }
                  : SPRING_LAYOUT
            }
          />
        )}

        {options.map((option, index) => (
          <SegmentedControlOptionItem
            key={`${option.value}-${index}`}
            option={option}
            index={index}
            controlId={controlId}
            groupName={groupName}
            selectedValue={selectedValue}
            disabled={disabled}
            onSelect={handleSelect}
            registerItem={registerItem}
          />
        ))}
      </div>
    );

    if (label) {
      return (
        <div
          className="one-segmented-control-field"
          data-disabled={disabled || undefined}
        >
          <span id={labelId} className="one-segmented-control__group-label">
            {label}
          </span>
          {controlContent}
        </div>
      );
    }

    return controlContent;
  },
) as unknown as SegmentedControlComponent;
