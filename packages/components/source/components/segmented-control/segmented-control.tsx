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

export type SegmentedControlSize = 'small' | 'medium' | 'large';

export type SegmentedControlOption<TValue extends string = string> = {
  /** The visible label content. */
  label: ReactNode;
  /** The unique value for this option. */
  value: TValue;
  /** Whether this individual option is disabled. */
  disabled?: boolean;
  /** An optional icon displayed alongside the label. */
  icon?: ReactNode;
  /** Optional explicit accessible label for this option. */
  'aria-label'?: string;
};

export type SegmentedControlProps<TValue extends string = string> = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> & {
  /** The available options to display. */
  options: readonly SegmentedControlOption<TValue>[];
  /** The selected value for controlled usage. */
  value?: TValue;
  /** The initial selected value for uncontrolled usage. */
  defaultValue?: TValue;
  /** Callback invoked when the selected value changes. */
  onChange?: (value: TValue) => void;
  /** Disables the entire control. */
  disabled?: boolean;
  /** The visual size of the control. Defaults to 'medium'. */
  size?: SegmentedControlSize;
  /** Form field name for native radio inputs. */
  name?: string;
  /** Optional visible group label rendered above the control. */
  label?: ReactNode;
};

type SegmentedControlComponent = <TValue extends string = string>(
  props: SegmentedControlProps<TValue> & { ref?: Ref<HTMLDivElement> },
) => ReactNode;

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
      'bodypop-segmented-control',
      `bodypop-segmented-control--${size}`,
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
                className="bodypop-segmented-control__item"
                data-selected={isSelected || undefined}
                data-disabled={isOptionDisabled || undefined}
              >
                <input
                  id={optionId}
                  type="radio"
                  className="bodypop-segmented-control__input"
                  name={groupName}
                  value={option.value}
                  checked={isSelected}
                  disabled={isOptionDisabled}
                  aria-label={option['aria-label']}
                  onChange={() => handleSelect(option.value)}
                />
                {isSelected && (
                  <motion.span
                    layoutId={`bodypop-segmented-control-indicator-${controlId}`}
                    className="bodypop-segmented-control__indicator"
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
                <span className="bodypop-segmented-control__content">
                  {option.icon && (
                    <span
                      className="bodypop-segmented-control__icon"
                      aria-hidden="true"
                    >
                      {option.icon}
                    </span>
                  )}
                  <span className="bodypop-segmented-control__label">
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
          className="bodypop-segmented-control-field"
          data-disabled={disabled || undefined}
        >
          <span id={labelId} className="bodypop-segmented-control__group-label">
            {label}
          </span>
          {controlContent}
        </div>
      );
    }

    return controlContent;
  },
) as unknown as SegmentedControlComponent;
