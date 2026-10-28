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
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { selectEdgeRadioOnKeyDown } from '../../internal/helpers/radio-edge-keys.js';
import { SPRING_LAYOUT } from '../../styles/motion.js';
import {
  useSelectorDrag,
  type SelectorBounds,
} from '../../internal/helpers/use-selector-drag.js';
import './segmented-control.css';

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
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const groupName = name ?? `notable-segmented-control-${controlId}`;
    const labelId = label ? `${controlId}-label` : undefined;
    const resolvedAriaLabelledBy = ariaLabelledBy ?? labelId;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef(new Map<TValue, HTMLLabelElement>());
    const shouldReduceMotion = useReducedMotion();

    const [uncontrolledValue, setUncontrolledValue] = useState<
      TValue | undefined
    >(defaultValue);
    const [indicatorBounds, setIndicatorBounds] =
      useState<SelectorBounds | null>(null);

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

    const getItemBounds = useCallback(
      (optionValue: TValue) => {
        const container = containerRef.current;
        const item = itemRefs.current.get(optionValue);

        if (!container || !item) {
          return null;
        }

        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const containerStyle = getComputedStyle(container);
        const paddingLeft = Number.parseFloat(containerStyle.paddingLeft) || 0;
        const paddingRight =
          Number.parseFloat(containerStyle.paddingRight) || 0;
        const isFirst = options[0]?.value === optionValue;
        const isLast = options[options.length - 1]?.value === optionValue;

        // The indicator reaches the container padding at the ends so it sits flush with the border.
        const extendLeft = isFirst ? paddingLeft : 0;
        const extendRight = isLast ? paddingRight : 0;

        return {
          left:
            itemRect.left -
            containerRect.left -
            container.clientLeft -
            extendLeft,
          width: itemRect.width + extendLeft + extendRight,
        };
      },
      [options],
    );

    const getItemElement = useCallback(
      (optionValue: TValue) => itemRefs.current.get(optionValue),
      [],
    );
    const getItems = useCallback(() => options, [options]);

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
      measureIndicator();
    }, [measureIndicator]);

    useEffect(() => {
      const container = containerRef.current;

      if (!container || typeof ResizeObserver === 'undefined') {
        return;
      }

      const observer = new ResizeObserver(() => {
        measureIndicator();
      });

      observer.observe(container);

      for (const item of itemRefs.current.values()) {
        observer.observe(item);
      }

      return () => observer.disconnect();
    }, [measureIndicator]);

    const drag = useSelectorDrag({
      containerRef,
      disabled,
      indicatorBounds,
      getItems,
      getItemElement,
      getItemBounds,
      onBoundsChange: setIndicatorBounds,
      onSelect: handleSelect,
      measureIndicator,
      selectedValue,
    });

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
                : drag.isDragging
                  ? { left: { duration: 0 }, width: SPRING_LAYOUT }
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
              data-selector-item
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
