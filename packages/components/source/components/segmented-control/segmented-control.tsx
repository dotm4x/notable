import {
  forwardRef,
  useId,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
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
 * Disabled options cannot be selected, and selection changes call `onChange`.
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
    const groupName = name ?? `bodypop-segmented-control-${controlId}`;
    const labelId = label ? `${controlId}-label` : undefined;
    const resolvedAriaLabelledBy = ariaLabelledBy ?? labelId;
    const shouldReduceMotion = useReducedMotion();

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<
      TValue | undefined
    >(defaultValue);
    const selectedValue = isControlled ? value : uncontrolledValue;

    const handleSelect = (optionValue: TValue) => {
      if (disabled) {
        return;
      }

      const targetOption = options.find((opt) => opt.value === optionValue);
      if (targetOption?.disabled) {
        return;
      }

      if (optionValue === selectedValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(optionValue);
      }

      onChange?.(optionValue);
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
        ref={ref}
        id={controlId}
        role="radiogroup"
        className={classes}
        aria-label={ariaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
      >
        <LayoutGroup id={controlId}>
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isOptionDisabled = disabled || Boolean(option.disabled);
            const optionId = `${controlId}-option-${index}`;

            return (
              <label
                key={`${option.value}-${index}`}
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
                {isSelected && (
                  <motion.span
                    layoutId={`notable-segmented-control-indicator-${controlId}`}
                    className="notable-segmented-control__indicator"
                    data-disabled={isOptionDisabled || undefined}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 450,
                            damping: 35,
                          }
                    }
                    aria-hidden="true"
                  />
                )}
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
        </LayoutGroup>
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
