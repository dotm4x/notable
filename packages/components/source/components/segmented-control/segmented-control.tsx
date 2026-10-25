import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SPRING_LAYOUT } from '../../styles/motion.js';
import './segmented-control.css';

const DRAG_THRESHOLD = 3;

/** Available segmented control sizes. */
export type SegmentedControlSize = 'small' | 'medium' | 'large';

/** A selectable option in a {@link SegmentedControl}. */
export type SegmentedControlOption<TValue extends string = string> = {
  /** Visible label content. */
  label: ReactNode;
  /** Unique value for this option. */
  value: TValue;
  /** Whether this option is disabled. */
  disabled?: boolean;
  /** Optional icon displayed alongside the label. */
  icon?: ReactNode;
  /** Optional explicit accessible name for the option. */
  'aria-label'?: string;
};

/** Props for a single-selection options group. */
export type SegmentedControlProps<TValue extends string = string> = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> & {
  /** Options displayed in the group. */
  options: readonly SegmentedControlOption<TValue>[];
  /** Selected value in controlled mode. */
  value?: TValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: TValue;
  /** Called with the selected value when the selection changes. */
  onChange?: (value: TValue) => void;
  /** Disables all options. */
  disabled?: boolean;
  /** Visual size. Defaults to `medium`. */
  size?: SegmentedControlSize;
  /** Name shared by native radio inputs for form submission. */
  name?: string;
  /** Optional visible group label rendered above the control. */
  label?: ReactNode;
};

type SegmentedControlComponent = <TValue extends string = string>(
  props: SegmentedControlProps<TValue> & { ref?: Ref<HTMLDivElement> },
) => ReactNode;

type IndicatorBounds = {
  left: number;
  width: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  offsetX: number;
  moved: boolean;
};

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
      options,
      size = 'medium',
      value,
      ...props
    }: SegmentedControlProps<TValue>,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const groupName = name ?? `notable-segmented-control-${controlId}`;
    const labelId = label ? `${controlId}-label` : undefined;
    const resolvedAriaLabelledBy = ariaLabelledBy ?? labelId;
    const shouldReduceMotion = useReducedMotion();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef(new Map<TValue, HTMLLabelElement>());
    const dragRef = useRef<DragState | null>(null);
    const suppressClickRef = useRef(false);

    const [uncontrolledValue, setUncontrolledValue] = useState<
      TValue | undefined
    >(defaultValue);
    const [indicatorBounds, setIndicatorBounds] =
      useState<IndicatorBounds | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : uncontrolledValue;
    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );

    const setContainerRef = (element: HTMLDivElement | null) => {
      containerRef.current = element;

      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const handleSelect = (optionValue: TValue) => {
      if (disabled) {
        return;
      }

      const targetOption = options.find(
        (option) => option.value === optionValue,
      );

      if (targetOption?.disabled || optionValue === selectedValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(optionValue);
      }

      onChange?.(optionValue);
    };

    const getItemBounds = useCallback((optionValue: TValue) => {
      const container = containerRef.current;
      const item = itemRefs.current.get(optionValue);

      if (!container || !item) {
        return null;
      }

      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      return {
        left: itemRect.left - containerRect.left - container.clientLeft,
        width: itemRect.width,
      };
    }, []);

    const measureIndicator = useCallback(() => {
      if (!selectedOption) {
        setIndicatorBounds(null);
        return;
      }

      const bounds = getItemBounds(selectedOption.value);

      if (bounds) {
        setIndicatorBounds(bounds);
      }
    }, [getItemBounds, selectedOption]);

    useLayoutEffect(() => {
      if (!dragRef.current) {
        measureIndicator();
      }
    }, [measureIndicator]);

    useEffect(() => {
      const container = containerRef.current;

      if (!container || typeof ResizeObserver === 'undefined') {
        return;
      }

      const observer = new ResizeObserver(() => {
        if (!dragRef.current) {
          measureIndicator();
        }
      });

      observer.observe(container);

      for (const item of itemRefs.current.values()) {
        observer.observe(item);
      }

      return () => observer.disconnect();
    }, [measureIndicator]);

    const getOptionAtPosition = (clientX: number) => {
      let closestOption: (typeof options)[number] | undefined;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const option of options) {
        if (disabled || option.disabled) {
          continue;
        }

        const item = itemRefs.current.get(option.value);

        if (!item) {
          continue;
        }

        const rect = item.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(clientX - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestOption = option;
        }
      }

      return closestOption;
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      suppressClickRef.current = false;

      if (disabled || !selectedOption || event.button !== 0) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const item = target.closest<HTMLElement>(
        '.notable-segmented-control__item',
      );

      if (!item || item.dataset.selected === undefined || !indicatorBounds) {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const indicatorLeft =
        containerRect.left + container.clientLeft + indicatorBounds.left;

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        offsetX: event.clientX - indicatorLeft,
        moved: false,
      };

      try {
        container.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture may be unavailable in some test environments.
      }
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const container = containerRef.current;

      if (!drag || !container || drag.pointerId !== event.pointerId) {
        return;
      }

      if (
        !drag.moved &&
        Math.abs(event.clientX - drag.startX) < DRAG_THRESHOLD
      ) {
        return;
      }

      drag.moved = true;
      setIsDragging(true);

      const containerRect = container.getBoundingClientRect();
      const pointerLeft =
        event.clientX -
        containerRect.left -
        container.clientLeft -
        drag.offsetX;

      const targetOption = getOptionAtPosition(event.clientX);

      if (!targetOption) {
        return;
      }

      const targetBounds = getItemBounds(targetOption.value);

      if (!targetBounds) {
        return;
      }

      const firstOption = options[0];
      const lastOption = options.at(-1);

      const firstBounds = firstOption ? getItemBounds(firstOption.value) : null;
      const lastBounds = lastOption ? getItemBounds(lastOption.value) : null;

      if (!firstBounds || !lastBounds) {
        return;
      }

      const minimumLeft = firstBounds.left;
      const maximumLeft =
        lastBounds.left + lastBounds.width - targetBounds.width;

      setIndicatorBounds({
        left: Math.max(minimumLeft, Math.min(pointerLeft, maximumLeft)),
        width: targetBounds.width,
      });
    };

    const finishDrag = (
      event: ReactPointerEvent<HTMLDivElement>,
      cancelled: boolean,
    ) => {
      const drag = dragRef.current;
      const container = containerRef.current;

      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      dragRef.current = null;
      setIsDragging(false);

      if (drag.moved) {
        suppressClickRef.current = true;

        if (!cancelled) {
          const option = getOptionAtPosition(event.clientX);

          if (option) {
            handleSelect(option.value);
          }
        }
      }

      if (container?.hasPointerCapture?.(event.pointerId)) {
        container.releasePointerCapture?.(event.pointerId);
      }

      measureIndicator();
    };

    const classes = [
      'notable-segmented-control',
      `notable-segmented-control--${size}`,
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
        data-dragging={isDragging || undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishDrag(event, false)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onClickCapture={(event) => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        {selectedOption && indicatorBounds && (
          <motion.span
            className="notable-segmented-control__indicator"
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
                : isDragging
                  ? {
                      left: { duration: 0 },
                      width: SPRING_LAYOUT,
                    }
                  : SPRING_LAYOUT
            }
          />
        )}

        {options.map((option, index) => {
          const isSelected = option.value === selectedValue;
          const isOptionDisabled = disabled || Boolean(option.disabled);
          const optionId = `${controlId}-option-${index}`;

          return (
            <label
              key={`${option.value}-${index}`}
              ref={(element) => {
                if (element) {
                  itemRefs.current.set(option.value, element);
                } else {
                  itemRefs.current.delete(option.value);
                }
              }}
              htmlFor={optionId}
              className="notable-segmented-control__item"
              data-selected={isSelected || undefined}
              data-disabled={isOptionDisabled || undefined}
            >
              <input
                id={optionId}
                type="radio"
                className="notable-segmented-control__input"
                name={groupName}
                value={option.value}
                checked={isSelected}
                disabled={isOptionDisabled}
                aria-label={option['aria-label']}
                onChange={() => handleSelect(option.value)}
              />
              <span className="notable-segmented-control__content">
                {option.icon && (
                  <span
                    className="notable-segmented-control__icon"
                    aria-hidden="true"
                  >
                    {option.icon}
                  </span>
                )}
                <span className="notable-segmented-control__label">
                  {option.label}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    );

    if (label) {
      return (
        <div
          className="notable-segmented-control-field"
          data-disabled={disabled || undefined}
        >
          <span id={labelId} className="notable-segmented-control__group-label">
            {label}
          </span>
          {controlContent}
        </div>
      );
    }

    return controlContent;
  },
) as unknown as SegmentedControlComponent;
